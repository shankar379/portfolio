import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './SolarSystemParticles.css';

const SolarSystemParticles = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Mouse interaction refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: 0 });
  const currentRotationRef = useRef({ x: 0.3, y: 0 });
  const isDraggingRef = useRef(false);
  const zoomRef = useRef(25);
  const targetZoomRef = useRef(25);

  // Planet data: name, color, orbitRadius, size, orbitSpeed, particleCount
  const planets = [
    { name: 'sun', color: 0xffd700, orbitRadius: 0, size: 2.0, orbitSpeed: 0, particles: 3000, emissive: true },
    { name: 'mercury', color: 0xb5b5b5, orbitRadius: 4, size: 0.3, orbitSpeed: 4.15, particles: 200 },
    { name: 'venus', color: 0xffc649, orbitRadius: 5.5, size: 0.5, orbitSpeed: 1.62, particles: 350 },
    { name: 'earth', color: 0x6b93d6, orbitRadius: 7, size: 0.55, orbitSpeed: 1.0, particles: 400 },
    { name: 'mars', color: 0xc1440e, orbitRadius: 8.5, size: 0.4, orbitSpeed: 0.53, particles: 280 },
    { name: 'jupiter', color: 0xd8ca9d, orbitRadius: 11, size: 1.2, orbitSpeed: 0.084, particles: 800 },
    { name: 'saturn', color: 0xead6b8, orbitRadius: 14, size: 1.0, orbitSpeed: 0.034, particles: 700, hasRing: true },
    { name: 'uranus', color: 0xd1e7e7, orbitRadius: 17, size: 0.7, orbitSpeed: 0.012, particles: 450 },
    { name: 'neptune', color: 0x5b5ddf, orbitRadius: 20, size: 0.65, orbitSpeed: 0.006, particles: 400 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoomRef.current;
    camera.position.y = 10;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create orbit lines
    const orbitGroup = new THREE.Group();
    planets.forEach((planet) => {
      if (planet.orbitRadius > 0) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            planet.orbitRadius * Math.cos(angle),
            0,
            planet.orbitRadius * Math.sin(angle)
          );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0x444466,
          transparent: true,
          opacity: 0.3
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        orbitGroup.add(orbitLine);
      }
    });
    scene.add(orbitGroup);

    // Create planet particle systems
    const planetSystems = [];
    const planetAngles = planets.map(() => Math.random() * Math.PI * 2); // Random starting positions

    planets.forEach((planet, planetIndex) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(planet.particles * 3);
      const colors = new Float32Array(planet.particles * 3);
      const baseColor = new THREE.Color(planet.color);

      // Create sphere of particles for each planet
      for (let i = 0; i < planet.particles; i++) {
        const i3 = i * 3;

        // Fibonacci sphere distribution
        const phi = Math.acos(-1 + (2 * i) / planet.particles);
        const theta = Math.sqrt(planet.particles * Math.PI) * phi;

        let x = planet.size * Math.cos(theta) * Math.sin(phi);
        let y = planet.size * Math.sin(theta) * Math.sin(phi);
        let z = planet.size * Math.cos(phi);

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Color with slight variation
        const colorVariation = 0.1 + Math.random() * 0.2;
        if (planet.emissive) {
          // Sun has brighter, more varied colors
          colors[i3] = Math.min(1, baseColor.r + colorVariation);
          colors[i3 + 1] = Math.min(1, baseColor.g * (0.5 + Math.random() * 0.5));
          colors[i3 + 2] = Math.min(1, baseColor.b * Math.random() * 0.3);
        } else {
          colors[i3] = baseColor.r * (0.8 + colorVariation);
          colors[i3 + 1] = baseColor.g * (0.8 + colorVariation);
          colors[i3 + 2] = baseColor.b * (0.8 + colorVariation);
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: planet.emissive ? 0.08 : 0.05,
        vertexColors: true,
        transparent: true,
        opacity: planet.emissive ? 1.0 : 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Create Saturn's ring
      let ringSystem = null;
      if (planet.hasRing) {
        const ringGeometry = new THREE.BufferGeometry();
        const ringParticles = 500;
        const ringPositions = new Float32Array(ringParticles * 3);
        const ringColors = new Float32Array(ringParticles * 3);
        const ringColor = new THREE.Color(0xc9b896);

        for (let i = 0; i < ringParticles; i++) {
          const i3 = i * 3;
          const angle = (i / ringParticles) * Math.PI * 2;
          const ringRadius = planet.size * 1.4 + Math.random() * planet.size * 0.8;

          ringPositions[i3] = ringRadius * Math.cos(angle);
          ringPositions[i3 + 1] = (Math.random() - 0.5) * 0.1;
          ringPositions[i3 + 2] = ringRadius * Math.sin(angle);

          ringColors[i3] = ringColor.r * (0.7 + Math.random() * 0.3);
          ringColors[i3 + 1] = ringColor.g * (0.7 + Math.random() * 0.3);
          ringColors[i3 + 2] = ringColor.b * (0.7 + Math.random() * 0.3);
        }

        ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
        ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

        const ringMaterial = new THREE.PointsMaterial({
          size: 0.04,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        });

        ringSystem = new THREE.Points(ringGeometry, ringMaterial);
        scene.add(ringSystem);
      }

      planetSystems.push({
        system: particleSystem,
        ring: ringSystem,
        planet,
        angle: planetAngles[planetIndex]
      });
    });

    // Add star field background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.5 + Math.random() * 0.5;
      starColors[i3] = brightness;
      starColors[i3 + 1] = brightness;
      starColors[i3 + 2] = brightness;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.0001;

      // Update planet positions
      planetSystems.forEach((planetData) => {
        const { system, ring, planet } = planetData;

        if (planet.orbitRadius > 0) {
          // Update orbital angle
          planetData.angle += planet.orbitSpeed * 0.01;

          // Calculate new position
          const x = planet.orbitRadius * Math.cos(planetData.angle);
          const z = planet.orbitRadius * Math.sin(planetData.angle);

          system.position.x = x;
          system.position.z = z;

          if (ring) {
            ring.position.x = x;
            ring.position.z = z;
            ring.rotation.x = 0.5; // Tilt the ring
          }
        } else {
          // Sun rotation
          system.rotation.y += 0.002;
        }

        // Rotate planets on their axis
        system.rotation.y += 0.01;
      });

      // Smooth camera rotation from mouse interaction
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.001;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.05;

      // Apply camera rotation
      const rotationY = currentRotationRef.current.y;
      const rotationX = currentRotationRef.current.x;
      const zoom = zoomRef.current;

      camera.position.x = zoom * Math.sin(rotationY) * Math.cos(rotationX);
      camera.position.y = zoom * Math.sin(rotationX);
      camera.position.z = zoom * Math.cos(rotationY) * Math.cos(rotationX);
      camera.lookAt(0, 0, 0);

      // Rotate orbits with camera view
      orbitGroup.rotation.x = 0;

      // Rotate stars slowly
      stars.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - mouseRef.current.x;
      const deltaY = e.clientY - mouseRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      // Limit vertical rotation
      targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      targetZoomRef.current += e.deltaY * 0.02;
      targetZoomRef.current = Math.max(10, Math.min(50, targetZoomRef.current));
    };

    // Touch handlers
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

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;

      targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));

      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Add event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

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
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer && containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer?.dispose();
    };
  }, []);

  return <div ref={containerRef} className="solar-system-container" />;
};

export default SolarSystemParticles;
