import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TimeDilationVisualization = ({ mass = 10, distance = 10, timeDilationFactor = 1 }) => {
  const clockRef = useRef();
  const pendulumRef = useRef();
  const particleRef = useRef();
  const [clocks, setClocks] = useState([]);

  // Add clock at specific distance
  const addClock = (position, distanceFromBH) => {
    const newClock = {
      id: Date.now(),
      position: new THREE.Vector3(...position),
      distance: distanceFromBH,
      timeDilation: calculateTimeDilation(mass, distanceFromBH),
      color: new THREE.Color().setHSL(0.6 - (distanceFromBH / 50), 0.8, 0.6)
    };
    setClocks(prev => [...prev, newClock]);
  };

  // Calculate time dilation at distance
  const calculateTimeDilation = (mass, distance) => {
    const G = 6.674e-11;
    const c = 299792458;
    const M_sun = 1.989e30;
    const mass_kg = mass * M_sun;
    const Rs = (2 * G * mass_kg) / (c * c);
    const factor = Rs / (distance * 1000);
    return 1 / Math.sqrt(1 - factor);
  };

  // Clock component
  const Clock = ({ clock }) => {
    const hourHandRef = useRef();
    const minuteHandRef = useRef();
    const secondHandRef = useRef();

    useFrame((state) => {
      if (!hourHandRef.current || !minuteHandRef.current || !secondHandRef.current) return;

      const time = state.clock.elapsedTime;
      const dilatedTime = time / clock.timeDilation;

      // Animate clock hands based on time dilation
      secondHandRef.current.rotation.z = -dilatedTime * 6; // 6 degrees per second
      minuteHandRef.current.rotation.z = -dilatedTime * 0.1; // 0.1 degrees per second
      hourHandRef.current.rotation.z = -dilatedTime * 0.0083; // 0.0083 degrees per second
    });

    return (
      <group position={clock.position}>
        {/* Clock face */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
          <meshBasicMaterial color={clock.color} />
        </mesh>
        
        {/* Hour hand */}
        <mesh ref={hourHandRef} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.15, 0.02, 0.01]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        
        {/* Minute hand */}
        <mesh ref={minuteHandRef} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.2, 0.015, 0.01]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
        
        {/* Second hand */}
        <mesh ref={secondHandRef} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.25, 0.01, 0.01]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        
        {/* Time dilation indicator */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial 
            color={clock.timeDilation > 1.1 ? "#ff0000" : "#00ff00"} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      </group>
    );
  };

  // Pendulum component
  const Pendulum = ({ position, timeDilation }) => {
    const pendulumRef = useRef();

    useFrame((state) => {
      if (!pendulumRef.current) return;

      const time = state.clock.elapsedTime;
      const dilatedTime = time / timeDilation;
      const angle = Math.sin(dilatedTime * 2) * 0.5; // Pendulum motion
      
      pendulumRef.current.rotation.z = angle;
    });

    return (
      <group position={position}>
        {/* Pendulum string */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 1, 8]} />
          <meshBasicMaterial color="#8B4513" />
        </mesh>
        
        {/* Pendulum bob */}
        <mesh ref={pendulumRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#C0C0C0" />
        </mesh>
      </group>
    );
  };

  // Particle system showing time dilation
  const ParticleSystem = ({ timeDilation }) => {
    const particlesRef = useRef();
    const particleCount = 100;

    useFrame((state) => {
      if (!particlesRef.current) return;

      const time = state.clock.elapsedTime;
      const dilatedTime = time / timeDilation;

      // Update particle positions
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] = Math.sin(dilatedTime + i * 0.1) * 2;
        positions[i3 + 2] = Math.cos(dilatedTime + i * 0.1) * 2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={new Float32Array(particleCount * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.02} 
          color="#00ffff" 
          transparent 
          opacity={0.6}
        />
      </points>
    );
  };

  useFrame((state) => {
    if (!clockRef.current) return;

    // Update main clock
    const time = state.clock.elapsedTime;
    const dilatedTime = time / timeDilationFactor;
    
    // Update clock rotation
    clockRef.current.rotation.z = -dilatedTime * 0.1;
  });

  return (
    <group>
      {/* Main clock at observer position */}
      <group ref={clockRef} position={[0, 0, distance]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Clock hands */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.3, 0.02, 0.01]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Pendulum showing time dilation */}
      <Pendulum 
        position={[2, 0, distance]} 
        timeDilation={timeDilationFactor} 
      />

      {/* Particle system */}
      <ParticleSystem timeDilation={timeDilationFactor} />

      {/* Clocks at different distances */}
      {clocks.map(clock => (
        <Clock key={clock.id} clock={clock} />
      ))}

      {/* Add clock button (invisible, for interaction) */}
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => addClock([0, 0, 5], 5)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default TimeDilationVisualization;
