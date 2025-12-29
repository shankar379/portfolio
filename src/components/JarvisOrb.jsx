import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './JarvisOrb.css';

const JarvisOrb = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

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

    // Colors - Orange/Gold like JARVIS
    const coreColor = new THREE.Color(0xffaa00);
    const ringColor = new THREE.Color(0xff8800);
    const particleColor = new THREE.Color(0xff6600);
    const glowColor = new THREE.Color(0xffdd44);

    // Particle system group
    const jarvisGroup = new THREE.Group();
    scene.add(jarvisGroup);

    // Store all particle data
    const allPositions = [];
    const allColors = [];
    const particleData = []; // Store original positions and type for animation

    const radius = 1.2;

    // 1. Dense glowing core
    const coreParticles = 1500;
    for (let i = 0; i < coreParticles; i++) {
      const r = Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      allPositions.push(x, y, z);
      allColors.push(glowColor.r, glowColor.g, glowColor.b);
      particleData.push({ type: 'core', originalPos: { x, y, z } });
    }

    // 2. Multiple concentric rings at different angles
    const ringConfigs = [
      { radius: 0.5, particles: 300, tiltX: 0, tiltY: 0, tiltZ: 0 },
      { radius: 0.6, particles: 350, tiltX: Math.PI / 5, tiltY: 0, tiltZ: 0 },
      { radius: 0.7, particles: 400, tiltX: Math.PI / 4, tiltY: 0, tiltZ: 0 },
      { radius: 0.7, particles: 400, tiltX: 0, tiltY: Math.PI / 4, tiltZ: 0 },
      { radius: 0.8, particles: 450, tiltX: Math.PI / 3, tiltY: Math.PI / 8, tiltZ: 0 },
      { radius: 0.9, particles: 500, tiltX: Math.PI / 3, tiltY: Math.PI / 6, tiltZ: 0 },
      { radius: 0.9, particles: 500, tiltX: -Math.PI / 3, tiltY: Math.PI / 6, tiltZ: 0 },
      { radius: 1.0, particles: 550, tiltX: Math.PI / 4, tiltY: -Math.PI / 3, tiltZ: 0 },
      { radius: 1.1, particles: 600, tiltX: Math.PI / 6, tiltY: -Math.PI / 4, tiltZ: 0 },
      { radius: 1.1, particles: 600, tiltX: -Math.PI / 6, tiltY: -Math.PI / 4, tiltZ: 0 },
      { radius: radius, particles: 650, tiltX: 0, tiltY: Math.PI / 2, tiltZ: 0 },
      { radius: radius, particles: 650, tiltX: Math.PI / 2, tiltY: 0, tiltZ: 0 },
    ];

    ringConfigs.forEach((config, ringIndex) => {
      for (let i = 0; i < config.particles; i++) {
        const angle = (i / config.particles) * Math.PI * 2;

        // Base ring position
        let x = config.radius * Math.cos(angle);
        let y = config.radius * Math.sin(angle);
        let z = 0;

        // Apply tilts
        const pos = new THREE.Vector3(x, y, z);
        pos.applyEuler(new THREE.Euler(config.tiltX, config.tiltY, config.tiltZ));

        allPositions.push(pos.x, pos.y, pos.z);

        // Vary color based on ring
        const colorMix = ringIndex / ringConfigs.length;
        const color = new THREE.Color().lerpColors(ringColor, coreColor, colorMix);
        allColors.push(color.r, color.g, color.b);
        particleData.push({ type: 'ring', ringIndex, angle, originalPos: { x: pos.x, y: pos.y, z: pos.z } });
      }
    });

    // 3. Radial circuit lines extending outward
    const radialLines = 36;
    const particlesPerLine = 50;
    for (let i = 0; i < radialLines; i++) {
      const baseAngle = (i / radialLines) * Math.PI * 2;
      const tiltAngle = (Math.random() - 0.5) * Math.PI;

      for (let j = 0; j < particlesPerLine; j++) {
        const dist = 0.4 + (j / particlesPerLine) * 0.9;

        let x = dist * Math.cos(baseAngle);
        let y = dist * Math.sin(baseAngle);
        let z = Math.sin(tiltAngle) * dist * 0.3;

        // Add some waviness
        x += Math.sin(j * 0.5) * 0.05;
        y += Math.cos(j * 0.5) * 0.05;

        allPositions.push(x, y, z);

        const fade = 1 - (j / particlesPerLine) * 0.5;
        allColors.push(particleColor.r * fade, particleColor.g * fade, particleColor.b * fade);
        particleData.push({ type: 'radial', lineIndex: i, dist, originalPos: { x, y, z } });
      }
    }

    // 4. Outer sphere shell particles
    const shellParticles = 3000;
    for (let i = 0; i < shellParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.9 + Math.random() * 0.2);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      allPositions.push(x, y, z);

      const brightness = 0.3 + Math.random() * 0.7;
      allColors.push(particleColor.r * brightness, particleColor.g * brightness, particleColor.b * brightness);
      particleData.push({ type: 'shell', originalPos: { x, y, z }, phase: Math.random() * Math.PI * 2 });
    }

    // 5. Floating data particles around the orb
    const floatingParticles = 1000;
    for (let i = 0; i < floatingParticles; i++) {
      const r = radius * (1.2 + Math.random() * 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      allPositions.push(x, y, z);
      allColors.push(glowColor.r * 0.5, glowColor.g * 0.5, glowColor.b * 0.5);
      particleData.push({ type: 'floating', originalPos: { x, y, z }, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() });
    }

    // 6. Inner structure - intersecting circles
    const innerCircles = 10;
    const particlesPerCircle = 200;
    for (let c = 0; c < innerCircles; c++) {
      const circleRadius = 0.4 + Math.random() * 0.3;
      const tiltX = Math.random() * Math.PI;
      const tiltY = Math.random() * Math.PI;

      for (let i = 0; i < particlesPerCircle; i++) {
        const angle = (i / particlesPerCircle) * Math.PI * 2;

        let x = circleRadius * Math.cos(angle);
        let y = circleRadius * Math.sin(angle);
        let z = 0;

        const pos = new THREE.Vector3(x, y, z);
        pos.applyEuler(new THREE.Euler(tiltX, tiltY, 0));

        allPositions.push(pos.x, pos.y, pos.z);
        allColors.push(coreColor.r * 0.8, coreColor.g * 0.8, coreColor.b * 0.8);
        particleData.push({ type: 'inner', originalPos: { x: pos.x, y: pos.y, z: pos.z } });
      }
    }

    // Create geometry
    const particleCount = allPositions.length / 3;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(allPositions);
    const colors = new Float32Array(allColors);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    jarvisGroup.add(particleSystem);

    // Store base values for animation
    const basePositions = new Float32Array(positions);
    const baseColors = new Float32Array(colors);

    // Animation
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      const positionAttr = geometry.attributes.position;
      const colorAttr = geometry.attributes.color;

      for (let i = 0; i < particleCount; i++) {
        const data = particleData[i];
        const i3 = i * 3;
        const original = data.originalPos;

        // Vibration effect
        let vibration = 0;
        let pulse = 1;

        if (data.type === 'core') {
          // Core pulses and vibrates
          vibration = 0.02;
          pulse = 0.8 + Math.sin(time * 4) * 0.2;

          positionAttr.array[i3] = original.x + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z + (Math.random() - 0.5) * vibration;
        }
        else if (data.type === 'ring') {
          // Rings pulse outward
          const ringPulse = 1 + Math.sin(time * 2 + data.ringIndex * 0.5) * 0.03;
          vibration = 0.01;
          pulse = 0.7 + Math.sin(time * 3 + data.angle) * 0.3;

          positionAttr.array[i3] = original.x * ringPulse + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y * ringPulse + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z * ringPulse + (Math.random() - 0.5) * vibration;
        }
        else if (data.type === 'radial') {
          // Radial lines wave
          vibration = 0.015;
          pulse = 0.5 + Math.sin(time * 4 - data.dist * 3) * 0.5;

          positionAttr.array[i3] = original.x + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z + (Math.random() - 0.5) * vibration;
        }
        else if (data.type === 'shell') {
          // Shell particles shimmer
          vibration = 0.02;
          pulse = 0.4 + Math.sin(time * 2 + data.phase) * 0.6;

          positionAttr.array[i3] = original.x + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z + (Math.random() - 0.5) * vibration;
        }
        else if (data.type === 'floating') {
          // Floating particles drift
          const drift = Math.sin(time * data.speed + data.phase) * 0.1;
          pulse = 0.3 + Math.sin(time * 2 + data.phase) * 0.7;

          positionAttr.array[i3] = original.x + drift;
          positionAttr.array[i3 + 1] = original.y + Math.cos(time * data.speed + data.phase) * 0.05;
          positionAttr.array[i3 + 2] = original.z + drift * 0.5;
        }
        else if (data.type === 'inner') {
          // Inner structure pulses
          vibration = 0.01;
          pulse = 0.6 + Math.sin(time * 3) * 0.4;

          positionAttr.array[i3] = original.x + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z + (Math.random() - 0.5) * vibration;
        }

        // Update colors with pulse
        colorAttr.array[i3] = baseColors[i3] * pulse;
        colorAttr.array[i3 + 1] = baseColors[i3 + 1] * pulse;
        colorAttr.array[i3 + 2] = baseColors[i3 + 2] * pulse;
      }

      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Slow auto rotation
      jarvisGroup.rotation.y += 0.003;
      jarvisGroup.rotation.x = Math.sin(time * 0.5) * 0.1;

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

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer && containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="jarvis-orb-container" />;
};

export default JarvisOrb;
