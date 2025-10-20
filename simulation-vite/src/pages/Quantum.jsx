import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Download, RotateCcw } from 'lucide-react';
import { physicsApi, storageUtils } from '../api/physicsApi';
import SimulationCard from '../components/SimulationCard';
import DataPanel from '../components/DataPanel';
import ThreeScene from '../components/ThreeScene';
import LoaderComponent from '../components/Loader';

const Quantum = () => {
  const [results, setResults] = useState({
    plot: null,
    counts: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await physicsApi.simulateQuantum();
      if (result.success) {
        setResults({
          plot: result.data.plot,
          counts: result.data.counts
        });
        storageUtils.saveSimulation('quantum', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults({ plot: null, counts: null });
    setError('');
  };

  const chartData = results.counts ? Object.entries(results.counts).map(([state, count]) => ({
    name: state,
    value: count
  })) : [];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Quantum <span className="text-gradient">Simulation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore quantum entanglement and superposition through 
            interactive quantum circuit simulations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-neon-purple" />
                <h2 className="text-2xl font-semibold text-white">Quantum Circuit</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-black/30 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-3">Circuit Description</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>• <span className="text-neon-blue">H gate</span> on qubit 0 (creates superposition)</p>
                    <p>• <span className="text-neon-purple">CNOT gate</span> between qubits 0 and 1 (creates entanglement)</p>
                    <p>• <span className="text-neon-pink">Measurement</span> of both qubits</p>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSimulate}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <LoaderComponent size="small" message="Simulating..." />
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Run Simulation</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Quantum States Info */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Quantum States</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>|00⟩ (Both qubits in |0⟩):</span>
                  <span className="text-neon-blue">~25% probability</span>
                </div>
                <div className="flex justify-between">
                  <span>|01⟩ (First |0⟩, second |1⟩):</span>
                  <span className="text-neon-purple">~25% probability</span>
                </div>
                <div className="flex justify-between">
                  <span>|10⟩ (First |1⟩, second |0⟩):</span>
                  <span className="text-neon-pink">~25% probability</span>
                </div>
                <div className="flex justify-between">
                  <span>|11⟩ (Both qubits in |1⟩):</span>
                  <span className="text-neon-green">~25% probability</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* 3D Visualization */}
            <div className="card-glow h-64">
              <ThreeScene type="quantum" />
            </div>

            {/* Results */}
            {results.plot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glow"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Simulation Results</h3>
                <div className="text-center">
                  <img
                    src={`data:image/png;base64,${results.plot}`}
                    alt="Quantum simulation results"
                    className="max-w-full h-auto rounded-lg border border-gray-600"
                  />
                </div>
              </motion.div>
            )}

            {results.counts && (
              <SimulationCard
                type="quantum"
                data={{ counts: results.counts }}
                title="Quantum State Counts"
                description="Measurement results from quantum circuit"
                color="purple"
                onAction={() => storageUtils.exportData()}
                actionLabel="Export Data"
              />
            )}
          </motion.div>
        </div>

        {/* Data Visualization */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <DataPanel
              data={chartData}
              type="bar"
              title="Quantum State Distribution"
              onExport={() => storageUtils.exportData()}
            />
          </motion.div>
        )}

        {/* Quantum Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <div className="card-glow">
            <h3 className="text-2xl font-semibold text-white mb-6">About Quantum Entanglement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-neon-blue mb-3">Bell State</h4>
                <p className="text-gray-300 mb-4">
                  The circuit creates a Bell state (|00⟩ + |11⟩)/√2, demonstrating 
                  quantum entanglement where measuring one qubit instantly determines 
                  the state of the other.
                </p>
                <div className="bg-black/30 p-4 rounded-lg border border-gray-600">
                  <code className="text-neon-purple text-sm">
                    |ψ⟩ = (|00⟩ + |11⟩)/√2
                  </code>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-neon-purple mb-3">Applications</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Quantum teleportation</li>
                  <li>• Quantum cryptography</li>
                  <li>• Quantum computing algorithms</li>
                  <li>• Quantum error correction</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quantum;
