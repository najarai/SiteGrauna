import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#cfc4b6"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function EmberOrb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.35}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function SceneContent() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const scroll = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight || 1), 1);
    if (group.current) {
      group.current.rotation.y = scroll * Math.PI * 0.35;
      group.current.position.y = scroll * -1.8;
    }
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.35;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Particles />
      <Stars radius={60} depth={40} count={1800} factor={3} saturation={0} fade speed={0.4} />
      <EmberOrb position={[-3.2, 1.2, -4]} color="#b68a6b" scale={1.15} />
      <EmberOrb position={[3.6, -0.6, -5]} color="#8a6a55" scale={0.75} />
      <EmberOrb position={[0.4, 2.4, -6]} color="#d4b79a" scale={0.45} />
      <mesh rotation={[Math.PI / 2.4, 0.2, 0.1]} position={[0, -1.2, -2]}>
        <torusGeometry args={[2.4, 0.015, 16, 180]} />
        <meshBasicMaterial color="#cfc4b6" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[-0.4, 0.6, 0.2]} position={[0.8, 0.6, -3]}>
        <torusGeometry args={[1.5, 0.01, 12, 140]} />
        <meshBasicMaterial color="#b68a6b" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

export function AtmosphereCanvas() {
  return (
    <div className="canvas-wrap" aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 7.2], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0908"]} />
        <fog attach="fog" args={["#0a0908", 8, 28]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} color="#f3eee6" />
        <pointLight position={[-4, -2, 2]} intensity={1.4} color="#b68a6b" />
        <SceneContent />
      </Canvas>
    </div>
  );
}
