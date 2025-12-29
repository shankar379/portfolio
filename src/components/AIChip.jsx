import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './AIChip.css';

const AIChip = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera - front facing view
    const camera = new THREE.PerspectiveCamera(
      50,
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

    // Colors - same as brain (purple)
    const purpleColor = new THREE.Color(0xa78bfa);
    const purpleBright = new THREE.Color(0xc4b5fd);
    const blueColor = new THREE.Color(0x3b82f6);

    // Particle arrays
    const allPositions = [];
    const allColors = [];
    const particleTypes = []; // To track which particles should pulse differently

    // 1. Create chip body outline particles
    const chipSize = 2;
    const chipHeight = 0.15;
    const chipParticleSpacing = 0.05; // Smaller spacing = more particles

    // Top face of chip
    for (let x = -chipSize / 2; x <= chipSize / 2; x += chipParticleSpacing) {
      for (let z = -chipSize / 2; z <= chipSize / 2; z += chipParticleSpacing) {
        // Only edges and some internal grid
        const isEdge = Math.abs(x) > chipSize / 2 - 0.1 || Math.abs(z) > chipSize / 2 - 0.1;
        const isGrid = Math.abs(x % 0.4) < 0.05 || Math.abs(z % 0.4) < 0.05;

        if (isEdge || (isGrid && Math.random() > 0.6)) {
          allPositions.push(x, chipHeight / 2, z);
          allColors.push(purpleColor.r, purpleColor.g, purpleColor.b);
          particleTypes.push(0); // Chip body type
        }
      }
    }

    // Bottom face edges
    for (let x = -chipSize / 2; x <= chipSize / 2; x += chipParticleSpacing) {
      for (let z = -chipSize / 2; z <= chipSize / 2; z += chipParticleSpacing) {
        const isEdge = Math.abs(x) > chipSize / 2 - 0.1 || Math.abs(z) > chipSize / 2 - 0.1;
        if (isEdge) {
          allPositions.push(x, -chipHeight / 2, z);
          allColors.push(purpleColor.r * 0.7, purpleColor.g * 0.7, purpleColor.b * 0.7);
          particleTypes.push(0);
        }
      }
    }

    // Side edges (vertical)
    for (let y = -chipHeight / 2; y <= chipHeight / 2; y += chipParticleSpacing) {
      for (let i = -chipSize / 2; i <= chipSize / 2; i += chipParticleSpacing * 2) {
        // Four sides
        allPositions.push(i, y, -chipSize / 2);
        allColors.push(purpleColor.r * 0.8, purpleColor.g * 0.8, purpleColor.b * 0.8);
        particleTypes.push(0);

        allPositions.push(i, y, chipSize / 2);
        allColors.push(purpleColor.r * 0.8, purpleColor.g * 0.8, purpleColor.b * 0.8);
        particleTypes.push(0);

        allPositions.push(-chipSize / 2, y, i);
        allColors.push(purpleColor.r * 0.8, purpleColor.g * 0.8, purpleColor.b * 0.8);
        particleTypes.push(0);

        allPositions.push(chipSize / 2, y, i);
        allColors.push(purpleColor.r * 0.8, purpleColor.g * 0.8, purpleColor.b * 0.8);
        particleTypes.push(0);
      }
    }

    // 2. Create "AI" text with particles - denser
    const createLetterA = (offsetX, offsetZ, scale) => {
      const points = [];
      // Left leg
      for (let t = 0; t <= 1; t += 0.025) {
        points.push({ x: offsetX - 0.3 * scale + t * 0.3 * scale, z: offsetZ + 0.5 * scale - t * scale });
      }
      // Right leg
      for (let t = 0; t <= 1; t += 0.025) {
        points.push({ x: offsetX + 0.3 * scale - t * 0.3 * scale, z: offsetZ + 0.5 * scale - t * scale });
      }
      // Crossbar
      for (let t = 0; t <= 1; t += 0.04) {
        points.push({ x: offsetX - 0.15 * scale + t * 0.3 * scale, z: offsetZ });
      }
      return points;
    };

    const createLetterI = (offsetX, offsetZ, scale) => {
      const points = [];
      // Vertical line
      for (let t = 0; t <= 1; t += 0.025) {
        points.push({ x: offsetX, z: offsetZ + 0.5 * scale - t * scale });
      }
      // Top bar
      for (let t = 0; t <= 1; t += 0.05) {
        points.push({ x: offsetX - 0.15 * scale + t * 0.3 * scale, z: offsetZ - 0.5 * scale });
      }
      // Bottom bar
      for (let t = 0; t <= 1; t += 0.05) {
        points.push({ x: offsetX - 0.15 * scale + t * 0.3 * scale, z: offsetZ + 0.5 * scale });
      }
      return points;
    };

    // Add "A" particles - denser
    const letterA = createLetterA(-0.25, 0, 0.7);
    letterA.forEach(p => {
      allPositions.push(p.x, chipHeight / 2 + 0.01, p.z);
      allColors.push(purpleBright.r, purpleBright.g, purpleBright.b);
      particleTypes.push(1); // Text type - brighter pulse
    });

    // Add "I" particles - denser
    const letterI = createLetterI(0.25, 0, 0.7);
    letterI.forEach(p => {
      allPositions.push(p.x, chipHeight / 2 + 0.01, p.z);
      allColors.push(purpleBright.r, purpleBright.g, purpleBright.b);
      particleTypes.push(1);
    });

    // 3. Create circuit trace particles radiating outward - denser
    const createTraceParticles = (startX, startZ, direction, length) => {
      const points = [];
      let x = startX;
      let z = startZ;
      const step = 0.06; // Smaller step = more particles
      let segments = Math.floor(length / step);
      let segmentCount = 0;

      for (let i = 0; i < segments; i++) {
        points.push({ x, z });

        // Move in direction with occasional turns
        if (direction === 'right') {
          x += step;
          if (segmentCount > 3 && Math.random() > 0.8) {
            z += (Math.random() - 0.5) * 0.3;
            segmentCount = 0;
          }
        } else if (direction === 'left') {
          x -= step;
          if (segmentCount > 3 && Math.random() > 0.8) {
            z += (Math.random() - 0.5) * 0.3;
            segmentCount = 0;
          }
        } else if (direction === 'up') {
          z -= step;
          if (segmentCount > 3 && Math.random() > 0.8) {
            x += (Math.random() - 0.5) * 0.3;
            segmentCount = 0;
          }
        } else if (direction === 'down') {
          z += step;
          if (segmentCount > 3 && Math.random() > 0.8) {
            x += (Math.random() - 0.5) * 0.3;
            segmentCount = 0;
          }
        }
        segmentCount++;
      }
      return points;
    };

    // Add trace particles from all sides - more traces
    const traceCount = 8;
    for (let i = 0; i < traceCount; i++) {
      const offset = (i - traceCount / 2 + 0.5) * 0.25;
      const length = 1.5 + Math.random() * 1;

      // Right traces
      createTraceParticles(chipSize / 2 + 0.1, offset, 'right', length).forEach((p, idx) => {
        allPositions.push(p.x, 0, p.z);
        const fade = 1 - idx / (length / 0.06);
        allColors.push(purpleColor.r * fade, purpleColor.g * fade, purpleColor.b * fade);
        particleTypes.push(2 + i); // Trace type with index for wave effect
      });

      // Left traces
      createTraceParticles(-chipSize / 2 - 0.1, offset, 'left', length).forEach((p, idx) => {
        allPositions.push(p.x, 0, p.z);
        const fade = 1 - idx / (length / 0.06);
        allColors.push(purpleColor.r * fade, purpleColor.g * fade, purpleColor.b * fade);
        particleTypes.push(2 + i + traceCount);
      });

      // Top traces (negative Z)
      createTraceParticles(offset, -chipSize / 2 - 0.1, 'up', length).forEach((p, idx) => {
        allPositions.push(p.x, 0, p.z);
        const fade = 1 - idx / (length / 0.06);
        allColors.push(purpleColor.r * fade, purpleColor.g * fade, purpleColor.b * fade);
        particleTypes.push(2 + i + traceCount * 2);
      });

      // Bottom traces (positive Z)
      createTraceParticles(offset, chipSize / 2 + 0.1, 'down', length).forEach((p, idx) => {
        allPositions.push(p.x, 0, p.z);
        const fade = 1 - idx / (length / 0.06);
        allColors.push(purpleColor.r * fade, purpleColor.g * fade, purpleColor.b * fade);
        particleTypes.push(2 + i + traceCount * 3);
      });
    }

    // 4. Add glowing dots at trace ends and intersections
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.5 + Math.random() * 1.5;
      allPositions.push(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      allColors.push(blueColor.r, blueColor.g, blueColor.b);
      particleTypes.push(100 + i); // Glow dots
    }

    // Create particle geometry
    const particleCount = allPositions.length / 3;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(allPositions);
    const colors = new Float32Array(allColors);
    const sizes = new Float32Array(particleCount);

    // Set initial sizes
    for (let i = 0; i < particleCount; i++) {
      if (particleTypes[i] === 1) {
        sizes[i] = 0.06; // AI text - larger
      } else if (particleTypes[i] >= 100) {
        sizes[i] = 0.08; // Glow dots - largest
      } else if (particleTypes[i] >= 2) {
        sizes[i] = 0.04; // Traces
      } else {
        sizes[i] = 0.035; // Chip body
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for size attenuation with vertex colors
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    // Rotate to face camera (chip was laying flat, now stands upright)
    particleSystem.rotation.x = Math.PI / 2;
    scene.add(particleSystem);

    // Store references for animation
    const baseColors = new Float32Array(allColors);
    const baseSizes = new Float32Array(sizes);

    // Animation - pulsing glow, no rotation
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.02;

      const colorAttr = geometry.attributes.color;
      const sizeAttr = geometry.attributes.size;

      for (let i = 0; i < particleCount; i++) {
        const type = particleTypes[i];
        const i3 = i * 3;

        let pulse = 1;
        let sizePulse = 1;

        if (type === 1) {
          // AI text - bright pulse
          pulse = 0.8 + Math.sin(time * 3) * 0.2;
          sizePulse = 1 + Math.sin(time * 2) * 0.1;
        } else if (type >= 100) {
          // Glow dots - individual pulse
          pulse = 0.6 + Math.sin(time * 2 + type * 0.5) * 0.4;
          sizePulse = 1 + Math.sin(time * 3 + type * 0.3) * 0.3;
        } else if (type >= 2) {
          // Traces - wave pulse from chip outward
          const waveOffset = (type - 2) * 0.3;
          pulse = 0.5 + Math.sin(time * 4 - waveOffset) * 0.5;
        } else {
          // Chip body - subtle pulse
          pulse = 0.9 + Math.sin(time * 2) * 0.1;
        }

        colorAttr.array[i3] = baseColors[i3] * pulse;
        colorAttr.array[i3 + 1] = baseColors[i3 + 1] * pulse;
        colorAttr.array[i3 + 2] = baseColors[i3 + 2] * pulse;
        sizeAttr.array[i] = baseSizes[i] * sizePulse;
      }

      colorAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

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

  return <div ref={containerRef} className="ai-chip-container" />;
};

export default AIChip;
