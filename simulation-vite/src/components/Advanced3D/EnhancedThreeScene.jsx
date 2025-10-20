import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import DynamicEventHorizon from './DynamicEventHorizon';
import InteractiveOrbitSimulation from './InteractiveOrbitSimulation';
import TimeDilationVisualization from './TimeDilationVisualization';
import MultiBlackHoleSystem from './MultiBlackHoleSystem';
import Quantum3DCircuit from './Quantum3DCircuit';
import LiveAnalytics from './LiveAnalytics';

const EnhancedThreeScene = ({ 
  type = 'blackhole', 
  mass = 10, 
  radius = 1, 
  distance = 10,
  timeDilation = 1,
  quantumState = {},
  physicsConstants = {},
  onInteraction = () => {},
  showAnalytics = false,
  comparisonMode = false
}) => {
  const [interactionMode, setInteractionMode] = useState('view');
  const [cameraMode, setCameraMode] = useState('orbit');
  const [lightingMode, setLightingMode] = useState('realistic');
  const [particleDensity, setParticleDensity] = useState(1000);

  // Camera controller
  const CameraController = () => {
    const { camera } = useThree();
    
    useFrame((state) => {
      if (cameraMode === 'cinematic') {
        // Cinematic camera movement
        const time = state.clock.elapsedTime;
        camera.position.x = Math.sin(time * 0.1) * 15;
        camera.position.y = Math.sin(time * 0.05) * 5 + 5;
        camera.position.z = Math.cos(time * 0.1) * 15;
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === 'first_person') {
        // First person view
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);
      }
    });

    return null;
  };

  // Advanced lighting system
  const AdvancedLighting = () => {
    const lightRef = useRef();
    
    useFrame((state) => {
      if (!lightRef.current) return;

      const time = state.clock.elapsedTime;
      
      if (lightingMode === 'dynamic') {
        // Dynamic lighting based on simulation data
        const intensity = Math.min(mass / 10, 2);
        lightRef.current.intensity = intensity;
        lightRef.current.color.setHSL(0.6, 1, 0.5 + intensity * 0.5);
      } else if (lightingMode === 'quantum') {
        // Quantum-inspired lighting
        lightRef.current.intensity = 0.5 + Math.sin(time * 2) * 0.3;
        lightRef.current.color.setHSL(0.8, 1, 0.7);
      }
    });

    return (
      <>
        <ambientLight intensity={0.1} />
        <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
        <directionalLight position={[0, 10, 0]} intensity={0.3} />
      </>
    );
  };

  // Particle system
  const ParticleSystem = () => {
    const particlesRef = useRef();
    
    useFrame((state) => {
      if (!particlesRef.current) return;

      const time = state.clock.elapsedTime;
      const positions = new Float32Array(particleDensity * 3);
      const colors = new Float32Array(particleDensity * 3);
      
      for (let i = 0; i < particleDensity; i++) {
        const i3 = i * 3;
        
        // Create particle positions
        const angle = (i / particleDensity) * Math.PI * 2;
        const radius = 20 + Math.sin(time + i * 0.01) * 5;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(time + i * 0.1) * 10;
        positions[i3 + 2] = Math.sin(angle) * radius;
        
        // Color based on distance from center
        const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
        const hue = 0.6 + (distance / 30) * 0.4;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      particlesRef.current.geometry.setPositions(positions);
      particlesRef.current.geometry.setColors(colors);
    });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleDensity}
            array={new Float32Array(particleDensity * 3)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleDensity}
            array={new Float32Array(particleDensity * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.02} 
          vertexColors 
          transparent 
          opacity={0.6}
        />
      </points>
    );
  };

  // Render the appropriate 3D scene
  const renderScene = () => {
    const commonProps = {
      mass,
      radius,
      distance,
      timeDilation,
      quantumState,
      physicsConstants
    };

    switch (type) {
      case 'blackhole':
        return <DynamicEventHorizon {...commonProps} />;
      case 'orbits':
        return <InteractiveOrbitSimulation {...commonProps} />;
      case 'time':
        return <TimeDilationVisualization {...commonProps} />;
      case 'multi':
        return <MultiBlackHoleSystem />;
      case 'quantum':
        return <Quantum3DCircuit {...commonProps} />;
      default:
        return <DynamicEventHorizon {...commonProps} />;
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera, scene }) => {
          // Set up post-processing if needed
          scene.fog = new THREE.Fog(0x000000, 50, 200);
        }}
      >
        <PerspectiveCamera makeDefault />
        
        {/* Advanced lighting */}
        <AdvancedLighting />
        
        {/* Stars background */}
        <Stars 
          radius={300} 
          depth={50} 
          count={5000} 
          factor={4} 
          fade 
          speed={1}
        />
        
        {/* Particle system */}
        <ParticleSystem />
        
        {/* Main scene */}
        {renderScene()}
        
        {/* Live analytics overlay */}
        {showAnalytics && (
          <LiveAnalytics 
            simulationData={{ mass, radius, distance, timeDilation, quantumState }}
            realTimeData={[]}
          />
        )}
        
        {/* Camera controller */}
        <CameraController />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={cameraMode === 'auto'}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="glass p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Camera</h4>
          <div className="space-y-1">
            {['orbit', 'cinematic', 'first_person', 'auto'].map((mode) => (
              <button
                key={mode}
                onClick={() => setCameraMode(mode)}
                className={`w-full text-xs px-2 py-1 rounded ${
                  cameraMode === mode 
                    ? 'bg-neon-blue text-white' 
                    : 'bg-black/30 text-gray-300 hover:bg-white/10'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        <div className="glass p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Lighting</h4>
          <div className="space-y-1">
            {['realistic', 'dynamic', 'quantum'].map((mode) => (
              <button
                key={mode}
                onClick={() => setLightingMode(mode)}
                className={`w-full text-xs px-2 py-1 rounded ${
                  lightingMode === mode 
                    ? 'bg-neon-purple text-white' 
                    : 'bg-black/30 text-gray-300 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        
        <div className="glass p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Particles</h4>
          <input
            type="range"
            min="100"
            max="5000"
            value={particleDensity}
            onChange={(e) => setParticleDensity(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-400 mt-1">
            {particleDensity} particles
          </div>
        </div>
      </div>
      
      {/* Performance info */}
      <div className="absolute bottom-4 right-4 glass p-2 rounded text-xs text-gray-400">
        <div>Mode: {type}</div>
        <div>Camera: {cameraMode}</div>
        <div>Lighting: {lightingMode}</div>
        <div>Particles: {particleDensity}</div>
      </div>
    </div>
  );
};

export default EnhancedThreeScene;
