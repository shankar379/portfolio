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
  
  // Detect mobile and adjust particle count
  const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  const particleCount = isMobile ? 2000 : 6000; // Reduce particles on mobile
  const color = new THREE.Color(0xff6d00); // Orange
  const hoverColor = new THREE.Color(0x3b82f6); // Blue
  
  // Performance optimization refs
  const lastFrameTimeRef = useRef(0);
  const frameSkipRef = useRef(0);
  const isVisibleRef = useRef(true);

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
  const originalPositionsRef = useRef(null);

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

      // Store original positions when explosion starts
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        originalPositionsRef.current = new Float32Array(positions);
      }
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
      antialias: !isMobile, // Disable antialiasing on mobile
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    // Lower pixel ratio on mobile for better performance
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1) : Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    raycasterRef.current = new THREE.Raycaster();

    // Create particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

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

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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
    
    // Frame rate limiting for mobile (target 30fps instead of 60fps)
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    lastFrameTimeRef.current = performance.now();

    // Intersection Observer to pause when not visible
    // Initialize as visible to ensure first render
    isVisibleRef.current = true;
    let observer = null;
    
    // Delay observer setup to ensure container is mounted and visible
    setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisibleRef.current = entry.isIntersecting;
          });
        },
        { threshold: 0.01, rootMargin: '100px' } // Lower threshold and add margin
      );
      
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }, 200);

    // Animation loop
    const animate = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Frame rate limiting for mobile
      if (isMobile) {
        const elapsed = currentTime - lastFrameTimeRef.current;
        if (elapsed < frameInterval) {
          return;
        }
        lastFrameTimeRef.current = currentTime - (elapsed % frameInterval);
      } else {
        lastFrameTimeRef.current = currentTime;
      }
      
      // Skip rendering if not visible (but always render on first few frames to initialize)
      if (!isVisibleRef.current && !isExplodingRef.current && time > 0.1) {
        return;
      }
      
      time += 0.016;

      const positionAttr = particleSystem.geometry.attributes.position;
      const positionsArray = positionAttr.array;
      const colorAttr = particleSystem.geometry.attributes.color;
      const colorsArray = colorAttr.array;

      // Simple ball expansion animation - camera goes inside
      if (isExplodingRef.current && originalPositionsRef.current) {
        explodeProgressRef.current += 0.015;
        const progress = explodeProgressRef.current;

        // Easing function for smooth animation
        const easeInOut = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Phase 1: Expand particles like a ball (0 - 1.5)
        if (progress < 1.5) {
          const expandProgress = Math.min(progress / 1.5, 1);
          const expandEase = 1 - Math.pow(1 - expandProgress, 3);

          // Expand factor - particles move outward from center
          const expandFactor = 1 + expandEase * 4; // Expand to 5x size

          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Get original position and expand from center
            const origX = originalPositionsRef.current[i3];
            const origY = originalPositionsRef.current[i3 + 1];
            const origZ = originalPositionsRef.current[i3 + 2];

            positionsArray[i3] = origX * expandFactor;
            positionsArray[i3 + 1] = origY * expandFactor;
            positionsArray[i3 + 2] = origZ * expandFactor;
          }

          // Camera moves INTO the ball (toward center then through)
          const cameraProgress = Math.min(progress / 1.2, 1);
          const cameraEase = cameraProgress < 0.5
            ? 2 * cameraProgress * cameraProgress
            : 1 - Math.pow(-2 * cameraProgress + 2, 2) / 2;

          camera.position.z = initialCameraZ - cameraEase * 5; // Move camera forward into the ball
        }

        // Phase 2: Fade to white (1.0 - 2.0)
        if (progress >= 1.0) {
          const fadeProgress = Math.min((progress - 1.0) / 1.0, 1);
          const fadeEase = fadeProgress * fadeProgress;

          // Particles fade to white
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            colorsArray[i3] = color.r + (1 - color.r) * fadeEase;
            colorsArray[i3 + 1] = color.g + (1 - color.g) * fadeEase;
            colorsArray[i3 + 2] = color.b + (1 - color.b) * fadeEase;
          }
          colorAttr.needsUpdate = true;

          // Increase particle size slightly during fade
          material.size = 0.025 + fadeEase * 0.03;
          material.opacity = 0.9 + fadeEase * 0.1;
        }

        positionAttr.needsUpdate = true;

        // Complete transition
        if (progress >= 2.2 && onExplodeComplete) {
          onExplodeComplete();
        }

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

        // Optimize: Skip color calculations on mobile when not morphed
        const shouldCalculateColors = !isMobile || morphAmount > 0.5;
        
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

          // Only calculate colors when needed (morphed or desktop)
          if (shouldCalculateColors && morphAmount > 0.5) {
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
          } else if (!shouldCalculateColors) {
            // On mobile when not morphed, use simple color
            colorsArray[i3] = color.r;
            colorsArray[i3 + 1] = color.g;
            colorsArray[i3 + 2] = color.b;
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

    animate(performance.now());

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
      // Cleanup observer
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      
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
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="brain-particle-container" />;
};

export default BrainParticleModel;
