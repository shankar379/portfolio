import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import './GreetingModel.css';

const GreetingModel = ({ shouldPlay = false }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleSystemRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particleCount = 5000;
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
  const colorChangeRadiusRef = useRef(1.5);

  // Morph state
  const shouldMorphRef = useRef(false);
  const morphProgressRef = useRef(0);

  // Update morph ref when prop changes
  useEffect(() => {
    shouldMorphRef.current = shouldPlay;
  }, [shouldPlay]);

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
    camera.position.z = 3;
    camera.position.y = 0.5;
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

    // Random floating positions (spread across space)
    const randomPositions = new Float32Array(particleCount * 3);
    const floatOffsets = new Float32Array(particleCount * 3);
    const floatSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      randomPositions[i3] = (Math.random() - 0.5) * 5;
      randomPositions[i3 + 1] = (Math.random() - 0.5) * 5;
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 3;

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

    // Target positions for greeting pose shape
    const greetingPositions = new Float32Array(particleCount * 3);
    let modelLoaded = false;

    // Load FBX model and extract pose at frame 20
    const loader = new FBXLoader();
    loader.load(
      '/models/Standing Greeting.fbx',
      (fbx) => {
        fbx.scale.setScalar(0.01);

        // Setup animation and go to frame 20
        if (fbx.animations && fbx.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(fbx);
          const clip = fbx.animations[0];
          const action = mixer.clipAction(clip);
          action.play();

          // Calculate time for frame 50 (assuming 30fps animation)
          const fps = 30;
          const frameTime = 50 / fps;

          // Update mixer to frame 20
          mixer.setTime(frameTime);
          mixer.update(0);
        }

        // Update all bones/skeleton
        fbx.updateMatrixWorld(true);

        // Collect all vertex positions from the posed mesh
        const sampledPositions = [];

        fbx.traverse((child) => {
          if (child.isSkinnedMesh) {
            // For skinned mesh, we need to compute posed positions
            const mesh = child;
            const positionAttribute = mesh.geometry.attributes.position;
            const skinIndexAttr = mesh.geometry.attributes.skinIndex;
            const skinWeightAttr = mesh.geometry.attributes.skinWeight;

            if (skinIndexAttr && skinWeightAttr && mesh.skeleton) {
              mesh.skeleton.update();
              const boneMatrices = mesh.skeleton.boneMatrices;
              const bindMatrix = mesh.bindMatrix;

              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);

                // Apply bind matrix
                vertex.applyMatrix4(bindMatrix);

                // Get skin weights and indices
                const skinIndex = new THREE.Vector4().fromBufferAttribute(skinIndexAttr, i);
                const skinWeight = new THREE.Vector4().fromBufferAttribute(skinWeightAttr, i);

                // Apply skinning
                const skinnedVertex = new THREE.Vector3(0, 0, 0);

                for (let j = 0; j < 4; j++) {
                  const weight = skinWeight.getComponent(j);
                  if (weight > 0) {
                    const boneIndex = skinIndex.getComponent(j);
                    const boneMatrixIndex = boneIndex * 16;
                    const boneMatrix = new THREE.Matrix4().fromArray(boneMatrices, boneMatrixIndex);

                    const transformed = vertex.clone().applyMatrix4(boneMatrix);
                    skinnedVertex.add(transformed.multiplyScalar(weight));
                  }
                }

                // Apply world matrix
                skinnedVertex.applyMatrix4(mesh.matrixWorld);
                sampledPositions.push(skinnedVertex);
              }
            }
          } else if (child.isMesh) {
            // Regular mesh - just get positions
            const positionAttribute = child.geometry.attributes.position;
            child.updateWorldMatrix(true, false);

            for (let i = 0; i < positionAttribute.count; i++) {
              const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
              vertex.applyMatrix4(child.matrixWorld);
              sampledPositions.push(vertex);
            }
          }
        });

        if (sampledPositions.length > 0) {
          // Calculate bounding box and normalize
          const boundingBox = new THREE.Box3();
          sampledPositions.forEach(pos => boundingBox.expandByPoint(pos));

          const center = new THREE.Vector3();
          boundingBox.getCenter(center);

          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;

          // Assign particles to sampled positions
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const sampleIndex = Math.floor((i / particleCount) * sampledPositions.length);
            const pos = sampledPositions[sampleIndex] || sampledPositions[0];

            // Add small random offset for particle distribution
            const offset = 0.02;
            greetingPositions[i3] = (pos.x - center.x) * scale + (Math.random() - 0.5) * offset;
            greetingPositions[i3 + 1] = (pos.y - center.y) * scale + (Math.random() - 0.5) * offset;
            greetingPositions[i3 + 2] = (pos.z - center.z) * scale + (Math.random() - 0.5) * offset;
          }

          modelLoaded = true;
          console.log('Model loaded with', sampledPositions.length, 'vertices');
        }
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
      },
      (error) => {
        console.error('Error loading FBX model:', error);
        // Fallback to humanoid shape
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const t = i / particleCount;

          if (t < 0.1) {
            // Head
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.25;
            greetingPositions[i3] = Math.cos(angle) * radius;
            greetingPositions[i3 + 1] = 1.4 + Math.sin(angle) * radius * 0.8;
            greetingPositions[i3 + 2] = (Math.random() - 0.5) * 0.25;
          } else if (t < 0.45) {
            // Torso
            greetingPositions[i3] = (Math.random() - 0.5) * 0.5;
            greetingPositions[i3 + 1] = 0.5 + Math.random() * 0.7;
            greetingPositions[i3 + 2] = (Math.random() - 0.5) * 0.25;
          } else if (t < 0.6) {
            // Right arm (waving up)
            const armT = (t - 0.45) / 0.15;
            greetingPositions[i3] = 0.35 + armT * 0.5;
            greetingPositions[i3 + 1] = 1.0 + armT * 0.6;
            greetingPositions[i3 + 2] = (Math.random() - 0.5) * 0.12;
          } else if (t < 0.75) {
            // Left arm
            const armT = (t - 0.6) / 0.15;
            greetingPositions[i3] = -0.3 - armT * 0.4;
            greetingPositions[i3 + 1] = 0.85 - armT * 0.35;
            greetingPositions[i3 + 2] = (Math.random() - 0.5) * 0.12;
          } else {
            // Legs
            const legSide = Math.random() > 0.5 ? 0.15 : -0.15;
            greetingPositions[i3] = legSide + (Math.random() - 0.5) * 0.12;
            greetingPositions[i3 + 1] = Math.random() * 0.5 - 0.3;
            greetingPositions[i3 + 2] = (Math.random() - 0.5) * 0.15;
          }
        }
        modelLoaded = true;
      }
    );

    let time = 0;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      const positionAttr = particleSystem.geometry.attributes.position;
      const positionsArray = positionAttr.array;
      const colorAttr = particleSystem.geometry.attributes.color;
      const colorsArray = colorAttr.array;

      // Morph animation
      if (shouldMorphRef.current && modelLoaded) {
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

        const targetX = greetingPositions[i3] * morphAmount + floatX * floatAmount;
        const targetY = greetingPositions[i3 + 1] * morphAmount + floatY * floatAmount;
        const targetZ = greetingPositions[i3 + 2] * morphAmount + floatZ * floatAmount;

        const lerpSpeed = morphAmount > 0 ? 0.04 : 0.02;
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

      // No auto-rotate - only rotate on drag

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

      particleSystem.rotation.y = currentRotationRef.current.y;
      particleSystem.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

    // Event handlers
    const handleMouseDown = (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleHoverMove = (e) => {
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
      if (!isDraggingRef.current) return;

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
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
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
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="greeting-model-container" />;
};

export default GreetingModel;
