import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MultiBlackHoleSystem = () => {
  const [blackHoles, setBlackHoles] = useState([
    { id: 1, mass: 10, position: [0, 0, 0], velocity: [0, 0, 0], color: '#ff0000' },
    { id: 2, mass: 8, position: [5, 0, 0], velocity: [0, 0.1, 0], color: '#0000ff' }
  ]);
  const [particles, setParticles] = useState([]);
  const [mergerActive, setMergerActive] = useState(false);

  // Physics constants
  const G = 6.674e-11;
  const c = 299792458;
  const M_sun = 1.989e30;

  // Calculate gravitational force between two objects
  const calculateForce = (obj1, obj2) => {
    const distance = obj1.position.distanceTo(obj2.position);
    if (distance === 0) return new THREE.Vector3(0, 0, 0);
    
    const force = G * obj1.mass * obj2.mass * M_sun * M_sun / (distance * distance);
    const direction = obj2.position.clone().sub(obj1.position).normalize();
    return direction.multiplyScalar(force);
  };

  // Update black hole positions
  useFrame((state, delta) => {
    const newBlackHoles = blackHoles.map((bh, index) => {
      const newBH = { ...bh };
      newBH.position = new THREE.Vector3(...bh.position);
      newBH.velocity = new THREE.Vector3(...bh.velocity);

      // Calculate forces from other black holes
      let totalForce = new THREE.Vector3(0, 0, 0);
      blackHoles.forEach((otherBH, otherIndex) => {
        if (index !== otherIndex) {
          const force = calculateForce(newBH, otherBH);
          totalForce.add(force);
        }
      });

      // Apply force to velocity
      const acceleration = totalForce.divideScalar(newBH.mass * M_sun);
      newBH.velocity.add(acceleration.multiplyScalar(delta));
      newBH.position.add(newBH.velocity.clone().multiplyScalar(delta));

      return newBH;
    });

    setBlackHoles(newBlackHoles);

    // Check for merger
    const bh1 = newBlackHoles[0];
    const bh2 = newBlackHoles[1];
    const distance = bh1.position.distanceTo(bh2.position);
    const mergerDistance = 2; // Schwarzschild radius threshold

    if (distance < mergerDistance && !mergerActive) {
      setMergerActive(true);
      createMergerParticles(bh1.position, bh2.position);
    }
  });

  // Create merger particle effects
  const createMergerParticles = (pos1, pos2) => {
    const newParticles = [];
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const radius = Math.random() * 2;
      newParticles.push({
        id: Date.now() + i,
        position: [
          pos1.x + Math.cos(angle) * radius,
          pos1.y + Math.sin(angle) * radius,
          pos1.z + (Math.random() - 0.5) * 2
        ],
        velocity: [
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ],
        life: 1.0,
        color: new THREE.Color().setHSL(0.1, 1, 0.5)
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Black hole component
  const BlackHole = ({ blackHole }) => {
    const meshRef = useRef();
    const ringRef = useRef();

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.position.copy(blackHole.position);
        meshRef.current.rotation.y += 0.01;
      }
      if (ringRef.current) {
        ringRef.current.position.copy(blackHole.position);
        ringRef.current.rotation.y -= 0.02;
      }
    });

    const schwarzschildRadius = 2 * G * blackHole.mass * M_sun / (c * c) / 1000; // Convert to km

    return (
      <group>
        {/* Black hole sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[schwarzschildRadius, 32, 32]} />
          <meshBasicMaterial color={blackHole.color} />
        </mesh>
        
        {/* Accretion disk */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[schwarzschildRadius * 1.5, schwarzschildRadius * 3, 64]} />
          <meshBasicMaterial 
            color={blackHole.color} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gravitational field visualization */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[schwarzschildRadius * 2, schwarzschildRadius * 4, 64]} />
          <meshBasicMaterial 
            color={blackHole.color} 
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  };

  // Merger particle component
  const MergerParticle = ({ particle }) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
      if (!meshRef.current) return;

      // Update particle position
      particle.position[0] += particle.velocity[0] * delta;
      particle.position[1] += particle.velocity[1] * delta;
      particle.position[2] += particle.velocity[2] * delta;

      // Update life
      particle.life -= delta * 0.5;

      // Update mesh
      meshRef.current.position.set(...particle.position);
      meshRef.current.material.opacity = particle.life;

      // Remove dead particles
      if (particle.life <= 0) {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      }
    });

    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color={particle.color} 
          transparent 
          opacity={particle.life}
        />
      </mesh>
    );
  };

  // Gravitational wave visualization
  const GravitationalWaves = () => {
    const waveRef = useRef();

    useFrame((state) => {
      if (!waveRef.current) return;

      const time = state.clock.elapsedTime;
      const bh1 = blackHoles[0];
      const bh2 = blackHoles[1];
      const distance = new THREE.Vector3(...bh1.position).distanceTo(new THREE.Vector3(...bh2.position));
      
      // Create wave effect based on orbital motion
      const waveIntensity = Math.sin(time * 2) * (1 / distance);
      waveRef.current.material.opacity = Math.abs(waveIntensity) * 0.3;
    });

    return (
      <mesh ref={waveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 15, 64]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  };

  return (
    <group>
      {/* Black holes */}
      {blackHoles.map(bh => (
        <BlackHole key={bh.id} blackHole={bh} />
      ))}
      
      {/* Gravitational waves */}
      <GravitationalWaves />
      
      {/* Merger particles */}
      {particles.map(particle => (
        <MergerParticle key={particle.id} particle={particle} />
      ))}
      
      {/* Connection line between black holes */}
      {blackHoles.length === 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                ...blackHoles[0].position,
                ...blackHoles[1].position
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffff00" transparent opacity={0.5} />
        </line>
      )}
      
      {/* Merger status indicator */}
      {mergerActive && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}
    </group>
  );
};

export default MultiBlackHoleSystem;
