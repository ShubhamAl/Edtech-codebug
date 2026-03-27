"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null!);

  // Create points manually
  const [sphere] = useState(() => {
    const arr = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;
      // High-performance sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.5; // Radius of the cloud
      arr[i3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i3 + 2] = r * Math.cos(phi);
    }
    return arr;
  });

  useFrame((state, delta) => {
    // Gentle rotation
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          // Updated to match the lavender/purple "Kristina" theme primary color
          color="#8E97FD"
          size={0.008}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6} // Slightly higher opacity for neubrutalist punch
        />
      </Points>
    </group>
  );
}

export default function VisualElement() {
  // Neubrutalism style variable
  const blackBorder = "border-[3px] border-black";

  return (
    // Updated wrapper to align with the soft beige background of the new theme
    <div className="absolute inset-0 -z-10 w-full h-full min-h-[600px] bg-[#F9F4F1] overflow-hidden">

      {/* Decorative "Sticker" shapes floating in the 3D space background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 left-[10%] w-32 h-32 bg-[#FFD600] rounded-full ${blackBorder} opacity-20 rotate-12`} />
        <div className={`absolute bottom-20 right-[10%] w-48 h-48 bg-[#FF6AC1] rounded-full ${blackBorder} opacity-10 -rotate-12`} />
      </div>

      <Canvas
        camera={{ position: [0, 0, 1.5] }} // Pushed camera back slightly for full-width feel
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <ParticleCloud />
      </Canvas>

      {/* Subtle overlay to ensure text remains readable over the particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9F4F1]/40 to-[#F9F4F1]" />
    </div>
  );
}