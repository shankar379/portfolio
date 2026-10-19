/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_URL = `${import.meta.env.BASE_URL}models/omnitrix-orange-interactive.glb`;
const clamp = THREE.MathUtils.clamp;
const ease = (x) => x * x * (3 - 2 * x);

function disposeModel(model) {
  const materials = new Set();
  const geometries = new Set();
  model.traverse((node) => {
    if (!node.isMesh) return;
    geometries.add(node.geometry);
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material);
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

// Drawn onto an actual mesh in the dial: perspective, depth and bezel occlusion all remain correct.
function drawDisplay(context, icon, index, shutter, idle) {
  const size = 512;
  context.clearRect(0, 0, size, size);
  context.fillStyle = '#090d0d';
  context.fillRect(0, 0, size, size);
  if (idle) {
    context.fillStyle = '#e8ff38';
    context.beginPath();
    context.moveTo(128, 65); context.quadraticCurveTo(256, 0, 384, 65);
    context.lineTo(288, 238); context.quadraticCurveTo(279, 256, 288, 274);
    context.lineTo(384, 447); context.quadraticCurveTo(256, 512, 128, 447);
    context.lineTo(224, 274); context.quadraticCurveTo(233, 256, 224, 238);
    context.closePath(); context.fill();
    return;
  }
  const gradient = context.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#f3ff60'); gradient.addColorStop(1, '#ffcf26');
  context.fillStyle = gradient; context.fillRect(0, 0, size, size);
  // Small engraved screen ticks are behind the mechanical shutters.
  context.strokeStyle = 'rgba(10,18,5,.18)'; context.lineWidth = 1;
  for (let y = 0; y < size; y += 12) { context.beginPath(); context.moveTo(0, y); context.lineTo(size, y); context.stroke(); }
  if (icon?.complete && icon.naturalWidth) context.drawImage(icon, 174, 167, 164, 164);
  context.fillStyle = '#12180c'; context.textAlign = 'center'; context.font = '500 17px monospace';
  context.fillText(`SKILL / ${String(index + 1).padStart(2, '0')}`, 256, 362);
  // Two opposing black V-shaped shutters leave a diamond opening; close over the icon during each turn.
  const inset = shutter * 252;
  context.fillStyle = '#080c0d';
  context.beginPath(); context.moveTo(0, 0); context.lineTo(256 + inset, 0);
  context.lineTo(48 + inset, 256); context.lineTo(256 + inset, 512); context.lineTo(0, 512); context.closePath(); context.fill();
  context.beginPath(); context.moveTo(512, 0); context.lineTo(256 - inset, 0);
  context.lineTo(464 - inset, 256); context.lineTo(256 - inset, 512); context.lineTo(512, 512); context.closePath(); context.fill();
  context.strokeStyle = '#ff9a2b'; context.lineWidth = 3;
  for (const side of [-1, 1]) {
    context.beginPath(); context.moveTo(256 - side * inset, 4);
    context.lineTo(256 + side * (208 - inset), 256);
    context.lineTo(256 - side * inset, 508); context.stroke();
  }
}

export default function WatchScene({ progress, activeIndex, skills, reducedMotion, onActivate, onReady, onError }) {
  const containerRef = useRef(null);
  const inputRef = useRef({ progress, activeIndex, reducedMotion, onActivate, onReady, onError });
  useEffect(() => { inputRef.current = { progress, activeIndex, reducedMotion, onActivate, onReady, onError }; },
    [progress, activeIndex, reducedMotion, onActivate, onReady, onError]);

  useEffect(() => {
    const container = containerRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (error) { inputRef.current.onError?.(error); return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('aria-label', 'Interactive orange watch. Activate using the adjacent button.');
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;';
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .001, 10);
    // High three-quarter angle keeps the skill display legible while showing the raised mechanism.
    camera.position.set(0, .188, .07); camera.lookAt(0, .018, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture; scene.environmentIntensity = .9;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x59301c, 2));
    const key = new THREE.DirectionalLight(0xffecd6, 3); key.position.set(.1, .2, .1); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff771a, 2); rim.position.set(-.1, .04, -.12); scene.add(rim);
    let disposed = false, visible = true, frame = 0, last = 0, dirty = true;
    let model, lift, rotor, mount, baseLift = 1.3;
    let selected = -2, displayed = -1, turnStart = 0, rotationFrom = 0, rotationTo = 0;
    let activation = 0, pulseStart = -10;
    const buttons = [];
    const displayCanvas = document.createElement('canvas'); displayCanvas.width = displayCanvas.height = 512;
    const context = displayCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(displayCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter; screenTexture.generateMipmaps = false;
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    const screen = new THREE.Mesh(new THREE.CircleGeometry(.839, 96), screenMaterial);
    screen.name = 'LiveSkillDisplay'; screen.rotation.x = -Math.PI / 2;
    // In-memory SVG images from the same icon components used by the HTML panel. No remote icon requests.
    const icons = skills.map(({ Icon }) => {
      const image = new Image();
      image.onload = () => { dirty = true; wake(); };
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderToStaticMarkup(<Icon color="#101509" size={256} xmlns="http://www.w3.org/2000/svg" />))}`;
      return image;
    });
    const resize = () => {
      const width = container.clientWidth, height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height;
      camera.position.set(0, .188, .07).multiplyScalar(camera.aspect < 1 ? 1.12 : 1);
      camera.lookAt(0, .018, 0); camera.updateProjectionMatrix(); dirty = true; wake();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }, { rootMargin: '100px' });
    intersection.observe(container);
    const onVisibility = () => { if (!document.hidden) wake(); };
    document.addEventListener('visibilitychange', onVisibility);
    const click = () => { pulseStart = performance.now() / 1000; inputRef.current.onActivate?.(); wake(); };
    renderer.domElement.addEventListener('click', click);
    const lost = (event) => { event.preventDefault(); inputRef.current.onError?.(new Error('WebGL context lost')); };
    renderer.domElement.addEventListener('webglcontextlost', lost);

    function wake() { if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(render); }
    function render(ms) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const now = ms / 1000;
      const dt = Math.min(now - (last || now), .05); last = now;
      const input = inputRef.current;
      const active = input.activeIndex >= 0;
      const target = active ? 1 : 0;
      const previousActivation = activation;
      activation = input.reducedMotion ? target : THREE.MathUtils.damp(activation, target, 10, dt);
      if (Math.abs(activation - target) < .001) activation = target;
      if (model && selected !== input.activeIndex) {
        selected = input.activeIndex; rotationFrom = rotor.rotation.y;
        rotationTo = Math.max(0, selected) * Math.PI / 5;
        turnStart = now; dirty = true;
        if (displayed < 0 || input.reducedMotion || !active) displayed = selected;
        if (active && previousActivation === 0) pulseStart = now;
      }
      const turning = clamp((now - turnStart) / .62, 0, 1);
      if (turning > .48 && displayed !== selected) { displayed = selected; dirty = true; }
      const shutter = input.reducedMotion ? 0 : Math.sin(turning * Math.PI) ** 2;
      if (model) {
        lift.position.y = baseLift + .4 * activation;
        rotor.rotation.y = input.reducedMotion ? rotationTo : THREE.MathUtils.lerp(rotationFrom, rotationTo, ease(turning));
        model.rotation.y = 0;
        const press = input.reducedMotion ? 0 : Math.max(0, 1 - (now - pulseStart) / .23) * .045;
        for (const { object, x } of buttons) object.position.x = x - Math.sign(x) * press;
        if (dirty || turning < 1 || activation !== previousActivation) {
          drawDisplay(context, icons[Math.max(0, displayed)], displayed, shutter, !active);
          screenTexture.needsUpdate = true; dirty = false;
        }
      }
      renderer.render(scene, camera);
      // Stop entirely offscreen; while visible keep input responsive without recreating WebGL resources.
      wake();
    }
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) { disposeModel(gltf.scene); return; }
      model = gltf.scene; lift = model.getObjectByName('DialLift'); rotor = model.getObjectByName('BezelRotor'); mount = model.getObjectByName('ScreenMount');
      if (!lift || !rotor || !mount) { disposeModel(model); model = null; inputRef.current.onError?.(new Error('Incomplete watch rig')); return; }
      baseLift = lift.position.y;
      model.traverse((object) => {
        if (object.name.startsWith('Emblem_')) object.visible = false;
        if (object.name.startsWith('Button_') && !object.name.endsWith('Socket')) buttons.push({ object, x: object.position.x });
      });
      mount.add(screen); scene.add(model); dirty = true; inputRef.current.onReady?.(); wake();
    }, undefined, (error) => { if (!disposed) inputRef.current.onError?.(error); });
    resize(); wake();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('click', click); renderer.domElement.removeEventListener('webglcontextlost', lost);
      icons.forEach((icon) => { icon.onload = null; });
      if (model) disposeModel(model);
      else { screen.geometry.dispose(); screenMaterial.dispose(); }
      screenTexture.dispose(); environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [skills]);

  return <div ref={containerRef} className="watch-scene" style={{ width: '100%', height: '100%' }} />;
}
