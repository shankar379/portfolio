import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import './GreetingModel.css';

const GreetingModel = ({ shouldPlay = false }) => {
  const containerRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const animationFrameRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 4);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Purple accent light
    const purpleLight = new THREE.PointLight(0xa78bfa, 0.8, 10);
    purpleLight.position.set(-3, 2, 2);
    scene.add(purpleLight);

    // Blue accent light
    const blueLight = new THREE.PointLight(0x3b82f6, 0.5, 10);
    blueLight.position.set(3, 1, 3);
    scene.add(blueLight);

    // Load FBX model with animation
    const loader = new FBXLoader();
    loader.load(
      '/models/Standing Greeting.fbx',
      (fbx) => {
        fbx.scale.setScalar(0.012); // Adjust scale as needed
        fbx.position.set(0, 0, 0);

        // Apply material to all meshes
        fbx.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Create a nice material
            child.material = new THREE.MeshStandardMaterial({
              color: 0x2d2d50,
              metalness: 0.1,
              roughness: 0.8,
            });
          }
        });

        scene.add(fbx);
        modelRef.current = fbx;

        // Setup animation mixer
        if (fbx.animations && fbx.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(fbx);
          mixerRef.current = mixer;

          const action = mixer.clipAction(fbx.animations[0]);
          action.setLoop(THREE.LoopRepeat);
          action.clampWhenFinished = false;

          // Start paused, will play when visible
          action.paused = true;
          action.play();
        }
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      (error) => {
        console.error('Error loading FBX:', error);
      }
    );

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();

      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Subtle idle rotation when not playing animation
      if (modelRef.current && !shouldPlay) {
        modelRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer && containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  // Control animation playback based on shouldPlay prop
  useEffect(() => {
    if (mixerRef.current) {
      const actions = mixerRef.current._actions;
      if (actions && actions.length > 0) {
        actions.forEach(action => {
          action.paused = !shouldPlay;
          if (shouldPlay && action.time === 0) {
            action.reset();
          }
        });
      }
    }
  }, [shouldPlay]);

  return <div ref={containerRef} className="greeting-model-container" />;
};

export default GreetingModel;
