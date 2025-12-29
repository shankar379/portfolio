import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './WaveOrb.css';

const WaveOrb = () => {
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
    camera.position.set(0, 0, 5);
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

    // Colors - Cyan/Teal
    const cyanColor = new THREE.Color(0x00ffff);
    const tealColor = new THREE.Color(0x00ccaa);
    const darkCyan = new THREE.Color(0x006666);

    // Group for rotation
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    // Particle data
    const allPositions = [];
    const allColors = [];
    const particleData = [];

    // 1. Central sphere/core
    const coreParticles = 1200;
    const coreRadius = 0.45;
    for (let i = 0; i < coreParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = coreRadius * (0.8 + Math.random() * 0.2);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      allPositions.push(x, y, z);
      allColors.push(tealColor.r * 0.6, tealColor.g * 0.6, tealColor.b * 0.6);
      particleData.push({ type: 'core', originalPos: { x, y, z }, phase: Math.random() * Math.PI * 2 });
    }

    // 2. Multiple flowing wave rings
    const ringCount = 5;
    const particlesPerRing = 3000;
    const baseRadius = 1.5;

    for (let ring = 0; ring < ringCount; ring++) {
      const ringRadius = baseRadius + ring * 0.08;
      const ringOffset = ring * 0.3;

      for (let i = 0; i < particlesPerRing; i++) {
        const angle = (i / particlesPerRing) * Math.PI * 2;

        // Create wavy displacement
        const waveFreq1 = 3 + ring;
        const waveFreq2 = 5 + ring * 0.5;
        const waveAmp1 = 0.15 + ring * 0.05;
        const waveAmp2 = 0.1;

        const wave1 = Math.sin(angle * waveFreq1 + ringOffset) * waveAmp1;
        const wave2 = Math.cos(angle * waveFreq2 + ringOffset * 2) * waveAmp2;
        const wave3 = Math.sin(angle * 7 + ring) * 0.05;

        const r = ringRadius + wave1 + wave2;
        const heightWave = Math.sin(angle * waveFreq1 + ringOffset) * 0.2 +
                          Math.cos(angle * waveFreq2) * 0.15 +
                          wave3;

        const x = r * Math.cos(angle);
        const y = heightWave + (Math.random() - 0.5) * 0.1;
        const z = r * Math.sin(angle);

        allPositions.push(x, y, z);

        // Color gradient based on position
        const colorMix = (Math.sin(angle * 2) + 1) * 0.5;
        const color = new THREE.Color().lerpColors(cyanColor, tealColor, colorMix);
        const brightness = 0.5 + Math.random() * 0.5;
        allColors.push(color.r * brightness, color.g * brightness, color.b * brightness);

        particleData.push({
          type: 'ring',
          ring,
          angle,
          baseRadius: ringRadius,
          originalPos: { x, y, z },
          phase: angle + ring * 0.5,
          waveOffset: ringOffset
        });
      }
    }

    // 3. Flowing particles between rings
    const flowParticles = 2000;
    for (let i = 0; i < flowParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.8;
      const y = (Math.random() - 0.5) * 0.6;

      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);

      allPositions.push(x, y, z);

      const brightness = 0.3 + Math.random() * 0.4;
      allColors.push(cyanColor.r * brightness, cyanColor.g * brightness, cyanColor.b * brightness);

      particleData.push({
        type: 'flow',
        angle,
        r,
        originalPos: { x, y, z },
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    // 4. Inner ring details
    const innerRingParticles = 1500;
    const innerRadius = 0.75;
    for (let i = 0; i < innerRingParticles; i++) {
      const angle = (i / innerRingParticles) * Math.PI * 2;
      const wave = Math.sin(angle * 8) * 0.1;
      const r = innerRadius + wave;

      const x = r * Math.cos(angle);
      const y = Math.sin(angle * 4) * 0.05;
      const z = r * Math.sin(angle);

      allPositions.push(x, y, z);
      allColors.push(darkCyan.r, darkCyan.g, darkCyan.b);
      particleData.push({
        type: 'inner',
        angle,
        originalPos: { x, y, z },
        phase: angle
      });
    }

    // 5. Scattered ambient particles
    const ambientParticles = 1000;
    for (let i = 0; i < ambientParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 0.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      const z = r * Math.cos(phi);

      allPositions.push(x, y, z);

      const brightness = 0.2 + Math.random() * 0.3;
      allColors.push(cyanColor.r * brightness, cyanColor.g * brightness, cyanColor.b * brightness);

      particleData.push({
        type: 'ambient',
        originalPos: { x, y, z },
        phase: Math.random() * Math.PI * 2
      });
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
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    waveGroup.add(particleSystem);

    // Store base values
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

        let pulse = 1;

        if (data.type === 'core') {
          // Core subtle pulse
          const vibration = 0.01;
          pulse = 0.7 + Math.sin(time * 2 + data.phase) * 0.3;

          positionAttr.array[i3] = original.x + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 1] = original.y + (Math.random() - 0.5) * vibration;
          positionAttr.array[i3 + 2] = original.z + (Math.random() - 0.5) * vibration;
        }
        else if (data.type === 'ring') {
          // Flowing wave animation
          const waveTime = time * 1.5;
          const waveFreq1 = 3 + data.ring;
          const waveFreq2 = 5 + data.ring * 0.5;
          const waveAmp1 = 0.15 + data.ring * 0.05;
          const waveAmp2 = 0.1;

          const wave1 = Math.sin(data.angle * waveFreq1 + waveTime + data.waveOffset) * waveAmp1;
          const wave2 = Math.cos(data.angle * waveFreq2 + waveTime * 0.7 + data.waveOffset * 2) * waveAmp2;

          const r = data.baseRadius + wave1 + wave2;
          const heightWave = Math.sin(data.angle * waveFreq1 + waveTime + data.waveOffset) * 0.2 +
                            Math.cos(data.angle * waveFreq2 + waveTime * 0.5) * 0.15;

          positionAttr.array[i3] = r * Math.cos(data.angle);
          positionAttr.array[i3 + 1] = heightWave;
          positionAttr.array[i3 + 2] = r * Math.sin(data.angle);

          pulse = 0.6 + Math.sin(waveTime + data.phase) * 0.4;
        }
        else if (data.type === 'flow') {
          // Flowing particles orbit
          const newAngle = data.angle + time * data.speed * 0.3;
          const waveR = data.r + Math.sin(time * 2 + data.phase) * 0.1;

          positionAttr.array[i3] = waveR * Math.cos(newAngle);
          positionAttr.array[i3 + 1] = original.y + Math.sin(time * 2 + data.phase) * 0.1;
          positionAttr.array[i3 + 2] = waveR * Math.sin(newAngle);

          pulse = 0.4 + Math.sin(time * 3 + data.phase) * 0.6;
        }
        else if (data.type === 'inner') {
          // Inner ring wave
          const waveTime = time * 2;
          const wave = Math.sin(data.angle * 8 + waveTime) * 0.1;
          const r = 0.75 + wave;

          positionAttr.array[i3] = r * Math.cos(data.angle);
          positionAttr.array[i3 + 1] = Math.sin(data.angle * 4 + waveTime * 0.5) * 0.05;
          positionAttr.array[i3 + 2] = r * Math.sin(data.angle);

          pulse = 0.5 + Math.sin(waveTime + data.phase) * 0.5;
        }
        else if (data.type === 'ambient') {
          // Ambient particles drift
          const drift = Math.sin(time + data.phase) * 0.05;

          positionAttr.array[i3] = original.x + drift;
          positionAttr.array[i3 + 1] = original.y + Math.cos(time * 0.5 + data.phase) * 0.03;
          positionAttr.array[i3 + 2] = original.z + drift * 0.5;

          pulse = 0.3 + Math.sin(time * 2 + data.phase) * 0.7;
        }

        // Update colors
        colorAttr.array[i3] = baseColors[i3] * pulse;
        colorAttr.array[i3 + 1] = baseColors[i3 + 1] * pulse;
        colorAttr.array[i3 + 2] = baseColors[i3 + 2] * pulse;
      }

      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Slow rotation
      waveGroup.rotation.y += 0.002;

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

  return <div ref={containerRef} className="wave-orb-container" />;
};

export default WaveOrb;
