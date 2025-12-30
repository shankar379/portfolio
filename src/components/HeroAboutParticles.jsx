import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './HeroAboutParticles.css';

const HeroAboutParticles = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particleSystemRef = useRef(null);
  const animationFrameRef = useRef(null);

  const particleCount = 2000;
  const color = new THREE.Color(0xa78bfa);
  const hoverColor = new THREE.Color(0x3b82f6);

  // Scroll tracking
  const scrollProgressRef = useRef(0);
  const targetScrollProgressRef = useRef(0);

  // Particle positions for different states
  const heroPositionsRef = useRef(null);
  const aboutPositionsRef = useRef(null);
  const currentPositionsRef = useRef(null);

  // Mouse interaction
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Hover effect
  const hoverMouseRef = useRef(new THREE.Vector2(-1000, -1000));
  const mouse3DRef = useRef(new THREE.Vector3());
  const raycasterRef = useRef(new THREE.Raycaster());

  // Shape morphing for Hero section (cycles through shapes)
  const shapeIndexRef = useRef(0);
  const heroShapes = ['sphere', 'cube', 'torus', 'dna', 'atom', 'infinity'];
  const aboutShape = 'energyPulse';

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    raycasterRef.current = new THREE.Raycaster();

    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

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
      size: 0.08,
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

    // Generate shape positions
    const generateShapePositions = (shapeType, xOffset = 0) => {
      const positions = new Float32Array(particleCount * 3);
      const radius = 2;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x, y, z;
        const t = i / particleCount;

        switch (shapeType) {
          case 'sphere':
            const phi = Math.acos(-1 + 2 * t);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            x = radius * Math.cos(theta) * Math.sin(phi);
            y = radius * Math.sin(theta) * Math.sin(phi);
            z = radius * Math.cos(phi);
            break;

          case 'cube':
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
            const dnaHeight = radius * 2.2;
            const dnaRadius = radius * 0.45;
            const dnaStrandThickness = radius * 0.05;
            const dnaTurns = 2;
            const dnaNumRungs = 16;
            const dnaStrandCount = Math.floor(particleCount * 0.40);
            const dnaRungCount = particleCount - dnaStrandCount * 2;
            const dnaParticlesPerRung = Math.floor(dnaRungCount / dnaNumRungs);

            if (i < dnaStrandCount) {
              const s1t = i / dnaStrandCount;
              const s1Angle = s1t * Math.PI * 2 * dnaTurns;
              const s1Y = s1t * dnaHeight - dnaHeight / 2;
              const s1TubeAngle = (i % 8) * Math.PI * 2 / 8;
              const s1RadialOffset = dnaStrandThickness * (0.5 + (i % 3) * 0.25);
              x = dnaRadius * Math.cos(s1Angle) + s1RadialOffset * Math.cos(s1TubeAngle) * Math.sin(s1Angle);
              y = s1Y + s1RadialOffset * Math.sin(s1TubeAngle) * 0.8;
              z = dnaRadius * Math.sin(s1Angle) + s1RadialOffset * Math.cos(s1TubeAngle) * Math.cos(s1Angle);
            } else if (i < dnaStrandCount * 2) {
              const s2i = i - dnaStrandCount;
              const s2t = s2i / dnaStrandCount;
              const s2Angle = s2t * Math.PI * 2 * dnaTurns + Math.PI;
              const s2Y = s2t * dnaHeight - dnaHeight / 2;
              const s2TubeAngle = (s2i % 8) * Math.PI * 2 / 8;
              const s2RadialOffset = dnaStrandThickness * (0.5 + (s2i % 3) * 0.25);
              x = dnaRadius * Math.cos(s2Angle) + s2RadialOffset * Math.cos(s2TubeAngle) * Math.sin(s2Angle);
              y = s2Y + s2RadialOffset * Math.sin(s2TubeAngle) * 0.8;
              z = dnaRadius * Math.sin(s2Angle) + s2RadialOffset * Math.cos(s2TubeAngle) * Math.cos(s2Angle);
            } else {
              const rungIdx = i - dnaStrandCount * 2;
              const whichRung = Math.floor(rungIdx / dnaParticlesPerRung);
              const rungLocalIdx = rungIdx % dnaParticlesPerRung;
              const rungHeightT = (whichRung + 0.5) / dnaNumRungs;
              const rungAngle = rungHeightT * Math.PI * 2 * dnaTurns;
              const rungYPos = rungHeightT * dnaHeight - dnaHeight / 2;
              const rungX1 = dnaRadius * Math.cos(rungAngle);
              const rungZ1 = dnaRadius * Math.sin(rungAngle);
              const rungX2 = dnaRadius * Math.cos(rungAngle + Math.PI);
              const rungZ2 = dnaRadius * Math.sin(rungAngle + Math.PI);
              const rungProgress = rungLocalIdx / Math.max(dnaParticlesPerRung - 1, 1);
              const rungLayer = (rungLocalIdx % 4);
              const rungThicknessY = (rungLayer - 1.5) * 0.015;
              const rungThicknessZ = ((rungLocalIdx % 2) - 0.5) * 0.02;
              x = rungX1 + (rungX2 - rungX1) * rungProgress;
              y = rungYPos + rungThicknessY;
              z = rungZ1 + (rungZ2 - rungZ1) * rungProgress + rungThicknessZ;
            }
            break;

          case 'atom':
            if (i < particleCount * 0.1) {
              const nucleusPhi = Math.acos(-1 + 2 * (i / (particleCount * 0.1)));
              const nucleusTheta = Math.sqrt(particleCount * 0.1 * Math.PI) * nucleusPhi;
              const nucleusRadius = radius * 0.2;
              x = nucleusRadius * Math.cos(nucleusTheta) * Math.sin(nucleusPhi);
              y = nucleusRadius * Math.sin(nucleusTheta) * Math.sin(nucleusPhi);
              z = nucleusRadius * Math.cos(nucleusPhi);
            } else {
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
            const infAngle = t * Math.PI * 2;
            const infRadius = radius * 0.6;
            const infScale = 1 + Math.cos(infAngle * 2) * 0.3;
            const infTubeAngle = (i % 12) * Math.PI * 2 / 12;
            const infTubeRadius = radius * 0.06;
            const infBaseX = infRadius * Math.cos(infAngle) * infScale;
            const infBaseY = infRadius * Math.sin(infAngle) * Math.cos(infAngle) * 0.5;
            const infBaseZ = infRadius * Math.sin(infAngle * 2) * 0.3;
            x = infBaseX + infTubeRadius * Math.cos(infTubeAngle);
            y = infBaseY + infTubeRadius * Math.sin(infTubeAngle);
            z = infBaseZ + infTubeRadius * Math.sin(infTubeAngle) * 0.5;
            break;

          case 'energyPulse':
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

          default:
            x = 0;
            y = 0;
            z = 0;
        }

        // Apply x offset for positioning (Hero = right, About = left)
        positions[i3] = x + xOffset;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }

      return positions;
    };

    // Initialize positions - Hero on right side
    heroPositionsRef.current = generateShapePositions('sphere', 2.5);
    aboutPositionsRef.current = generateShapePositions('energyPulse', -2.5);

    // Copy initial positions
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = heroPositionsRef.current[i];
    }

    // Shape cycling for Hero section
    const shapeInterval = setInterval(() => {
      if (scrollProgressRef.current < 0.3) {
        shapeIndexRef.current = (shapeIndexRef.current + 1) % heroShapes.length;
        heroPositionsRef.current = generateShapePositions(heroShapes[shapeIndexRef.current], 2.5);
      }
    }, 4000);

    // Scroll handler
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      const aboutSection = document.getElementById('about');

      if (!heroSection || !aboutSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const aboutRect = aboutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 = Hero fully visible, 1 = About fully visible)
      let progress = 0;

      if (heroRect.bottom > 0 && heroRect.bottom < windowHeight) {
        // Transitioning out of Hero
        progress = 1 - (heroRect.bottom / windowHeight);
      } else if (aboutRect.top < windowHeight && aboutRect.top > 0) {
        // Transitioning into About
        progress = 1 - (aboutRect.top / windowHeight);
      } else if (aboutRect.top <= 0) {
        // About is fully visible or past
        progress = 1;
      } else {
        // Hero is fully visible
        progress = 0;
      }

      targetScrollProgressRef.current = Math.max(0, Math.min(1, progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Smooth scroll progress
      scrollProgressRef.current += (targetScrollProgressRef.current - scrollProgressRef.current) * 0.08;

      const positionAttr = particleSystem.geometry.attributes.position;
      const positions = positionAttr.array;
      const colorAttr = particleSystem.geometry.attributes.color;
      const colors = colorAttr.array;

      // Calculate mouse position in 3D
      raycasterRef.current.setFromCamera(hoverMouseRef.current, camera);
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      raycasterRef.current.ray.intersectPlane(planeZ, mouse3DRef.current);

      const inverseRotation = new THREE.Euler(
        -currentRotationRef.current.x,
        -currentRotationRef.current.y,
        0
      );
      const rotatedMouse = mouse3DRef.current.clone().applyEuler(inverseRotation);

      const scrollProgress = scrollProgressRef.current;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Staggered timing for magnetic effect - particles near top move first
        const particleDelay = (i / particleCount) * 0.3;
        const adjustedProgress = Math.max(0, Math.min(1, (scrollProgress - particleDelay) / (1 - particleDelay)));

        // Easing for smooth magnetic pull
        const easedProgress = adjustedProgress < 0.5
          ? 2 * adjustedProgress * adjustedProgress
          : 1 - Math.pow(-2 * adjustedProgress + 2, 2) / 2;

        // Interpolate between Hero and About positions
        const heroX = heroPositionsRef.current[i3];
        const heroY = heroPositionsRef.current[i3 + 1];
        const heroZ = heroPositionsRef.current[i3 + 2];

        const aboutX = aboutPositionsRef.current[i3];
        const aboutY = aboutPositionsRef.current[i3 + 1];
        const aboutZ = aboutPositionsRef.current[i3 + 2];

        // Add magnetic curve effect during transition
        const curveAmount = Math.sin(easedProgress * Math.PI) * 0.5;
        const magneticCurveY = curveAmount * (Math.sin(i * 0.1) * 0.3);
        const magneticCurveZ = curveAmount * (Math.cos(i * 0.1) * 0.2);

        // Target position with magnetic curve
        const targetX = heroX + (aboutX - heroX) * easedProgress;
        const targetY = heroY + (aboutY - heroY) * easedProgress + magneticCurveY;
        const targetZ = heroZ + (aboutZ - heroZ) * easedProgress + magneticCurveZ;

        // Smooth morphing to target
        positions[i3] += (targetX - positions[i3]) * 0.06;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.06;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.06;

        // Color transition based on scroll (purple in Hero, blue-purple gradient in About)
        const dx = positions[i3] - rotatedMouse.x;
        const dy = positions[i3 + 1] - rotatedMouse.y;
        const dz = positions[i3 + 2] - rotatedMouse.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        let colorMix = scrollProgress * 0.3; // Base color shift during transition
        if (distance < 1.0) {
          colorMix = Math.max(colorMix, 1 - distance);
        }

        const particleColor = new THREE.Color().lerpColors(color, hoverColor, colorMix);
        colors[i3] = particleColor.r;
        colors[i3 + 1] = particleColor.g;
        colors[i3 + 2] = particleColor.b;
      }

      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Auto rotation (slower during transition)
      const rotationSpeed = scrollProgress > 0.1 && scrollProgress < 0.9 ? 0.001 : 0.002;
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += rotationSpeed;
        targetRotationRef.current.x += rotationSpeed * 0.5;
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

      particleSystem.rotation.y = currentRotationRef.current.y;
      particleSystem.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse handlers
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleHoverMove = (e) => {
      if (!containerRef.current) return;
      hoverMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      hoverMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
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

    // Event listeners
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      renderer.domElement.addEventListener('mousemove', handleHoverMove);
      renderer.domElement.addEventListener('mouseleave', handleHoverLeave);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      renderer.domElement.addEventListener('touchend', handleTouchEnd);
    }

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(shapeInterval);
      window.removeEventListener('scroll', handleScroll);
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

  return <div ref={containerRef} className="hero-about-particles-container" />;
};

export default HeroAboutParticles;
