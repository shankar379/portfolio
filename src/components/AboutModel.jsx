import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './AboutModel.css';

const AboutModel = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 0;
    cameraRef.current = camera;

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
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Full comprehensive lighting setup
    // Ambient light - base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Hemisphere light - natural sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffaa00, 0.8);
    hemisphereLight.position.set(0, 5, 0);
    scene.add(hemisphereLight);

    // Main directional light - primary key light (orange)
    const directionalLight1 = new THREE.DirectionalLight(0xff6d00, 1.2);
    directionalLight1.position.set(5, 8, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    directionalLight1.shadow.camera.near = 0.5;
    directionalLight1.shadow.camera.far = 50;
    scene.add(directionalLight1);

    // Secondary directional light - fill light (warm orange)
    const directionalLight2 = new THREE.DirectionalLight(0xffaa00, 0.8);
    directionalLight2.position.set(-5, 3, -5);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);

    // Third directional light - rim/back light (yellow-orange)
    const directionalLight3 = new THREE.DirectionalLight(0xffb600, 0.6);
    directionalLight3.position.set(-3, 2, -8);
    scene.add(directionalLight3);

    // Fourth directional light - side light (orange)
    const directionalLight4 = new THREE.DirectionalLight(0xff7900, 0.7);
    directionalLight4.position.set(8, 4, 0);
    scene.add(directionalLight4);

    // Point light 1 - front center
    const pointLight1 = new THREE.PointLight(0xff6d00, 1.0, 100);
    pointLight1.position.set(0, 2, 5);
    scene.add(pointLight1);

    // Point light 2 - top right
    const pointLight2 = new THREE.PointLight(0xffaa00, 0.8, 100);
    pointLight2.position.set(4, 6, 3);
    scene.add(pointLight2);

    // Point light 3 - bottom left
    const pointLight3 = new THREE.PointLight(0xff8500, 0.6, 100);
    pointLight3.position.set(-4, -2, 4);
    scene.add(pointLight3);

    // Spot light - focused accent light
    const spotLight = new THREE.SpotLight(0xff6d00, 1.5, 100, Math.PI / 6, 0.5, 2);
    spotLight.position.set(0, 10, 0);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/about_statue.glb',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Increased scale for larger model
        
        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y = 0;
        
        // Set initial rotation to 90 degrees (facing left)
        const initialRotation = Math.PI / 2; // 90 degrees
        model.rotation.y = initialRotation;
        targetRotationRef.current.y = initialRotation;
        currentRotationRef.current.y = initialRotation;
        
        // Enable shadows and enhance materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance material appearance with increased emission
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (mat) {
                  // Increase emission significantly
                  mat.emissive = mat.emissive || new THREE.Color(0xff6d00);
                  mat.emissiveIntensity = 0.5; // Increased from 0.1 to 0.5
                  if (mat.color) {
                    mat.color.multiplyScalar(1.2);
                  }
                  // Make material more emissive
                  if (mat.emissive) {
                    mat.emissive.multiplyScalar(1.5);
                  }
                }
              });
            }
          }
        });
        
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error);
      }
    );

    // Mouse interaction
    const handleMouseDown = (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseMove = (e) => {
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
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      renderer.domElement.addEventListener('touchend', handleTouchEnd);
    }

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (modelRef.current) {
        // No auto rotation - only update rotation when dragging
        // Smooth rotation interpolation
        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

        modelRef.current.rotation.y = currentRotationRef.current.y;
        modelRef.current.rotation.x = currentRotationRef.current.x;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
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
      
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="about-model-container" />;
};

export default AboutModel;

