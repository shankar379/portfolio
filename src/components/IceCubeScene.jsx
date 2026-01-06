import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import './IceCubeScene.css';

// Skills data
const skills = [
  { name: 'React', color: '#ff6d00', type: 'react' },
  { name: 'Django', color: '#ff8500', type: 'django' },
  { name: 'Android', color: '#ff9100', type: 'android' },
  { name: 'React Native', color: '#ff7900', type: 'reactnative' },
  { name: 'GitHub', color: '#ff6000', type: 'github' },
  { name: 'Three.js', color: '#ff5400', type: 'threejs' },
  { name: 'Unreal', color: '#ff4800', type: 'unreal' },
  { name: 'AWS', color: '#ffaa00', type: 'aws' },
  { name: 'Firebase', color: '#ff9e00', type: 'firebase' },
];

// Create unique ice block geometry with seed-based noise
function createIceBlockGeometry(seed = 1) {
  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6, 24, 24, 24);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const ax = Math.abs(x);
    const ay = Math.abs(y);
    const az = Math.abs(z);

    // Unique noise based on seed
    const s = seed * 1.3;
    const noise1 = Math.sin(x * 5 * s + y * 4) * Math.cos(z * 4.5 + s) * 0.05;
    const noise2 = Math.cos(y * 6 + z * 5 * s) * Math.sin(x * 5.5) * 0.04;
    const noise3 = Math.sin(z * 7 * s + x * 6) * Math.cos(y * 5) * 0.03;
    const noise4 = Math.sin(x * 10 + s) * Math.cos(y * 9) * Math.sin(z * 8) * 0.02;

    // Corner softening
    const cornerFactor = (ax > 0.7 && ay > 0.7) || (ay > 0.7 && az > 0.7) || (ax > 0.7 && az > 0.7) ? 0.9 : 1;

    const totalNoise = noise1 + noise2 + noise3 + noise4;

    const newX = x * cornerFactor + totalNoise * (ax > 0.6 ? 1.2 : 0.4);
    const newY = y * cornerFactor + totalNoise * (ay > 0.6 ? 1.2 : 0.4);
    const newZ = z * cornerFactor + totalNoise * (az > 0.6 ? 1.2 : 0.4);

    positions.setX(i, newX);
    positions.setY(i, newY);
    positions.setZ(i, newZ);
  }

  geometry.computeVertexNormals();
  return geometry;
}

// React Logo Icon
function ReactIcon({ color }) {
  const createEllipseRing = (radiusX, radiusY, tubeRadius) => {
    const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(80);
    const points3D = points.map(p => new THREE.Vector3(p.x, p.y, 0));
    const path = new THREE.CatmullRomCurve3(points3D, true);
    return new THREE.TubeGeometry(path, 80, tubeRadius, 6, true);
  };

  return (
    <group scale={0.55}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      {[0, Math.PI / 3, -Math.PI / 3].map((rot, i) => (
        <mesh key={i} rotation={[0, 0, rot]}>
          <primitive object={createEllipseRing(0.55, 0.22, 0.028)} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// Django Icon - D letter
function DjangoIcon({ color }) {
  return (
    <group scale={0.5}>
      <mesh>
        <torusGeometry args={[0.3, 0.08, 8, 32, Math.PI]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Android Icon - Robot head
function AndroidIcon({ color }) {
  return (
    <group scale={0.45}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.15, 0.35, 0.1]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0.35, 0.1]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// GitHub Icon - Octocat simplified
function GitHubIcon({ color }) {
  return (
    <group scale={0.5}>
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.2, 0.25, 0.2]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.25, 0.2]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Three.js Icon - 3D cube
function ThreeJsIcon({ color }) {
  return (
    <group scale={0.45}>
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} wireframe />
      </mesh>
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Unreal Icon - U shape
function UnrealIcon({ color }) {
  return (
    <group scale={0.5}>
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// AWS Icon - Cloud shape
function AwsIcon({ color }) {
  return (
    <group scale={0.5}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.25, -0.05, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.25, -0.05, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Firebase Icon - Flame shape
function FirebaseIcon({ color }) {
  return (
    <group scale={0.5}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.25, 0.6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.1, -0.15, 0.05]} rotation={[0.2, 0, -0.3]}>
        <coneGeometry args={[0.12, 0.35, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, -0.1, 0.05]} rotation={[-0.2, 0, 0.3]}>
        <coneGeometry args={[0.1, 0.3, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Get icon component by type
function SkillIcon({ type, color }) {
  switch (type) {
    case 'react': return <ReactIcon color={color} />;
    case 'django': return <DjangoIcon color={color} />;
    case 'android': return <AndroidIcon color={color} />;
    case 'reactnative': return <ReactIcon color={color} />;
    case 'github': return <GitHubIcon color={color} />;
    case 'threejs': return <ThreeJsIcon color={color} />;
    case 'unreal': return <UnrealIcon color={color} />;
    case 'aws': return <AwsIcon color={color} />;
    case 'firebase': return <FirebaseIcon color={color} />;
    default: return <ReactIcon color={color} />;
  }
}

// Single Ice Block with skill inside
function IceBlock({ skill, seed, position }) {
  const geometry = useMemo(() => createIceBlockGeometry(seed), [seed]);

  return (
    <Float
      speed={1.2 + seed * 0.1}
      rotationIntensity={0}
      floatIntensity={0.2}
      floatingRange={[-0.05, 0.05]}
    >
      <group position={position} rotation={[0.15, 0.2, 0.05]}>
        {/* Ice shell with frosted texture */}
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.15}
            chromaticAberration={0.015}
            anisotropy={0.2}
            distortion={0.03}
            distortionScale={0.08}
            temporalDistortion={0.01}
            transmission={1}
            roughness={0.08}
            ior={1.4}
            color="#f8fcff"
            attenuationColor="#d8eeff"
            attenuationDistance={3}
            clearcoat={0.2}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Skill icon inside */}
        <SkillIcon type={skill.type} color={skill.color} />
      </group>
    </Float>
  );
}

// Main scene with all ice blocks
function Scene() {
  // Grid positions for 9 ice blocks (3x3)
  const positions = [
    [-2.8, 1.5, 0],    // Top left
    [0, 1.5, 0],       // Top center
    [2.8, 1.5, 0],     // Top right
    [-2.8, -0.3, 0],   // Middle left
    [0, -0.3, 0],      // Center
    [2.8, -0.3, 0],    // Middle right
    [-2.8, -2.1, 0],   // Bottom left
    [0, -2.1, 0],      // Bottom center
    [2.8, -2.1, 0],    // Bottom right
  ];

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#e8f4ff" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#ffffff" />

      {skills.map((skill, index) => (
        <IceBlock
          key={skill.name}
          skill={skill}
          seed={index + 1}
          position={positions[index]}
        />
      ))}

      <Environment preset="city" />
    </>
  );
}

const IceCubeScene = () => {
  return (
    <section id="icecube" className="icecube-section">
      <div className="icecube-noise"></div>

      <div className="icecube-canvas-full">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>
    </section>
  );
};

export default IceCubeScene;
