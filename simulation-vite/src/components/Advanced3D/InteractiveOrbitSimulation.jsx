import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const InteractiveOrbitSimulation = ({ blackHoleMass = 10, blackHoleRadius = 1 }) => {
  const [objects, setObjects] = useState([]);
  const { camera, raycaster, mouse } = useThree();
  const controlsRef = useRef();

  // Physics constants
  const G = 6.674e-11; // Gravitational constant
  const c = 299792458; // Speed of light
  const M_sun = 1.989e30; // Solar mass

  // Add object function
  const addObject = (position, velocity = [0, 0, 0], mass = 1e24) => {
    const newObject = {
      id: Date.now(),
      position: new THREE.Vector3(...position),
      velocity: new THREE.Vector3(...velocity),
      mass,
      trail: [],
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
    };
    setObjects(prev => [...prev, newObject]);
  };

  // Handle click to add objects
  const handleClick = (event) => {
    if (controlsRef.current) {
      const intersects = raycaster.intersectObjects(event.target.children);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const velocity = [
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ];
        addObject([point.x, point.y, point.z], velocity);
      }
    }
  };

  // Orbital object component
  const OrbitalObject = ({ object, blackHoleMass, blackHoleRadius }) => {
    const meshRef = useRef();
    const trailRef = useRef();

    useFrame((state, delta) => {
      if (!meshRef.current) return;

      // Calculate gravitational force
      const blackHoleMass_kg = blackHoleMass * M_sun;
      const distance = object.position.length();
      const force = G * blackHoleMass_kg / (distance * distance);
      
      // Calculate orbital velocity (simplified)
      const orbitalVelocity = Math.sqrt(G * blackHoleMass_kg / distance);
      const direction = object.position.clone().normalize();
      
      // Apply gravitational acceleration
      const acceleration = direction.multiplyScalar(-force / object.mass);
      object.velocity.add(acceleration.multiplyScalar(delta));
      object.position.add(object.velocity.clone().multiplyScalar(delta));

      // Update trail
      object.trail.push(object.position.clone());
      if (object.trail.length > 100) {
        object.trail.shift();
      }

      // Update mesh position
      meshRef.current.position.copy(object.position);
      
      // Update trail geometry
      if (trailRef.current && object.trail.length > 1) {
        const positions = new Float32Array(object.trail.length * 3);
        object.trail.forEach((point, i) => {
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
        });
        trailRef.current.geometry.setPositions(positions);
      }

      // Check for collision with black hole
      if (distance < blackHoleRadius * 2) {
        setObjects(prev => prev.filter(obj => obj.id !== object.id));
      }
    });

    return (
      <group>
        {/* Object sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={object.color} />
        </mesh>
        
        {/* Trail line */}
        {object.trail.length > 1 && (
          <line ref={trailRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={object.trail.length}
                array={new Float32Array(object.trail.length * 3)}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={object.color} transparent opacity={0.6} />
          </line>
        )}
      </group>
    );
  };

  return (
    <group onClick={handleClick}>
      <OrbitControls ref={controlsRef} />
      
      {/* Black Hole */}
      <mesh>
        <sphereGeometry args={[blackHoleRadius, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Event Horizon Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[blackHoleRadius * 1.5, blackHoleRadius * 2, 64]} />
        <meshBasicMaterial 
          color="#ff6b6b" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Orbital Objects */}
      {objects.map(object => (
        <OrbitalObject 
          key={object.id} 
          object={object} 
          blackHoleMass={blackHoleMass}
          blackHoleRadius={blackHoleRadius}
        />
      ))}
      
      {/* Instructions */}
      <mesh position={[0, 3, 0]}>
        <planeGeometry args={[4, 1]} />
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

export default InteractiveOrbitSimulation;
