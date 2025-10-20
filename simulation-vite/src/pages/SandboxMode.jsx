import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Play, Pause, RotateCcw, Save, Download, Settings } from 'lucide-react';
import DynamicEventHorizon from '../components/Advanced3D/DynamicEventHorizon';
import InteractiveOrbitSimulation from '../components/Advanced3D/InteractiveOrbitSimulation';
import TimeDilationVisualization from '../components/Advanced3D/TimeDilationVisualization';
import MultiBlackHoleSystem from '../components/Advanced3D/MultiBlackHoleSystem';
import Quantum3DCircuit from '../components/Advanced3D/Quantum3DCircuit';
import PhysicsConstants from '../components/PhysicsConstants';
import { physicsApi } from '../api/physicsApi';

const SandboxMode = () => {
  const [activeMode, setActiveMode] = useState('blackhole');
  const [isPlaying, setIsPlaying] = useState(true);
  const [physicsConstants, setPhysicsConstants] = useState({});
  const [simulationData, setSimulationData] = useState({});
  const [massInput, setMassInput] = useState(10);
  const [distanceInput, setDistanceInput] = useState(10);
  const [shotsInput, setShotsInput] = useState(1024);
  const [circuitType, setCircuitType] = useState('bell');
  const [achievements, setAchievements] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [quantumLoading, setQuantumLoading] = useState(false);
  const [quantumError, setQuantumError] = useState(null);
  const canvasRef = useRef(null);

  const modes = [
    { id: 'blackhole', name: 'Black Hole', icon: '🕳️' },
    { id: 'orbits', name: 'Orbits', icon: '🌍' },
    { id: 'time', name: 'Time Dilation', icon: '⏰' },
    { id: 'multi', name: 'Multi-BH', icon: '🌌' },
    { id: 'quantum', name: 'Quantum', icon: '⚛️' }
  ];

  const handleSimulation = async (type, params) => {
    try {
      let result;
      switch (type) {
        case 'radius':
          result = await physicsApi.calculateRadius(params.mass);
          break;
        case 'temperature':
          result = await physicsApi.calculateHawkingRadiation(params.mass);
          break;
        case 'timeDilation':
          result = await physicsApi.calculateTimeDilation(params.mass, params.distance);
          break;
        case 'quantum':
          result = await physicsApi.simulateQuantum(params || {});
          break;
        default:
          return;
      }

      if (result.success) {
        setSimulationData(prev => ({ ...prev, [type]: result.data }));
        checkAchievements(result.data, type);
      }
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  const checkAchievements = (data, type) => {
    const newAchievements = [];
    
    if (type === 'radius' && data.radius > 1000) {
      newAchievements.push({
        id: 'super_massive',
        name: 'Super Massive',
        description: 'Created a black hole with radius > 1000 km',
        icon: '🌟'
      });
    }
    
    if (type === 'temperature' && data.temperature < 1e-10) {
      newAchievements.push({
        id: 'ultra_cold',
        name: 'Ultra Cold',
        description: 'Achieved Hawking temperature < 1e-10 K',
        icon: '❄️'
      });
    }
    
    if (type === 'timeDilation' && data.time_dilation_factor > 10) {
      newAchievements.push({
        id: 'time_master',
        name: 'Time Master',
        description: 'Achieved time dilation factor > 10',
        icon: '⏰'
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      physicsConstants,
      simulationData,
      achievements,
      activeMode
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sandbox-simulation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const runQuantumWithParams = async () => {
    setQuantumError(null);
    setQuantumLoading(true);
    try {
      const params = { shots: shotsInput, circuit: circuitType };
      const result = await physicsApi.simulateQuantum(params);
      if (result.success) {
        setSimulationData(prev => ({ ...prev, quantum: result.data }));
        setSimulationData(prev => ({ ...prev, quantumCounts: result.counts || result.data.counts }));
      } else {
        setQuantumError(result.error || 'Simulation failed');
      }
    } catch (err) {
      setQuantumError(err.message || String(err));
    } finally {
      setQuantumLoading(false);
    }
  };

  const snapshotCanvas = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `snapshot-${new Date().toISOString()}.png`;
      a.click();
    } catch (e) {
      console.error('Snapshot failed', e);
    }
  };

  const render3DScene = () => {
    switch (activeMode) {
      case 'blackhole':
        return (
          <DynamicEventHorizon 
            mass={simulationData.radius?.mass || 10}
            radius={simulationData.radius?.radius || 1}
            timeDilation={simulationData.timeDilation?.time_dilation_factor || 1}
          />
        );
      case 'orbits':
        return (
          <InteractiveOrbitSimulation 
            blackHoleMass={simulationData.radius?.mass || 10}
            blackHoleRadius={simulationData.radius?.radius || 1}
          />
        );
      case 'time':
        return (
          <TimeDilationVisualization 
            mass={simulationData.radius?.mass || 10}
            distance={10}
            timeDilationFactor={simulationData.timeDilation?.time_dilation_factor || 1}
          />
        );
      case 'multi':
        return <MultiBlackHoleSystem />;
      case 'quantum':
        return <Quantum3DCircuit quantumState={simulationData.quantum?.counts || {}} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Physics <span className="text-gradient">Sandbox</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Free experimentation with advanced physics simulations. 
            Mix and match different phenomena to explore the universe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Mode Selection */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Simulation Modes</h3>
              <div className="grid grid-cols-1 gap-2">
                {modes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveMode(mode.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      activeMode === mode.id
                        ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50'
                        : 'bg-black/30 border border-gray-600 hover:border-neon-blue/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <span className="font-medium text-white">{mode.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Physics Constants */}
            <div className="card-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Physics Constants</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="btn-secondary"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
              
              {showSettings && (
                <PhysicsConstants 
                  onConstantsChange={setPhysicsConstants}
                  initialConstants={physicsConstants}
                />
              )}
            </div>

            {/* Quick Inputs */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Parameters</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300">Mass (M☉)</label>
                  <input type="number" value={massInput} onChange={(e) => setMassInput(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-black/20 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Distance (km)</label>
                  <input type="number" value={distanceInput} onChange={(e) => setDistanceInput(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-black/20 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Quantum Shots</label>
                  <input type="number" value={shotsInput} onChange={(e) => setShotsInput(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-black/20 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Quantum Circuit</label>
                  <select value={circuitType} onChange={(e) => setCircuitType(e.target.value)} className="w-full mt-1 p-2 rounded bg-black/20 text-white">
                    <option value="bell">Bell Pair</option>
                    <option value="superposition">Superposition</option>
                    <option value="single">Single Qubit</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleSimulation('radius', { mass: massInput })} className="btn-secondary">Calc Radius</button>
                  <button onClick={() => handleSimulation('temperature', { mass: massInput })} className="btn-secondary">Hawking Temp</button>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleSimulation('timeDilation', { mass: massInput, distance: distanceInput })} className="btn-secondary">Time Dilation</button>
                </div>
                <div className="flex space-x-2">
                  <button onClick={runQuantumWithParams} className="btn-primary">Run Quantum</button>
                </div>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSimulationData({})}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="card-glow">
                <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg border border-neon-blue/30"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{achievement.name}</h4>
                          <p className="text-sm text-gray-300">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="card-glow h-96 lg:h-[600px] relative">
              <Canvas ref={canvasRef} camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={300} depth={50} count={5000} factor={4} fade />
                
                {render3DScene()}
                
                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
              </Canvas>
              {/* Floating overlay on top of canvas */}
              <div className="absolute right-6 top-6 w-80 bg-black/60 border border-gray-700 rounded p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h5 className="text-white font-semibold">Quantum</h5>
                  <div className="flex items-center space-x-2">
                    <button onClick={snapshotCanvas} className="btn-secondary text-xs">Snapshot</button>
                  </div>
                </div>
                <div className="mt-2">
                  {quantumLoading ? (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>Running simulation...</span>
                    </div>
                  ) : quantumError ? (
                    <div className="text-sm text-red-400">{quantumError}</div>
                  ) : simulationData.quantum ? (
                    <div>
                      <div className="mb-2">
                        <img src={`data:image/png;base64,${simulationData.quantum.plot}`} alt="Quantum" className="w-full rounded" />
                      </div>
                      <div className="text-xs text-gray-300 max-h-36 overflow-auto">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(simulationData.quantum.counts || simulationData.quantumCounts || {}, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-300">Run a quantum simulation to see results here.</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quantum Plot */}
            {simulationData.quantum && simulationData.quantum.plot && (
              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2">Quantum Result</h4>
                <img src={`data:image/png;base64,${simulationData.quantum.plot}`} alt="Quantum plot" className="rounded shadow-lg" />
                <pre className="text-sm text-gray-300 mt-2">{JSON.stringify(simulationData.quantum.counts || simulationData.quantumCounts || {}, null, 2)}</pre>
              </div>
            )}
            {/* Simulation Data Display */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {simulationData.radius && (
                <div className="card-glow p-4">
                  <h4 className="font-semibold text-neon-blue mb-2">Schwarzschild Radius</h4>
                  <p className="text-2xl font-bold text-white">
                    {simulationData.radius.radius?.toFixed(2)} km
                  </p>
                </div>
              )}
              
              {simulationData.temperature && (
                <div className="card-glow p-4">
                  <h4 className="font-semibold text-neon-purple mb-2">Hawking Temperature</h4>
                  <p className="text-2xl font-bold text-white">
                    {simulationData.temperature.temperature?.toExponential(2)} K
                  </p>
                </div>
              )}
              
              {simulationData.timeDilation && (
                <div className="card-glow p-4">
                  <h4 className="font-semibold text-neon-pink mb-2">Time Dilation</h4>
                  <p className="text-2xl font-bold text-white">
                    {simulationData.timeDilation.time_dilation_factor?.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SandboxMode;
