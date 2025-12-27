import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ParticleModel.css';

const ParticleModel = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleSystemRef = useRef(null);
  const animationFrameRef = useRef(null);
  const shapeIndexRef = useRef(0);
  const targetPositionsRef = useRef(null);
  const currentPositionsRef = useRef(null);
  const particleCount = 2000; // Low quality - fewer particles
  const color = new THREE.Color(0xa78bfa); // #a78bfa
  
  // Mouse interaction
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Mouse hover interaction for particle repulsion
  const hoverMouseRef = useRef(new THREE.Vector2(-1000, -1000));
  const mouse3DRef = useRef(new THREE.Vector3());
  const raycasterRef = useRef(new THREE.Raycaster());
  const interactionRadiusRef = useRef(0.8); // Radius of mouse influence
  const repulsionStrengthRef = useRef(0.15); // How strongly particles are pushed

  // 11 different shapes
  const shapes = [
    'sphere',
    'cube',
    'torus',
    'dna',
    'atom',
    'infinity',
    'plasmaOrb',
    'energyPulse',
    'clockwork',
    'quantumField',
    'earthMoon'
  ];

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
    camera.position.z = 4;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Initialize positions
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08, // Small dots
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;
    currentPositionsRef.current = positions;
    targetPositionsRef.current = new Float32Array(particleCount * 3);

    // Store displacement for each particle (for hover effect)
    const particleDisplacements = new Float32Array(particleCount * 3);

    // Generate shape positions
    const generateShapePositions = (shapeType) => {
      const positions = new Float32Array(particleCount * 3);
      const radius = 2;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x, y, z;
        const t = i / particleCount;
        
        switch (shapeType) {
          case 'sphere':
            // Fibonacci sphere for even distribution
            const phi = Math.acos(-1 + 2 * t);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            x = radius * Math.cos(theta) * Math.sin(phi);
            y = radius * Math.sin(theta) * Math.sin(phi);
            z = radius * Math.cos(phi);
            break;
            
          case 'cube':
            // Distribute evenly on cube surface
            const side = Math.floor(Math.cbrt(particleCount));
            const layer = Math.floor(i / (side * side));
            const row = Math.floor((i % (side * side)) / side);
            const col = i % side;
            const unit = radius * 2 / side;
            x = (col * unit) - radius;
            y = (row * unit) - radius;
            z = (layer * unit) - radius;
            break;
            
          case 'torus':
            const torusAngle = t * Math.PI * 2;
            const torusRadius = radius * 0.7;
            const tubeRadius = radius * 0.3;
            const tubeAngle = t * Math.PI * 6;
            x = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(torusAngle);
            y = tubeRadius * Math.sin(tubeAngle);
            z = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(torusAngle);
            break;
            
          case 'dna':
            // Double helix - two intertwined spirals
            const dnaAngle = t * Math.PI * 6;
            const dnaHeight = t * radius * 3 - radius * 1.5;
            const dnaRadius = radius * 0.5;
            const helixOffset = (i % 2) * Math.PI;
            x = dnaRadius * Math.cos(dnaAngle + helixOffset);
            y = dnaHeight;
            z = dnaRadius * Math.sin(dnaAngle + helixOffset);
            // Add connecting lines (rungs)
            if (i % 20 < 2) {
              const rungT = (i % 20) / 2;
              x = dnaRadius * Math.cos(dnaAngle) * (1 - rungT * 2);
              z = dnaRadius * Math.sin(dnaAngle) * (1 - rungT * 2);
            }
            break;
            
          case 'atom':
            // Nucleus in center + orbiting electrons
            if (i < particleCount * 0.1) {
              // Nucleus (small sphere)
              const nucleusPhi = Math.acos(-1 + 2 * (i / (particleCount * 0.1)));
              const nucleusTheta = Math.sqrt(particleCount * 0.1 * Math.PI) * nucleusPhi;
              const nucleusRadius = radius * 0.2;
              x = nucleusRadius * Math.cos(nucleusTheta) * Math.sin(nucleusPhi);
              y = nucleusRadius * Math.sin(nucleusTheta) * Math.sin(nucleusPhi);
              z = nucleusRadius * Math.cos(nucleusPhi);
            } else {
              // Electron orbits (3 rings at different angles)
              const orbitIndex = Math.floor((i - particleCount * 0.1) / (particleCount * 0.3));
              const orbitAngle = ((i - particleCount * 0.1) / (particleCount * 0.3)) * Math.PI * 2;
              const orbitRadius = radius * 0.8;
              if (orbitIndex === 0) {
                x = orbitRadius * Math.cos(orbitAngle);
                y = orbitRadius * Math.sin(orbitAngle);
                z = 0;
              } else if (orbitIndex === 1) {
                x = orbitRadius * Math.cos(orbitAngle);
                y = 0;
                z = orbitRadius * Math.sin(orbitAngle);
              } else {
                x = 0;
                y = orbitRadius * Math.cos(orbitAngle);
                z = orbitRadius * Math.sin(orbitAngle);
              }
            }
            break;
            
          case 'infinity':
            // Infinity symbol (∞) - 3D lemniscate with thickness
            const infAngle = t * Math.PI * 2;
            const infRadius = radius * 0.6;
            const infScale = 1 + Math.cos(infAngle * 2) * 0.3;
            // Add thickness by offsetting particles in a tube around the path
            const infTubeAngle = (i % 12) * Math.PI * 2 / 12;
            const infTubeRadius = radius * 0.06;
            const infBaseX = infRadius * Math.cos(infAngle) * infScale;
            const infBaseY = infRadius * Math.sin(infAngle) * Math.cos(infAngle) * 0.5;
            const infBaseZ = infRadius * Math.sin(infAngle * 2) * 0.3;
            x = infBaseX + infTubeRadius * Math.cos(infTubeAngle);
            y = infBaseY + infTubeRadius * Math.sin(infTubeAngle);
            z = infBaseZ + infTubeRadius * Math.sin(infTubeAngle) * 0.5;
            break;
            
          case 'plasmaOrb':
            // Glowing energy ball with dense core and electric lightning tendrils
            const plasmaSection = Math.floor(t * 3);
            const plasmaT = (t * 3) % 1;
            
            if (plasmaSection === 0) {
              // Dense glowing core
              const corePhi = Math.acos(-1 + 2 * plasmaT);
              const coreTheta = Math.sqrt(particleCount / 3 * Math.PI) * corePhi;
              const coreR = radius * 0.5;
              x = coreR * Math.cos(coreTheta) * Math.sin(corePhi);
              y = coreR * Math.sin(coreTheta) * Math.sin(corePhi);
              z = coreR * Math.cos(corePhi);
            } else if (plasmaSection === 1) {
              // Electric tendrils shooting outward
              const tendrilIndex = Math.floor(plasmaT * 8);
              const tendrilProgress = (plasmaT * 8) % 1;
              const tendrilBaseAngle = (tendrilIndex / 8) * Math.PI * 2;
              const tendrilElevation = ((tendrilIndex % 3) - 1) * 0.5;
              const zigzag = Math.sin(tendrilProgress * Math.PI * 6) * 0.15 * tendrilProgress;
              const tendrilLen = radius * 0.5 + tendrilProgress * radius * 0.8;
              x = tendrilLen * Math.cos(tendrilBaseAngle + zigzag);
              y = tendrilLen * tendrilElevation + zigzag * radius * 0.5;
              z = tendrilLen * Math.sin(tendrilBaseAngle + zigzag);
            } else {
              // Outer glow/aura
              const auraPhi = Math.acos(-1 + 2 * plasmaT);
              const auraTheta = Math.sqrt(particleCount / 3 * Math.PI) * auraPhi * 2;
              const auraR = radius * 0.6 + Math.random() * radius * 0.4;
              const flicker = 0.8 + Math.sin(i * 0.3) * 0.2;
              x = auraR * flicker * Math.cos(auraTheta) * Math.sin(auraPhi);
              y = auraR * flicker * Math.sin(auraTheta) * Math.sin(auraPhi);
              z = auraR * flicker * Math.cos(auraPhi);
            }
            break;
            
          case 'energyPulse':
            // Expanding energy waves - concentric spheres
            const pulseLayer = Math.floor(t * 5);
            const pulseT = (t * 5) % 1;
            const pulseRadius = (pulseLayer + 0.5) * radius * 0.35;
            const pulsePhi = Math.acos(-1 + 2 * pulseT);
            const pulseTheta = Math.sqrt(particleCount / 5 * Math.PI) * pulsePhi;
            const pulseIntensity = 1 + Math.sin(pulseLayer * Math.PI * 0.5) * 0.2;
            x = pulseRadius * pulseIntensity * Math.cos(pulseTheta) * Math.sin(pulsePhi);
            y = pulseRadius * pulseIntensity * Math.sin(pulseTheta) * Math.sin(pulsePhi);
            z = pulseRadius * pulseIntensity * Math.cos(pulsePhi);
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
              const hourAngle = Math.PI * 0.25;
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

    // Morph to new shape
    const morphToShape = (shapeIndex) => {
      const newPositions = generateShapePositions(shapes[shapeIndex]);
      targetPositionsRef.current = newPositions;
    };

    // Initialize first shape
    morphToShape(0);

    // Change shape every 4 seconds
    const shapeInterval = setInterval(() => {
      shapeIndexRef.current = (shapeIndexRef.current + 1) % shapes.length;
      morphToShape(shapeIndexRef.current);
    }, 4000);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Smooth morphing
      const positionAttr = particleSystem.geometry.attributes.position;
      const positions = positionAttr.array;

      // Calculate mouse position in 3D space for hover effect
      raycasterRef.current.setFromCamera(hoverMouseRef.current, camera);
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycasterRef.current.ray.intersectPlane(planeZ, mouse3DRef.current);

      // Apply rotation to get mouse position relative to rotated particles
      const inverseRotation = new THREE.Euler(
        -currentRotationRef.current.x,
        -currentRotationRef.current.y,
        0
      );
      const rotatedMouse = mouse3DRef.current.clone().applyEuler(inverseRotation);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Get target position
        const targetX = targetPositionsRef.current[i3];
        const targetY = targetPositionsRef.current[i3 + 1];
        const targetZ = targetPositionsRef.current[i3 + 2];

        // Calculate distance from mouse to this particle's target position
        const dx = targetX - rotatedMouse.x;
        const dy = targetY - rotatedMouse.y;
        const dz = targetZ - rotatedMouse.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Apply repulsion if within interaction radius
        const interactionRadius = interactionRadiusRef.current;
        const repulsionStrength = repulsionStrengthRef.current;

        if (distance < interactionRadius && distance > 0.01) {
          // Calculate repulsion force (stronger when closer)
          const force = (1 - distance / interactionRadius) * repulsionStrength;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          const normalizedDz = dz / distance;

          // Apply displacement
          particleDisplacements[i3] += normalizedDx * force;
          particleDisplacements[i3 + 1] += normalizedDy * force;
          particleDisplacements[i3 + 2] += normalizedDz * force;
        }

        // Decay displacement over time (particles return to original position)
        particleDisplacements[i3] *= 0.92;
        particleDisplacements[i3 + 1] *= 0.92;
        particleDisplacements[i3 + 2] *= 0.92;

        // Smooth morphing + displacement
        positions[i3] += (targetX + particleDisplacements[i3] - positions[i3]) * 0.08;
        positions[i3 + 1] += (targetY + particleDisplacements[i3 + 1] - positions[i3 + 1]) * 0.08;
        positions[i3 + 2] += (targetZ + particleDisplacements[i3 + 2] - positions[i3 + 2]) * 0.08;
      }

      positionAttr.needsUpdate = true;

      // Auto rotation when not dragging
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.002;
        targetRotationRef.current.x += 0.001;
      }

      // Smooth rotation from mouse interaction or auto rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

      // Apply rotation
      particleSystem.rotation.y = currentRotationRef.current.y;
      particleSystem.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction handlers
    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Hover effect - track mouse position for particle repulsion
    const handleHoverMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Convert mouse position to normalized device coordinates (-1 to +1)
      hoverMouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      hoverMouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleHoverLeave = () => {
      // Move mouse far away when leaving canvas
      hoverMouseRef.current.x = -1000;
      hoverMouseRef.current.y = -1000;
    };

    const handleMouseMove = (e) => {
      // Update hover position
      handleHoverMove(e);

      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - mouseRef.current.x;
      const deltaY = e.clientY - mouseRef.current.y;

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x += deltaY * 0.01;

      // Limit vertical rotation
      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x));

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      
      // Re-enable text selection
      document.body.style.userSelect = '';
      if (containerRef.current?.closest('.hero')) {
        containerRef.current.closest('.hero').classList.remove('dragging');
      }
    };

    // Touch handlers for mobile
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
      
      // Re-enable text selection
      document.body.style.userSelect = '';
      if (containerRef.current?.closest('.hero')) {
        containerRef.current.closest('.hero').classList.remove('dragging');
      }
    };

    // Add event listeners to canvas
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
      clearInterval(shapeInterval);
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

  return <div ref={containerRef} className="particle-model-container" />;
};

export default ParticleModel;

