import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  SiFigma,
  SiReact,
  SiThreedotjs,
  SiPython,
  SiAndroidstudio
} from 'react-icons/si';
import { createRoot } from 'react-dom/client';
import './GridScene.css';

const themeColor = '#a78bfa';


const GridScene = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const hoveredBoxRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - isometric/three-quarter view like the image
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(14, 11, 14);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0xf5f5f5, 1);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Realistic lighting - strong top-left directional light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Main directional light from directly above (stronger, more dramatic)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.4);
    directionalLight.position.set(0, 20, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.02;
    scene.add(directionalLight);

    // Create white and theme color grid helper
    const gridHelper = new THREE.GridHelper(30, 30, 0xffffff, parseInt(themeColor.replace('#', ''), 16));
    gridHelper.material.opacity = 0.6;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create white reflective grid floor plane
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 1.0
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    // Store all interactive buildings (must be declared before functions that use it)
    const interactiveBuildings = [];

    // Create raised platform
    const createPlatform = (x, z, width, depth, height = 0.3) => {
      const platformGroup = new THREE.Group();
      const platformGeo = new THREE.BoxGeometry(width, height, depth);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.2,
        roughness: 0.6
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.set(x, height / 2, z);
      platform.receiveShadow = true;
      platformGroup.add(platform);
      return platformGroup;
    };

    // Create transparent L-shaped pipe
    const createLPipe = (startX, startY, startZ, endX, endY, endZ, radius = 0.15) => {
      const pipeGroup = new THREE.Group();
      const pipeMaterial = new THREE.MeshStandardMaterial({
        color: parseInt(themeColor.replace('#', ''), 16),
        emissive: parseInt(themeColor.replace('#', ''), 16),
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        metalness: 0.8,
        roughness: 0.2
      });

      // Horizontal segment
      const hLength = Math.abs(endX - startX);
      if (hLength > 0) {
        const hGeo = new THREE.CylinderGeometry(radius, radius, hLength, 16);
        const hPipe = new THREE.Mesh(hGeo, pipeMaterial);
        hPipe.rotation.z = Math.PI / 2;
        hPipe.position.set((startX + endX) / 2, startY, startZ);
        pipeGroup.add(hPipe);
      }

      // Vertical segment
      const vLength = Math.abs(endY - startY);
      if (vLength > 0) {
        const vGeo = new THREE.CylinderGeometry(radius, radius, vLength, 16);
        const vPipe = new THREE.Mesh(vGeo, pipeMaterial);
        vPipe.position.set(endX, (startY + endY) / 2, startZ);
        pipeGroup.add(vPipe);
      }

      // Corner connector
      const cornerGeo = new THREE.SphereGeometry(radius * 1.2, 16, 16);
      const corner = new THREE.Mesh(cornerGeo, pipeMaterial);
      corner.position.set(endX, startY, startZ);
      pipeGroup.add(corner);

      return pipeGroup;
    };

    // Create floating icon above building
    const createFloatingIcon = (x, y, z, IconComponent, size = 0.4) => {
      const iconGroup = new THREE.Group();
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);

      const tempDiv = document.createElement('div');
      tempDiv.style.width = '256px';
      tempDiv.style.height = '256px';
      tempDiv.style.display = 'flex';
      tempDiv.style.alignItems = 'center';
      tempDiv.style.justifyContent = 'center';
      tempDiv.style.color = '#000000';
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);
      root.render(<IconComponent style={{ width: '200px', height: '200px' }} />);

      setTimeout(() => {
        const svg = tempDiv.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, 256, 256);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 256, 256);
            ctx.drawImage(img, 28, 28, 200, 200);
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            
            const iconGeo = new THREE.PlaneGeometry(size, size);
            const iconMat = new THREE.MeshStandardMaterial({
              map: texture,
              transparent: true,
              side: THREE.DoubleSide,
              emissive: 0xffffff,
              emissiveIntensity: 0.3
            });
            const icon = new THREE.Mesh(iconGeo, iconMat);
            icon.position.set(x, y, z);
            iconGroup.add(icon);
            document.body.removeChild(tempDiv);
          };
          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }
      }, 100);

      return iconGroup;
    };

    // Create building with details (sign, shape on front)
    const createBuildingWithDetails = (x, y, z, width, height, depth, signText = '', frontShape = '') => {
      const buildingGroup = new THREE.Group();
      
      // Main building
      const buildingGeo = new THREE.BoxGeometry(width, height, depth);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.4,
        roughness: 0.5,
        emissive: parseInt(themeColor.replace('#', ''), 16),
        emissiveIntensity: 0.1
      });
      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.position.set(x, y + height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData.isHovered = false;
      buildingGroup.add(building);
      interactiveBuildings.push(building);
      
      // Glowing edges
      const edgesGeo = new THREE.EdgesGeometry(buildingGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: parseInt(themeColor.replace('#', ''), 16),
        transparent: true,
        opacity: 0.6
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      edges.position.set(x, y + height / 2, z);
      buildingGroup.add(edges);
      
      // Sign above building
      if (signText) {
        const sign = createSign(x, y + height + 0.5, z, signText);
        buildingGroup.add(sign);
      }
      
      // Front shape/icon
      if (frontShape) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 200px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frontShape, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const shapeGeo = new THREE.PlaneGeometry(width * 0.6, height * 0.6);
        const shapeMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const shape = new THREE.Mesh(shapeGeo, shapeMat);
        shape.position.set(x, y + height / 2, z + depth / 2 + 0.01);
        buildingGroup.add(shape);
      }
      
      return buildingGroup;
    };

    // Create building with glowing lines (horizontal or vertical)
    const createBuildingWithGlowingLines = (x, y, z, width, height, depth, horizontal = true) => {
      const buildingGroup = new THREE.Group();
      
      // Main building
      const buildingGeo = new THREE.BoxGeometry(width, height, depth);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        metalness: 0.4,
        roughness: 0.5,
        emissive: parseInt(themeColor.replace('#', ''), 16),
        emissiveIntensity: 0.1
      });
      const building = new THREE.Mesh(buildingGeo, buildingMat);
      building.position.set(x, y + height / 2, z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData.isHovered = false;
      buildingGroup.add(building);
      interactiveBuildings.push(building);
      
      // Glowing lines
      const lineCount = horizontal ? Math.floor(height / 0.5) : Math.floor(width / 0.5);
      for (let i = 0; i < lineCount; i++) {
        const lineGeo = horizontal 
          ? new THREE.BoxGeometry(width * 0.8, 0.1, depth * 0.05)
          : new THREE.BoxGeometry(width * 0.05, 0.1, depth * 0.8);
        const lineMat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          emissive: 0x6366f1,
          emissiveIntensity: 2,
          transparent: true,
          opacity: 0.8
        });
        const line = new THREE.Mesh(lineGeo, lineMat);
        if (horizontal) {
          line.position.set(x, y + (i + 1) * 0.5, z + depth / 2 + 0.01);
        } else {
          line.position.set(x + (i - lineCount / 2) * 0.5, y + height / 2, z + depth / 2 + 0.01);
        }
        buildingGroup.add(line);
      }
      
      return buildingGroup;
    };

    // Create building sign
    const createSign = (x, y, z, text, bgColor = parseInt(themeColor.replace('#', ''), 16)) => {
      const signGroup = new THREE.Group();
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = `#${bgColor.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 512, 128);
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      const signGeo = new THREE.PlaneGeometry(2, 0.5);
      const signMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        emissive: bgColor,
        emissiveIntensity: 0.5
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(x, y, z);
      sign.lookAt(camera.position);
      signGroup.add(sign);
      
      return signGroup;
    };

    // Top-Left Cluster: Animations & UI/UX (on raised platform)
    const topLeftPlatform = createPlatform(-8, -8, 12, 12, 0.4);
    scene.add(topLeftPlatform);
    
    // Building 1: ANIMATIONS building with F/T shape
    const animBuilding = createBuildingWithDetails(-10, 0.4, -10, 2, 3, 2, 'ANIMATIONS', 'F');
    scene.add(animBuilding);
    
    // Building 2: Taller building with horizontal glowing lines
    const linesBuilding = createBuildingWithGlowingLines(-6, 0.4, -10, 2, 5, 2, true);
    scene.add(linesBuilding);
    const atomIcon1 = createFloatingIcon(-6, 6, -10, SiReact, 0.5);
    scene.add(atomIcon1);
    
    // Building 3: Three.js building
    const threejsBuilding = createBuildingWithDetails(-10, 0.4, -6, 2, 3, 2, 'Three.js');
    scene.add(threejsBuilding);
    const atomIcon2 = createFloatingIcon(-10, 5, -6, SiThreedotjs, 0.5);
    scene.add(atomIcon2);
    
    // Building 4: Building with vertical glowing lines and UI/UX signs
    const uxBuilding = createBuildingWithGlowingLines(-6, 0.4, -6, 2, 3, 2, false);
    scene.add(uxBuilding);
    const uiSign = createSign(-6, 5, -6, 'Ui');
    scene.add(uiSign);
    const uxSign = createSign(-6, 4.5, -6, 'UX');
    scene.add(uxSign);

    // Top-Right Cluster: Backend & Mobile (on raised platform)
    const topRightPlatform = createPlatform(8, -8, 14, 12, 0.4);
    scene.add(topRightPlatform);
    
    // Building 1: Monitor icon building
    const monitorBuilding = createBuildingWithDetails(4, 0.4, -10, 2, 3, 2);
    scene.add(monitorBuilding);
    const monitorIcon = createFloatingIcon(4, 5, -10, SiFigma, 0.5);
    scene.add(monitorIcon);
    
    // Building 2: React Native building (taller)
    const rnBuilding = createBuildingWithDetails(8, 0.4, -10, 2.5, 6, 2.5, 'React Native');
    scene.add(rnBuilding);
    const androidIcon = createFloatingIcon(8, 7.5, -10, SiAndroidstudio, 0.6);
    scene.add(androidIcon);
    
    // Building 3: Python building
    const pythonBuilding = createBuildingWithDetails(12, 0.4, -10, 2, 3, 2, 'Python');
    scene.add(pythonBuilding);
    const pythonIcon = createFloatingIcon(12, 5, -10, SiPython, 0.5);
    scene.add(pythonIcon);
    
    // Building 4: Building with horizontal glowing lines
    const backendBuilding = createBuildingWithGlowingLines(4, 0.4, -6, 2, 3, 2, true);
    scene.add(backendBuilding);
    
    // Building 5: Django building (larger)
    const djangoBuilding = createBuildingWithDetails(8, 0.4, -6, 3, 4, 3, 'django');
    scene.add(djangoBuilding);
    
    // Bottom-Center Cluster: Infrastructure (on circular platform)
    const createCircularPlatform = (x, z, radius, height = 0.3) => {
      const platformGroup = new THREE.Group();
      const platformGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.2,
        roughness: 0.6,
        emissive: parseInt(themeColor.replace('#', ''), 16),
        emissiveIntensity: 0.3
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.set(x, height / 2, z);
      platform.receiveShadow = true;
      platformGroup.add(platform);
      return platformGroup;
    };

    const bottomCenterPlatform = createCircularPlatform(0, 6, 6, 0.4);
    scene.add(bottomCenterPlatform);
    
    // Infrastructure buildings around the circular platform
    const infraBuildings = [
      { x: -3, z: 6, h: 2 },
      { x: 3, z: 6, h: 2.5 },
      { x: 0, z: 3, h: 2 },
      { x: -2, z: 8, h: 1.5 },
      { x: 2, z: 8, h: 1.5 }
    ];
    
    infraBuildings.forEach((pos) => {
      const building = createBuildingWithDetails(pos.x, 0.4, pos.z, 1.5, pos.h, 1.5);
      scene.add(building);
    });

    // Add L-shaped pipes connecting buildings
    const pipes = [
      createLPipe(-10, 3, -10, -6, 3, -10, 0.2),  // Top-left cluster
      createLPipe(-6, 3, -10, -6, 3, -6, 0.2),
      createLPipe(4, 3, -10, 8, 3, -10, 0.2),     // Top-right cluster
      createLPipe(8, 3, -10, 8, 3, -6, 0.2),
      createLPipe(-3, 2, 6, 0, 2, 6, 0.15),       // Bottom-center cluster
      createLPipe(0, 2, 6, 0, 2, 3, 0.15),
    ];
    pipes.forEach(pipe => scene.add(pipe));


    // Mouse move handler for hover detection
    const handleMouseMoveHover = (e) => {
      if (isDraggingRef.current) return;
      
      const mouse = new THREE.Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouse, camera);
      const intersects = raycasterRef.current.intersectObjects(interactiveBuildings, true);
      
      // Reset all buildings
      interactiveBuildings.forEach(building => {
        if (building.userData && building.userData.isHovered) {
          building.userData.isHovered = false;
          if (building.material && building.material.emissiveIntensity !== undefined) {
            building.material.emissiveIntensity = 0.1;
          }
        }
      });
      
      // Highlight hovered building
      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        if (hoveredObject.userData) {
          hoveredObject.userData.isHovered = true;
          if (hoveredObject.material && hoveredObject.material.emissiveIntensity !== undefined) {
            hoveredObject.material.emissiveIntensity = 0.5;
          }
          hoveredBoxRef.current = hoveredObject;
        }
      } else {
        hoveredBoxRef.current = null;
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Animate buildings (subtle pulsing glow)
      const time = Date.now() * 0.001;
      interactiveBuildings.forEach((building, index) => {
        if (building && building.material && !building.userData.isHovered) {
          const pulse = Math.sin(time * 2 + index * 0.5) * 0.05 + 0.1;
          if (building.material.emissiveIntensity !== undefined) {
            building.material.emissiveIntensity = pulse;
          }
        }
      });

      // Smooth camera rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

      // Rotate camera around scene (isometric view maintained)
      const radius = 18;
      const baseY = 11;
      camera.position.x = Math.cos(currentRotationRef.current.y) * radius;
      camera.position.z = Math.sin(currentRotationRef.current.y) * radius;
      camera.position.y = baseY + Math.sin(currentRotationRef.current.x) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction handlers
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

      // Limit vertical rotation
      targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));

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
      e.preventDefault();
      
      const deltaX = e.touches[0].clientX - mouseRef.current.x;
      const deltaY = e.touches[0].clientY - mouseRef.current.y;
      
      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x += deltaY * 0.01;
      
      targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));
      
      mouseRef.current.x = e.touches[0].clientX;
      mouseRef.current.y = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Add event listeners
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', handleMouseMoveHover);
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
    const containerElement = containerRef.current;
    
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
      
      if (renderer && containerElement && renderer.domElement) {
        containerElement.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      interactiveBuildings.forEach(building => {
        if (building && building.geometry) building.geometry.dispose();
        if (building && building.material) {
          building.material.dispose();
          if (building.material.map) {
            building.material.map.dispose();
          }
        }
      });
      planeGeometry.dispose();
      planeMaterial.dispose();
      
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="grid-scene-container" />;
};

export default GridScene;

