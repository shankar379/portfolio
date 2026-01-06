import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './EnvelopeParticleModel.css';

const EnvelopeParticleModel = () => {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isHoveredRef = useRef(false);
  const flapOpenRef = useRef(0);

  const particleCount = 5000;
  const primaryColor = new THREE.Color(0xff6d00); // Orange
  const secondaryColor = new THREE.Color(0xff4800); // Darker orange
  const letterColor = new THREE.Color(0x3b82f6); // Blue for letter

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle arrays
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const particleTypes = new Float32Array(particleCount); // 0=body, 1=flap, 2=letter

    // Envelope dimensions (realistic proportions)
    const envWidth = 2.2;
    const envHeight = 1.4;
    const flapHeight = 0.7;
    const bodyTop = envHeight / 2 - 0.1;
    const bodyBottom = -envHeight / 2;

    let index = 0;

    const addParticle = (x, y, z, type = 0, colorObj = primaryColor) => {
      if (index >= particleCount) return;
      const i3 = index * 3;

      // Add slight randomness for organic look
      const jitter = 0.015;
      positions[i3] = x + (Math.random() - 0.5) * jitter;
      positions[i3 + 1] = y + (Math.random() - 0.5) * jitter;
      positions[i3 + 2] = z + (Math.random() - 0.5) * jitter;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      colors[i3] = colorObj.r;
      colors[i3 + 1] = colorObj.g;
      colors[i3 + 2] = colorObj.b;

      particleTypes[index] = type;
      index++;
    };

    // === ENVELOPE BODY ===

    // Front face - filled rectangle
    for (let i = 0; i < 600; i++) {
      const x = (Math.random() - 0.5) * envWidth;
      const y = bodyBottom + Math.random() * (bodyTop - bodyBottom);
      addParticle(x, y, 0.05, 0, primaryColor);
    }

    // Back face
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * envWidth;
      const y = bodyBottom + Math.random() * (bodyTop - bodyBottom);
      addParticle(x, y, -0.05, 0, secondaryColor);
    }

    // Edges - denser particles for clear outline
    // Bottom edge
    for (let i = 0; i < 150; i++) {
      const t = i / 150;
      const x = -envWidth / 2 + t * envWidth;
      addParticle(x, bodyBottom, 0, 0, primaryColor);
    }

    // Top edge (where flap connects)
    for (let i = 0; i < 150; i++) {
      const t = i / 150;
      const x = -envWidth / 2 + t * envWidth;
      addParticle(x, bodyTop, 0, 0, primaryColor);
    }

    // Left edge
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const y = bodyBottom + t * (bodyTop - bodyBottom);
      addParticle(-envWidth / 2, y, 0, 0, primaryColor);
    }

    // Right edge
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const y = bodyBottom + t * (bodyTop - bodyBottom);
      addParticle(envWidth / 2, y, 0, 0, primaryColor);
    }

    // Inner V-fold (decorative lines on front)
    // Left diagonal from bottom-left to center
    for (let i = 0; i < 120; i++) {
      const t = i / 120;
      const x = -envWidth / 2 + t * (envWidth / 2);
      const y = bodyBottom + t * (bodyTop - bodyBottom) * 0.8;
      addParticle(x, y, 0.06, 0, secondaryColor);
    }

    // Right diagonal from bottom-right to center
    for (let i = 0; i < 120; i++) {
      const t = i / 120;
      const x = envWidth / 2 - t * (envWidth / 2);
      const y = bodyBottom + t * (bodyTop - bodyBottom) * 0.8;
      addParticle(x, y, 0.06, 0, secondaryColor);
    }

    // === FLAP (triangular) ===
    const flapStartIndex = index;

    // Flap surface - triangle pointing up
    for (let i = 0; i < 500; i++) {
      const t = Math.random(); // How far up the triangle (0=base, 1=tip)
      const maxWidth = envWidth * (1 - t); // Width narrows toward tip
      const x = (Math.random() - 0.5) * maxWidth;
      const y = bodyTop + t * flapHeight;
      addParticle(x, y, 0.03, 1, primaryColor);
    }

    // Flap edges - left
    for (let i = 0; i < 80; i++) {
      const t = i / 80;
      const x = -envWidth / 2 * (1 - t);
      const y = bodyTop + t * flapHeight;
      addParticle(x, y, 0.03, 1, secondaryColor);
    }

    // Flap edges - right
    for (let i = 0; i < 80; i++) {
      const t = i / 80;
      const x = envWidth / 2 * (1 - t);
      const y = bodyTop + t * flapHeight;
      addParticle(x, y, 0.03, 1, secondaryColor);
    }

    // Flap base (hinge line)
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const x = -envWidth / 2 + t * envWidth;
      addParticle(x, bodyTop, 0.04, 1, primaryColor);
    }

    // Seal circle on flap
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const radius = 0.12;
      const x = Math.cos(angle) * radius;
      const y = bodyTop + flapHeight * 0.35 + Math.sin(angle) * radius;
      addParticle(x, y, 0.04, 1, secondaryColor);
    }

    const flapEndIndex = index;

    // === LETTER (inside envelope) ===
    const letterStartIndex = index;
    const letterWidth = envWidth * 0.75;
    const letterHeight = envHeight * 0.7;

    // Letter rectangle
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * letterWidth;
      const y = bodyBottom + 0.15 + Math.random() * letterHeight;
      addParticle(x, y, -0.02, 2, letterColor);
    }

    // Letter lines (text representation)
    for (let line = 0; line < 4; line++) {
      const lineY = bodyBottom + 0.3 + line * 0.2;
      const lineWidth = letterWidth * (0.9 - line * 0.1);
      for (let i = 0; i < 40; i++) {
        const t = i / 40;
        const x = -lineWidth / 2 + t * lineWidth;
        addParticle(x, lineY, -0.01, 2, letterColor);
      }
    }

    const letterEndIndex = index;

    // Trim arrays to actual particle count used
    const actualCount = index;
    const trimmedPositions = new Float32Array(positions.slice(0, actualCount * 3));
    const trimmedColors = new Float32Array(colors.slice(0, actualCount * 3));
    const trimmedOriginal = new Float32Array(originalPositions.slice(0, actualCount * 3));

    // Create geometry with only used particles
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(trimmedPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(trimmedColors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.NormalBlending // Better for white background
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Rotation state
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    // Animation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const posAttr = particleSystem.geometry.attributes.position;
      const posArray = posAttr.array;

      // Smooth flap opening
      const targetFlap = isHoveredRef.current ? 1 : 0;
      flapOpenRef.current += (targetFlap - flapOpenRef.current) * 0.08;

      const flapAngle = -flapOpenRef.current * Math.PI * 0.75; // Open 135 degrees

      // Update flap particles
      for (let i = flapStartIndex; i < flapEndIndex; i++) {
        const i3 = i * 3;
        const origY = trimmedOriginal[i3 + 1];
        const origZ = trimmedOriginal[i3 + 2];

        // Rotate around hinge (top of body)
        const relY = origY - bodyTop;
        const relZ = origZ;

        const newY = bodyTop + relY * Math.cos(flapAngle) - relZ * Math.sin(flapAngle);
        const newZ = relY * Math.sin(flapAngle) + relZ * Math.cos(flapAngle);

        posArray[i3 + 1] = newY;
        posArray[i3 + 2] = newZ;
      }

      // Update letter particles (rise up when open)
      for (let i = letterStartIndex; i < letterEndIndex; i++) {
        const i3 = i * 3;
        const origY = trimmedOriginal[i3 + 1];
        const origZ = trimmedOriginal[i3 + 2];

        // Letter rises and comes forward when envelope opens
        const riseAmount = flapOpenRef.current * 0.5;
        const forwardAmount = flapOpenRef.current * 0.15;

        posArray[i3 + 1] = origY + riseAmount;
        posArray[i3 + 2] = origZ + forwardAmount;
      }

      posAttr.needsUpdate = true;

      // Smooth mouse-follow rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

      particleSystem.rotation.x = currentRotation.x;
      particleSystem.rotation.y = currentRotation.y;

      renderer.render(scene, camera);
    };

    animate();

    // Event handlers
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      targetRotation.x = 0;
      targetRotation.y = 0;
    };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotation.x = y * 0.15;
      targetRotation.y = x * 0.25;
    };

    renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="envelope-particle-container" />;
};

export default EnvelopeParticleModel;
