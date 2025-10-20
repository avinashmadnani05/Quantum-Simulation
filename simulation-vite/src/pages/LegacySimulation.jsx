import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Thermometer, Ruler, Zap, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { physicsApi } from '../api/physicsApi';
import LoaderComponent from '../components/Loader';

const LegacySimulation = () => {
  const [mass, setMass] = useState(10);
  const [distance, setDistance] = useState(10);
  const [radius, setRadius] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [quantumPlot, setQuantumPlot] = useState(null);
  const [quantumCounts, setQuantumCounts] = useState(null);
  const [timeDilation, setTimeDilation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({
    radius: false,
    temperature: false,
    quantum: false,
    timeDilation: false
  });

  const fetchData = async (endpoint, payload, setData, loadingKey) => {
    try {
      setError('');
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      let result;
      switch (endpoint) {
        case 'calculate_radius':
          result = await physicsApi.calculateRadius(payload.mass);
          break;
        case 'hawking_radiation':
          result = await physicsApi.calculateHawkingRadiation(payload.mass);
          break;
        case 'simulate_quantum':
          result = await physicsApi.simulateQuantum();
          break;
        case 'time_dilation':
          result = await physicsApi.calculateTimeDilation(payload.mass, payload.distance);
          break;
        default:
          throw new Error('Unknown endpoint');
      }

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleCalculateRadius = () => {
    fetchData('calculate_radius', { mass }, (data) => setRadius(data.radius), 'radius');
  };

  const handleCalculateTemperature = () => {
    fetchData('hawking_radiation', { mass }, (data) => setTemperature(data.temperature), 'temperature');
  };

  const handleSimulateQuantum = () => {
    fetchData('simulate_quantum', {}, (data) => {
      setQuantumPlot(data.plot);
      setQuantumCounts(data.counts);
    }, 'quantum');
  };

  const handleCalculateTimeDilation = () => {
    fetchData('time_dilation', { mass, distance }, (data) => setTimeDilation(data.time_dilation_factor), 'timeDilation');
  };

  const handleReset = () => {
    setRadius(null);
    setTemperature(null);
    setQuantumPlot(null);
    setQuantumCounts(null);
    setTimeDilation(null);
    setError('');
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </motion.button>
            </Link>
            <h1 className="text-4xl font-bold text-white">
              Legacy <span className="text-gradient">Simulation</span>
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl">
            Classic simulation interface - the original black hole physics calculator 
            with all calculations in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-glow">
              <h2 className="text-2xl font-semibold text-white mb-6">Black Hole Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Black Hole Mass (Solar Masses)
                  </label>
                  <input
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                    placeholder="Enter mass in solar masses"
                    min="0.1"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Observer Distance (km)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                    placeholder="Enter distance in kilometers"
                    min="1"
                    step="1"
                  />
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
                    onClick={handleReset}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalculateRadius}
                disabled={loading.radius}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.radius ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Ruler className="w-4 h-4" />
                    <span>Calculate Radius</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalculateTemperature}
                disabled={loading.temperature}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.temperature ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Thermometer className="w-4 h-4" />
                    <span>Hawking Radiation</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulateQuantum}
                disabled={loading.quantum}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.quantum ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Simulate Quantum</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalculateTimeDilation}
                disabled={loading.timeDilation}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.timeDilation ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Time Dilation</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Results Display */}
            <div className="card-glow">
              <h3 className="text-xl font-semibold text-white mb-4">Simulation Results</h3>
              
              <div className="space-y-4">
                {radius && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-neon-blue/10 to-blue-600/10 rounded-lg border border-neon-blue/30"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Ruler className="w-5 h-5 text-neon-blue" />
                      <span className="font-semibold text-white">Schwarzschild Radius</span>
                    </div>
                    <p className="text-2xl font-bold text-neon-blue">{radius.toFixed(2)} km</p>
                  </motion.div>
                )}

                {temperature && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-neon-purple/10 to-purple-600/10 rounded-lg border border-neon-purple/30"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="w-5 h-5 text-neon-purple" />
                      <span className="font-semibold text-white">Hawking Temperature</span>
                    </div>
                    <p className="text-2xl font-bold text-neon-purple">{temperature.toExponential(2)} K</p>
                  </motion.div>
                )}

                {timeDilation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-neon-pink/10 to-pink-600/10 rounded-lg border border-neon-pink/30"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-5 h-5 text-neon-pink" />
                      <span className="font-semibold text-white">Time Dilation Factor</span>
                    </div>
                    <p className="text-2xl font-bold text-neon-pink">{timeDilation.toFixed(4)}</p>
                  </motion.div>
                )}

                {quantumPlot && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-neon-green/10 to-green-600/10 rounded-lg border border-neon-green/30"
                  >
                    <h4 className="text-lg font-semibold text-white mb-3">Quantum Simulation Results</h4>
                    <div className="text-center">
                      <img
                        src={`data:image/png;base64,${quantumPlot}`}
                        alt="Quantum Plot"
                        className="max-w-full h-auto rounded-lg border border-gray-600"
                      />
                    </div>
                    {quantumCounts && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Quantum States:</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(quantumCounts).map(([state, count]) => (
                            <span
                              key={state}
                              className="px-2 py-1 bg-black/30 rounded text-xs font-mono"
                            >
                              {state}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {!radius && !temperature && !timeDilation && !quantumPlot && (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Results Yet</h3>
                    <p className="text-gray-500">
                      Run some calculations to see results here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <div className="card-glow">
            <h3 className="text-2xl font-semibold text-white mb-6">About This Interface</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-neon-blue mb-3">Legacy Features</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• All calculations in one interface</li>
                  <li>• Simple input/output format</li>
                  <li>• Classic simulation experience</li>
                  <li>• Direct API integration</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-neon-purple mb-3">Modern Features</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Optimized backend performance</li>
                  <li>• Cached calculations</li>
                  <li>• Error handling improvements</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegacySimulation;
