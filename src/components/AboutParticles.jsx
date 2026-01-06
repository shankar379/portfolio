import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './AboutParticles.css';

const AboutParticles = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleSystemRef = useRef(null);
  const animationFrameRef = useRef(null);
  const shapeIndexRef = useRef(0);
  const targetPositionsRef = useRef(null);
  const currentPositionsRef = useRef(null);
  const particleCount = 1500;
  const color = new THREE.Color(0xff6d00);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Different shapes for About section - energy themed
  const shapes = [
    'energyPulse',
    'wormhole',
    'clockwork',
    'plasmaOrb',
    'quantumField',
    'earthMoon'
  ];

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
    camera.position.z = 5;
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

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // Gradient colors - orange to yellow
      const colorT = i / particleCount;
      const particleColor = new THREE.Color();
      particleColor.lerpColors(
        new THREE.Color(0xff6d00), // orange
        new THREE.Color(0xffaa00), // yellow-orange
        colorT
      );
      colors[i3] = particleColor.r;
      colors[i3 + 1] = particleColor.g;
      colors[i3 + 2] = particleColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;
    currentPositionsRef.current = positions;
    targetPositionsRef.current = new Float32Array(particleCount * 3);

    const generateShapePositions = (shapeType) => {
      const positions = new Float32Array(particleCount * 3);
      const radius = 2;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x, y, z;
        const t = i / particleCount;
        
        switch (shapeType) {
          case 'energyPulse':
            // Expanding energy waves - concentric spheres
            const pulseLayer = Math.floor(t * 5);
            const pulseT = (t * 5) % 1;
            const pulseRadius = (pulseLayer + 0.5) * radius * 0.35;
            const pulsePhi = Math.acos(-1 + 2 * pulseT);
            const pulseTheta = Math.sqrt(particleCount / 5 * Math.PI) * pulsePhi;
            // Add pulsing effect
            const pulseIntensity = 1 + Math.sin(pulseLayer * Math.PI * 0.5) * 0.2;
            x = pulseRadius * pulseIntensity * Math.cos(pulseTheta) * Math.sin(pulsePhi);
            y = pulseRadius * pulseIntensity * Math.sin(pulseTheta) * Math.sin(pulsePhi);
            z = pulseRadius * pulseIntensity * Math.cos(pulsePhi);
            break;
            
          case 'wormhole':
            // Wormhole tunnel - curved tube through space
            const wormholeT = t * Math.PI * 2;
            const wormholeAngle = t * Math.PI * 20;
            const wormholeRadius = radius * 0.4 + Math.sin(wormholeT * 3) * radius * 0.2;
            const wormholeX = radius * 1.2 * Math.sin(wormholeT);
            const wormholeY = radius * 0.5 * Math.sin(wormholeT * 2);
            x = wormholeX + wormholeRadius * Math.cos(wormholeAngle);
            y = wormholeY + wormholeRadius * Math.sin(wormholeAngle) * Math.cos(wormholeT);
            z = radius * Math.cos(wormholeT) + wormholeRadius * Math.sin(wormholeAngle) * Math.sin(wormholeT);
            break;
            
          case 'clockwork':
            // Clock gears and hands - time mechanism
            const clockSection = Math.floor(t * 4);
            const clockT = (t * 4) % 1;
            if (clockSection === 0) {
              // Outer ring (clock face)
              const faceAngle = clockT * Math.PI * 2;
              x = radius * 0.9 * Math.cos(faceAngle);
              y = radius * 0.9 * Math.sin(faceAngle);
              z = 0;
            } else if (clockSection === 1) {
              // Hour hand
              const hourLen = clockT * radius * 0.5;
              const hourAngle = Math.PI * 0.25; // 10:10 position
              x = hourLen * Math.cos(hourAngle);
              y = hourLen * Math.sin(hourAngle);
              z = 0.05;
            } else if (clockSection === 2) {
              // Minute hand
              const minLen = clockT * radius * 0.7;
              const minAngle = Math.PI * 0.75;
              x = minLen * Math.cos(minAngle);
              y = minLen * Math.sin(minAngle);
              z = 0.1;
            } else {
              // Inner gear
              const gearAngle = clockT * Math.PI * 2;
              const gearRadius = radius * 0.3 * (1 + Math.sin(gearAngle * 8) * 0.2);
              x = gearRadius * Math.cos(gearAngle);
              y = gearRadius * Math.sin(gearAngle);
              z = -0.1;
            }
            break;
            
          case 'plasmaOrb':
            // Glowing energy ball with dense core and electric lightning tendrils
            const plasmaSection = Math.floor(t * 3);
            const plasmaT = (t * 3) % 1;
            
            if (plasmaSection === 0) {
              // Dense glowing core - sphere with high particle density
              const corePhi = Math.acos(-1 + 2 * plasmaT);
              const coreTheta = Math.sqrt(particleCount / 3 * Math.PI) * corePhi;
              const coreR = radius * 0.5;
              x = coreR * Math.cos(coreTheta) * Math.sin(corePhi);
              y = coreR * Math.sin(coreTheta) * Math.sin(corePhi);
              z = coreR * Math.cos(corePhi);
            } else if (plasmaSection === 1) {
              // Electric tendrils shooting outward - 8 lightning bolts
              const tendrilIndex = Math.floor(plasmaT * 8);
              const tendrilProgress = (plasmaT * 8) % 1;
              const tendrilBaseAngle = (tendrilIndex / 8) * Math.PI * 2;
              const tendrilElevation = ((tendrilIndex % 3) - 1) * 0.5;
              
              // Lightning zigzag effect
              const zigzag = Math.sin(tendrilProgress * Math.PI * 6) * 0.15 * tendrilProgress;
              const tendrilLen = radius * 0.5 + tendrilProgress * radius * 0.8;
              
              x = tendrilLen * Math.cos(tendrilBaseAngle + zigzag);
              y = tendrilLen * tendrilElevation + zigzag * radius * 0.5;
              z = tendrilLen * Math.sin(tendrilBaseAngle + zigzag);
            } else {
              // Outer glow/aura - scattered particles around the orb
              const auraPhi = Math.acos(-1 + 2 * plasmaT);
              const auraTheta = Math.sqrt(particleCount / 3 * Math.PI) * auraPhi * 2;
              const auraR = radius * 0.6 + Math.random() * radius * 0.4;
              const flicker = 0.8 + Math.sin(i * 0.3) * 0.2;
              x = auraR * flicker * Math.cos(auraTheta) * Math.sin(auraPhi);
              y = auraR * flicker * Math.sin(auraTheta) * Math.sin(auraPhi);
              z = auraR * flicker * Math.cos(auraPhi);
            }
            break;
            
          case 'quantumField':
            // Quantum probability field - particles in wave-like patterns
            const qSize = Math.floor(Math.sqrt(particleCount));
            const qX = (i % qSize) / qSize * 4 - 2;
            const qY = Math.floor(i / qSize) / qSize * 4 - 2;
            const qWave1 = Math.sin(qX * Math.PI * 2) * 0.3;
            const qWave2 = Math.sin(qY * Math.PI * 2) * 0.3;
            const qWave3 = Math.sin((qX + qY) * Math.PI) * 0.2;
            x = qX * radius * 0.5;
            y = qY * radius * 0.5;
            z = (qWave1 + qWave2 + qWave3) * radius;
            break;

          case 'earthMoon':
            // Earth and Moon - planet with orbiting satellite
            const emSection = Math.floor(t * 6);
            const emT = (t * 6) % 1;

            if (emSection < 4) {
              // Earth - larger sphere
              const earthPhi = Math.acos(-1 + 2 * (emSection * 0.25 + emT * 0.25));
              const earthTheta = Math.sqrt(particleCount * 0.65 * Math.PI) * earthPhi;
              const earthR = radius * 0.65;
              x = earthR * Math.cos(earthTheta) * Math.sin(earthPhi);
              y = earthR * Math.sin(earthTheta) * Math.sin(earthPhi);
              z = earthR * Math.cos(earthPhi);
            } else if (emSection === 4) {
              // Moon - smaller sphere on orbit
              const moonPhi = Math.acos(-1 + 2 * emT);
              const moonTheta = Math.sqrt(particleCount * 0.15 * Math.PI) * moonPhi;
              const moonR = radius * 0.15;
              const moonOrbitR = radius * 1.2;
              // Position moon on the orbit path
              x = moonOrbitR + moonR * Math.cos(moonTheta) * Math.sin(moonPhi);
              y = moonR * Math.sin(moonTheta) * Math.sin(moonPhi);
              z = moonR * Math.cos(moonPhi);
            } else {
              // Orbit path - circular ring around Earth
              const orbitAngle = emT * Math.PI * 2;
              const orbitR = radius * 1.2;
              x = orbitR * Math.cos(orbitAngle);
              y = 0;
              z = orbitR * Math.sin(orbitAngle);
            }
            break;

          default:
            x = 0;
            y = 0;
            z = 0;
        }
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }
      
      return positions;
    };

    const morphToShape = (shapeIndex) => {
      const newPositions = generateShapePositions(shapes[shapeIndex]);
      targetPositionsRef.current = newPositions;
    };

    morphToShape(0);

    const shapeInterval = setInterval(() => {
      shapeIndexRef.current = (shapeIndexRef.current + 1) % shapes.length;
      morphToShape(shapeIndexRef.current);
    }, 4000);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const positionAttr = particleSystem.geometry.attributes.position;
      const positions = positionAttr.array;
      
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] += (targetPositionsRef.current[i] - positions[i]) * 0.03;
      }
      
      positionAttr.needsUpdate = true;

      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.003;
        targetRotationRef.current.x += 0.001;
      }
      
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;
      
      particleSystem.rotation.y = currentRotationRef.current.y;
      particleSystem.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

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

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(shapeInterval);
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
      
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="about-particle-container" />;
};

export default AboutParticles;

