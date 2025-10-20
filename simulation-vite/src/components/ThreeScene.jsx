import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Black Hole Component
const BlackHole = ({ mass = 10, radius = 1 }) => {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.01;
    }
  });

  return (
    <group>
      {/* Black hole event horizon */}
      <Sphere ref={meshRef} args={[radius, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Accretion disk */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.5, radius * 3, 64]} />
        <meshBasicMaterial 
          color="#ff6b6b" 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 2.5, radius * 4, 64]} />
        <meshBasicMaterial 
          color="#4ecdc4" 
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Quantum Particles Component
const QuantumParticles = ({ count = 100 }) => {
  const points = useRef();
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.001;
      points.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Spacetime Grid Component
const SpacetimeGrid = ({ distortion = 0 }) => {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={gridRef}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshBasicMaterial 
        color="#00d4ff" 
        wireframe 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
};

// Camera Controller
const CameraController = ({ type = 'orbit' }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    if (type === 'orbit') {
      camera.position.x = Math.sin(Date.now() * 0.0005) * 10;
      camera.position.z = Math.cos(Date.now() * 0.0005) * 10;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Main ThreeScene Component
const ThreeScene = ({ 
  type = 'blackhole', 
  mass = 10, 
  radius = 1, 
  distortion = 0,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full h-full ${className}`}
      {...props}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
          
          {/* Stars background */}
          <Stars 
            radius={300} 
            depth={50} 
            count={5000} 
            factor={4} 
            fade 
            speed={1}
          />
          
          {/* Scene content based on type */}
          {type === 'blackhole' && (
            <BlackHole mass={mass} radius={radius} />
          )}
          
          {type === 'quantum' && (
            <QuantumParticles count={200} />
          )}
          
          {type === 'spacetime' && (
            <SpacetimeGrid distortion={distortion} />
          )}
          
          {/* Camera controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={type === 'blackhole'}
            autoRotateSpeed={0.5}
          />
          
          <CameraController type={type} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default ThreeScene;
