import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Quantum3DCircuit = ({ quantumState = { '00': 250, '01': 250, '10': 250, '11': 250 } }) => {
  const [qubits, setQubits] = useState([
    { id: 1, position: [0, 0, 0], state: 0, color: '#00d4ff' },
    { id: 2, position: [2, 0, 0], state: 0, color: '#8b5cf6' }
  ]);
  const [gates, setGates] = useState([
    { id: 1, type: 'H', position: [0, 0, 0], active: false },
    { id: 2, type: 'CNOT', position: [1, 0, 0], active: false }
  ]);
  const [entanglement, setEntanglement] = useState(false);

  // Qubit component
  const Qubit = ({ qubit, quantumState }) => {
    const meshRef = useRef();
    const glowRef = useRef();
    const connectionRef = useRef();

    useFrame((state) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;
      
      // Animate qubit based on quantum state
      const stateProbability = quantumState[`${qubit.state}${qubit.id === 1 ? 0 : 1}`] || 0;
      const intensity = stateProbability / 1000; // Normalize
      
      // Pulsing effect based on probability
      const scale = 1 + Math.sin(time * 2 + qubit.id) * intensity * 0.3;
      meshRef.current.scale.setScalar(scale);
      
      // Glow effect
      if (glowRef.current) {
        glowRef.current.material.opacity = 0.3 + intensity * 0.7;
      }

      // Rotation based on quantum state
      meshRef.current.rotation.y += 0.02 * intensity;
      meshRef.current.rotation.x += 0.01 * intensity;
    });

    return (
      <group>
        {/* Qubit sphere */}
        <mesh ref={meshRef} position={qubit.position}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial 
            color={qubit.color} 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Glow effect */}
        <mesh ref={glowRef} position={qubit.position}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color={qubit.color} 
            transparent 
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* State indicator */}
        <mesh position={[qubit.position[0], qubit.position[1] + 0.5, qubit.position[2]]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  };

  // Quantum gate component
  const QuantumGate = ({ gate, qubits }) => {
    const meshRef = useRef();
    const effectRef = useRef();

    useFrame((state) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;
      
      // Gate activation animation
      if (gate.active) {
        meshRef.current.rotation.y += 0.05;
        meshRef.current.scale.setScalar(1 + Math.sin(time * 5) * 0.1);
        
        if (effectRef.current) {
          effectRef.current.material.opacity = 0.5 + Math.sin(time * 3) * 0.3;
        }
      }
    });

    const getGateGeometry = (type) => {
      switch (type) {
        case 'H':
          return <boxGeometry args={[0.3, 0.3, 0.1]} />;
        case 'CNOT':
          return <cylinderGeometry args={[0.2, 0.2, 0.3, 8]} />;
        case 'X':
          return <octahedronGeometry args={[0.2]} />;
        case 'Y':
          return <coneGeometry args={[0.2, 0.4, 8]} />;
        case 'Z':
          return <tetrahedronGeometry args={[0.2]} />;
        default:
          return <boxGeometry args={[0.2, 0.2, 0.2]} />;
      }
    };

    const getGateColor = (type) => {
      switch (type) {
        case 'H': return '#00ff00';
        case 'CNOT': return '#ff0000';
        case 'X': return '#0000ff';
        case 'Y': return '#ffff00';
        case 'Z': return '#ff00ff';
        default: return '#ffffff';
      }
    };

    return (
      <group position={gate.position}>
        {/* Gate mesh */}
        <mesh ref={meshRef}>
          {getGateGeometry(gate.type)}
          <meshBasicMaterial 
            color={getGateColor(gate.type)} 
            transparent 
            opacity={gate.active ? 0.9 : 0.6}
          />
        </mesh>
        
        {/* Gate effect */}
        <mesh ref={effectRef} position={[0, 0, 0.2]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            color={getGateColor(gate.type)} 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Gate label */}
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[0.3, 0.1]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  };

  // Entanglement visualization
  const EntanglementConnection = ({ qubit1, qubit2, quantumState }) => {
    const lineRef = useRef();
    const particlesRef = useRef();

    useFrame((state) => {
      if (!lineRef.current) return;

      const time = state.clock.elapsedTime;
      
      // Calculate entanglement strength
      const entangledStates = ['00', '11'];
      const entanglementStrength = entangledStates.reduce((sum, state) => 
        sum + (quantumState[state] || 0), 0) / 1000;

      // Animate connection
      const positions = new Float32Array([
        ...qubit1.position,
        ...qubit2.position
      ]);
      
      lineRef.current.geometry.setPositions(positions);
      
      // Update line material
      lineRef.current.material.opacity = 0.3 + entanglementStrength * 0.7;
      lineRef.current.material.color.setHSL(0.6, 1, 0.5 + entanglementStrength * 0.5);

      // Animate particles along connection
      if (particlesRef.current) {
        const particlePositions = new Float32Array(20 * 3);
        for (let i = 0; i < 20; i++) {
          const t = (i / 20 + time * 0.1) % 1;
          const pos = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(...qubit1.position),
            new THREE.Vector3(...qubit2.position),
            t
          );
          particlePositions[i * 3] = pos.x;
          particlePositions[i * 3 + 1] = pos.y;
          particlePositions[i * 3 + 2] = pos.z;
        }
        particlesRef.current.geometry.setPositions(particlePositions);
      }
    });

    return (
      <group>
        {/* Connection line */}
        <line ref={lineRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...qubit1.position, ...qubit2.position])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.5}
          />
        </line>
        
        {/* Moving particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={20}
              array={new Float32Array(20 * 3)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.05} 
            color="#00ffff" 
            transparent 
            opacity={0.8}
          />
        </points>
      </group>
    );
  };

  // Quantum state visualization
  const QuantumStateVisualization = ({ quantumState }) => {
    const barsRef = useRef();

    useFrame((state) => {
      if (!barsRef.current) return;

      const time = state.clock.elapsedTime;
      const states = Object.keys(quantumState);
      const values = Object.values(quantumState);
      
      // Create 3D bar chart
      const positions = new Float32Array(states.length * 3);
      const colors = new Float32Array(states.length * 3);
      
      states.forEach((state, i) => {
        const x = (i - states.length / 2) * 0.5;
        const y = values[i] / 1000; // Normalize
        positions[i * 3] = x;
        positions[i * 3 + 1] = y / 2;
        positions[i * 3 + 2] = 0;
        
        // Color based on state
        const hue = i / states.length;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      });
      
      barsRef.current.geometry.setPositions(positions);
      barsRef.current.geometry.setColors(colors);
    });

    return (
      <points ref={barsRef} position={[0, -2, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={Object.keys(quantumState).length}
            array={new Float32Array(Object.keys(quantumState).length * 3)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={Object.keys(quantumState).length}
            array={new Float32Array(Object.keys(quantumState).length * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.2} 
          vertexColors 
          transparent 
          opacity={0.8}
        />
      </points>
    );
  };

  return (
    <group>
      {/* Qubits */}
      {qubits.map(qubit => (
        <Qubit key={qubit.id} qubit={qubit} quantumState={quantumState} />
      ))}
      
      {/* Quantum gates */}
      {gates.map(gate => (
        <QuantumGate key={gate.id} gate={gate} qubits={qubits} />
      ))}
      
      {/* Entanglement connection */}
      {entanglement && qubits.length === 2 && (
        <EntanglementConnection 
          qubit1={qubits[0]} 
          qubit2={qubits[1]} 
          quantumState={quantumState} 
        />
      )}
      
      {/* Quantum state visualization */}
      <QuantumStateVisualization quantumState={quantumState} />
      
      {/* Control panel (invisible) */}
      <mesh 
        position={[0, -3, 0]} 
        onClick={() => setEntanglement(!entanglement)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default Quantum3DCircuit;
