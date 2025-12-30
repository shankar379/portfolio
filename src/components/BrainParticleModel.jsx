import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './BrainParticleModel.css';

const BrainParticleModel = ({ isExploding = false, onExplodeComplete, shouldMorph = false }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleSystemRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particleCount = 6000;
  const color = new THREE.Color(0xa78bfa); // Purple
  const hoverColor = new THREE.Color(0x3b82f6); // Blue

  // Mouse interaction
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Hover interaction
  const hoverMouseRef = useRef(new THREE.Vector2(-1000, -1000));
  const mouse3DRef = useRef(new THREE.Vector3());
  const raycasterRef = useRef(new THREE.Raycaster());
  const colorChangeRadiusRef = useRef(2.0);

  // Explosion state
  const isExplodingRef = useRef(false);
  const explodeProgressRef = useRef(0);
  const neuralLinesRef = useRef(null);
  const lineMaterialRef = useRef(null);

  // Morph state
  const shouldMorphRef = useRef(false);
  const morphProgressRef = useRef(0);

  // Update morph ref when prop changes
  useEffect(() => {
    shouldMorphRef.current = shouldMorph;
  }, [shouldMorph]);

  // Update explosion ref when prop changes
  useEffect(() => {
    if (isExploding && !isExplodingRef.current) {
      isExplodingRef.current = true;
      explodeProgressRef.current = 0;
    }
  }, [isExploding]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;
    camera.position.x = 0;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    raycasterRef.current = new THREE.Raycaster();

    // Create particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Random floating positions (spread across space)
    const randomPositions = new Float32Array(particleCount * 3);
    const floatOffsets = new Float32Array(particleCount * 3);
    const floatSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      randomPositions[i3] = (Math.random() - 0.5) * 6;
      randomPositions[i3 + 1] = (Math.random() - 0.5) * 6;
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 4;

      positions[i3] = randomPositions[i3];
      positions[i3 + 1] = randomPositions[i3 + 1];
      positions[i3 + 2] = randomPositions[i3 + 2];

      floatOffsets[i3] = Math.random() * Math.PI * 2;
      floatOffsets[i3 + 1] = Math.random() * Math.PI * 2;
      floatOffsets[i3 + 2] = Math.random() * Math.PI * 2;

      floatSpeeds[i] = 0.5 + Math.random() * 1;
      sizes[i] = 0.025;

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // Create neural connection lines (initially hidden)
    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = 2000;
    const linePositions = new Float32Array(maxLines * 6); // 2 points per line, 3 coords each
    const lineColors = new Float32Array(maxLines * 6);

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    lineGeometry.setDrawRange(0, 0); // Initially draw nothing

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    lineMaterialRef.current = lineMaterial;

    const neuralLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(neuralLines);
    neuralLinesRef.current = neuralLines;

    // Target positions for brain shape
    const brainPositions = new Float32Array(particleCount * 3);
    let brainLoaded = false;

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/Demo2.glb',
      (gltf) => {
        const model = gltf.scene;
        const sampledPositions = [];

        model.traverse((child) => {
          if (child.isMesh) {
            const meshGeometry = child.geometry;
            const positionAttribute = meshGeometry.attributes.position;

            if (positionAttribute) {
              child.updateWorldMatrix(true, false);
              const worldMatrix = child.matrixWorld;

              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3(
                  positionAttribute.getX(i),
                  positionAttribute.getY(i),
                  positionAttribute.getZ(i)
                );
                vertex.applyMatrix4(worldMatrix);
                sampledPositions.push(vertex);
              }
            }
          }
        });

        if (sampledPositions.length > 0) {
          const boundingBox = new THREE.Box3();
          sampledPositions.forEach(pos => boundingBox.expandByPoint(pos));
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;

          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const sampleIndex = Math.floor((i / particleCount) * sampledPositions.length);
            const pos = sampledPositions[sampleIndex] || sampledPositions[0];

            brainPositions[i3] = (pos.x - center.x) * scale;
            brainPositions[i3 + 1] = (pos.y - center.y) * scale;
            brainPositions[i3 + 2] = (pos.z - center.z) * scale;
          }
          brainLoaded = true;
        }
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error);
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const phi = Math.acos(-1 + 2 * (i / particleCount));
          const theta = Math.sqrt(particleCount * Math.PI) * phi;
          const radius = 1.25;
          brainPositions[i3] = radius * Math.cos(theta) * Math.sin(phi);
          brainPositions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
          brainPositions[i3 + 2] = radius * Math.cos(phi);
        }
        brainLoaded = true;
      }
    );

    let time = 0;
    const initialCameraZ = 2.5;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      const positionAttr = particleSystem.geometry.attributes.position;
      const positionsArray = positionAttr.array;
      const colorAttr = particleSystem.geometry.attributes.color;
      const colorsArray = colorAttr.array;

      // Enhanced explosion animation - "Enter the Brain World"
      if (isExplodingRef.current) {
        explodeProgressRef.current += 0.012; // Slower for dramatic effect
        const progress = explodeProgressRef.current;

        // Phase timings
        const phase1End = 0.3;   // Particle doubling/growth
        const phase2End = 1.2;   // Camera zoom into brain
        const phase3End = 2.0;   // Neural connections
        const phase4End = 2.8;   // White fade
        const totalEnd = 3.2;    // Complete

        // Phase 1: Particle growth (0 - 0.3)
        if (progress < phase1End) {
          const growthProgress = progress / phase1End;
          const easeGrowth = 1 - Math.pow(1 - growthProgress, 2);
          material.size = 0.025 + easeGrowth * 0.04; // Grow particles
        }

        // Phase 2: Camera zoom into brain (0.3 - 1.2)
        if (progress >= phase1End && progress < phase2End) {
          const zoomProgress = (progress - phase1End) / (phase2End - phase1End);
          const easeZoom = zoomProgress < 0.5
            ? 2 * zoomProgress * zoomProgress
            : 1 - Math.pow(-2 * zoomProgress + 2, 2) / 2;

          // Camera moves forward into the brain
          camera.position.z = initialCameraZ - easeZoom * 2.8;

          // Slight camera shake for immersion
          camera.position.x = Math.sin(progress * 20) * 0.02 * (1 - zoomProgress);
          camera.position.y = Math.cos(progress * 15) * 0.02 * (1 - zoomProgress);

          // Particles expand slightly outward as camera approaches
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const expandFactor = 1 + easeZoom * 0.3;
            positionsArray[i3] *= 1 + (expandFactor - 1) * 0.01;
            positionsArray[i3 + 1] *= 1 + (expandFactor - 1) * 0.01;
            positionsArray[i3 + 2] *= 1 + (expandFactor - 1) * 0.01;
          }
        }

        // Phase 3: Neural connections appear (0.8 - 2.0)
        if (progress >= 0.8 && progress < phase3End) {
          const connectionProgress = (progress - 0.8) / (phase3End - 0.8);

          // Build neural connections between nearby particles
          const linePositions = neuralLines.geometry.attributes.position.array;
          const lineColors = neuralLines.geometry.attributes.color.array;
          let lineIndex = 0;
          const maxDistance = 0.5 + connectionProgress * 0.3;
          const maxLinesToDraw = Math.floor(connectionProgress * maxLines);

          // Find nearby particles and create connections
          for (let i = 0; i < particleCount && lineIndex < maxLinesToDraw * 2; i += 10) {
            const i3 = i * 3;
            const x1 = positionsArray[i3];
            const y1 = positionsArray[i3 + 1];
            const z1 = positionsArray[i3 + 2];

            // Only connect to particles ahead (in z) for neural flow effect
            for (let j = i + 10; j < particleCount && lineIndex < maxLinesToDraw * 2; j += 15) {
              const j3 = j * 3;
              const x2 = positionsArray[j3];
              const y2 = positionsArray[j3 + 1];
              const z2 = positionsArray[j3 + 2];

              const dx = x2 - x1;
              const dy = y2 - y1;
              const dz = z2 - z1;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              if (dist < maxDistance && dist > 0.1) {
                const li = lineIndex * 3;
                linePositions[li] = x1;
                linePositions[li + 1] = y1;
                linePositions[li + 2] = z1;
                linePositions[li + 3] = x2;
                linePositions[li + 4] = y2;
                linePositions[li + 5] = z2;

                // Gradient color for lines (purple to blue)
                const colorIntensity = 1 - dist / maxDistance;
                lineColors[li] = 0.65 + colorIntensity * 0.2;
                lineColors[li + 1] = 0.55 + colorIntensity * 0.2;
                lineColors[li + 2] = 0.98;
                lineColors[li + 3] = 0.45 + colorIntensity * 0.3;
                lineColors[li + 4] = 0.65 + colorIntensity * 0.2;
                lineColors[li + 5] = 0.98;

                lineIndex += 2;
              }
            }
          }

          neuralLines.geometry.attributes.position.needsUpdate = true;
          neuralLines.geometry.attributes.color.needsUpdate = true;
          neuralLines.geometry.setDrawRange(0, lineIndex);

          // Fade in lines
          lineMaterial.opacity = Math.min(connectionProgress * 1.5, 0.7);
        }

        // Phase 4: Everything fades to white (2.0 - 2.8)
        if (progress >= phase3End) {
          const fadeProgress = Math.min((progress - phase3End) / (phase4End - phase3End), 1);
          const easeFade = fadeProgress * fadeProgress;

          // Particles fade to white
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            colorsArray[i3] = color.r + (1 - color.r) * easeFade;
            colorsArray[i3 + 1] = color.g + (1 - color.g) * easeFade;
            colorsArray[i3 + 2] = color.b + (1 - color.b) * easeFade;
          }
          colorAttr.needsUpdate = true;

          // Lines fade to white then disappear
          const lineColorArr = neuralLines.geometry.attributes.color.array;
          for (let i = 0; i < lineColorArr.length; i++) {
            lineColorArr[i] = lineColorArr[i] + (1 - lineColorArr[i]) * easeFade;
          }
          neuralLines.geometry.attributes.color.needsUpdate = true;
          lineMaterial.opacity = 0.7 * (1 - easeFade * 0.5);

          // Particles glow brighter
          material.size = 0.065 + easeFade * 0.05;
          material.opacity = 0.9 + easeFade * 0.1;
        }

        // Final phase: Complete transition
        if (progress >= totalEnd && onExplodeComplete) {
          onExplodeComplete();
        }

        positionAttr.needsUpdate = true;

      } else {
        // Normal animation - morph or float
        if (shouldMorphRef.current && brainLoaded) {
          morphProgressRef.current = Math.min(morphProgressRef.current + 0.02, 1);
        } else {
          morphProgressRef.current = Math.max(morphProgressRef.current - 0.015, 0);
        }

        const morphAmount = morphProgressRef.current;
        const floatAmount = 1 - morphAmount;

        raycasterRef.current.setFromCamera(hoverMouseRef.current, camera);
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        raycasterRef.current.ray.intersectPlane(planeZ, mouse3DRef.current);

        const inverseRotation = new THREE.Euler(
          -currentRotationRef.current.x,
          -currentRotationRef.current.y,
          0
        );
        const rotatedMouse = mouse3DRef.current.clone().applyEuler(inverseRotation);
        const colorChangeRadius = colorChangeRadiusRef.current;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;

          const floatX = randomPositions[i3] + Math.sin(time * floatSpeeds[i] + floatOffsets[i3]) * 0.3;
          const floatY = randomPositions[i3 + 1] + Math.cos(time * floatSpeeds[i] * 0.7 + floatOffsets[i3 + 1]) * 0.3;
          const floatZ = randomPositions[i3 + 2] + Math.sin(time * floatSpeeds[i] * 0.5 + floatOffsets[i3 + 2]) * 0.2;

          const targetX = brainPositions[i3] * morphAmount + floatX * floatAmount;
          const targetY = brainPositions[i3 + 1] * morphAmount + floatY * floatAmount;
          const targetZ = brainPositions[i3 + 2] * morphAmount + floatZ * floatAmount;

          const lerpSpeed = morphAmount > 0 ? 0.03 : 0.02;
          positionsArray[i3] += (targetX - positionsArray[i3]) * lerpSpeed;
          positionsArray[i3 + 1] += (targetY - positionsArray[i3 + 1]) * lerpSpeed;
          positionsArray[i3 + 2] += (targetZ - positionsArray[i3 + 2]) * lerpSpeed;

          if (morphAmount > 0.5) {
            const dx = positionsArray[i3] - rotatedMouse.x;
            const dy = positionsArray[i3 + 1] - rotatedMouse.y;
            const dz = positionsArray[i3 + 2] - rotatedMouse.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            let colorMix = 0;
            if (distance < colorChangeRadius) {
              colorMix = 1 - (distance / colorChangeRadius);
              colorMix = Math.max(0, Math.min(1, colorMix));
            }

            const particleColor = new THREE.Color().lerpColors(color, hoverColor, colorMix);
            colorsArray[i3] = particleColor.r;
            colorsArray[i3 + 1] = particleColor.g;
            colorsArray[i3 + 2] = particleColor.b;
          } else {
            const colorVariation = Math.sin(time * 0.5 + i * 0.01) * 0.1;
            colorsArray[i3] = color.r + colorVariation;
            colorsArray[i3 + 1] = color.g + colorVariation * 0.5;
            colorsArray[i3 + 2] = color.b;
          }
        }

        positionAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;

        if (!isDraggingRef.current) {
          const rotationSpeed = 0.001 + morphAmount * 0.002;
          targetRotationRef.current.y += rotationSpeed;
        }

        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

        particleSystem.rotation.y = currentRotationRef.current.y;
        particleSystem.rotation.x = currentRotationRef.current.x;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Event handlers
    const handleMouseDown = (e) => {
      if (isExplodingRef.current) return;
      e.preventDefault();
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleHoverMove = (e) => {
      if (isExplodingRef.current) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      hoverMouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      hoverMouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleHoverLeave = () => {
      hoverMouseRef.current.x = -1000;
      hoverMouseRef.current.y = -1000;
    };

    const handleMouseMove = (e) => {
      handleHoverMove(e);
      if (!isDraggingRef.current || isExplodingRef.current) return;

      const deltaX = e.clientX - mouseRef.current.x;
      const deltaY = e.clientY - mouseRef.current.y;

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x += deltaY * 0.01;
      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x));

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
      if (isExplodingRef.current) return;
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1 || isExplodingRef.current) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - mouseRef.current.x;
      const deltaY = e.touches[0].clientY - mouseRef.current.y;

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x += deltaY * 0.01;
      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x));

      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      renderer.domElement.addEventListener('mousemove', handleHoverMove);
      renderer.domElement.addEventListener('mouseleave', handleHoverLeave);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      renderer.domElement.addEventListener('touchend', handleTouchEnd);
    }

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mousemove', handleHoverMove);
        renderer.domElement.removeEventListener('mouseleave', handleHoverLeave);
        renderer.domElement.removeEventListener('touchstart', handleTouchStart);
        renderer.domElement.removeEventListener('touchmove', handleTouchMove);
        renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer && containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (lineGeometry) lineGeometry.dispose();
      if (lineMaterial) lineMaterial.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="brain-particle-container" />;
};

export default BrainParticleModel;
