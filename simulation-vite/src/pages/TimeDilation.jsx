import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calculator, Ruler, Loader } from 'lucide-react';
import { physicsApi, dataUtils, storageUtils } from '../api/physicsApi';
import SimulationCard from '../components/SimulationCard';
import DataPanel from '../components/DataPanel';
import ThreeScene from '../components/ThreeScene';
import LoaderComponent from '../components/Loader';

const TimeDilation = () => {
  const [mass, setMass] = useState(10);
  const [distance, setDistance] = useState(100);
  const [results, setResults] = useState({
    timeDilation: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await physicsApi.calculateTimeDilation(mass, distance);
      if (result.success) {
        setResults({ timeDilation: result.data });
        storageUtils.saveSimulation('timeDilation', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSchwarzschildRadius = (mass) => {
    // Simplified calculation: Rs = 2GM/c² ≈ 2.95 * mass (in km)
    return 2.95 * mass;
  };

  const schwarzschildRadius = calculateSchwarzschildRadius(mass);
  const isInsideEventHorizon = distance <= schwarzschildRadius;

  const chartData = results.timeDilation ? [
    { name: 'Time Dilation Factor', value: results.timeDilation.time_dilation_factor },
    { name: 'Distance Ratio', value: distance / schwarzschildRadius }
  ] : [];

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
            Time <span className="text-gradient">Dilation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the relativistic effects of time dilation near massive objects. 
            See how gravity warps spacetime and affects the flow of time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-neon-pink" />
                <h2 className="text-2xl font-semibold text-white">Parameters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Black Hole Mass (Solar Masses)
                  </label>
                  <input
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 transition-all"
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
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 transition-all"
                    placeholder="Enter distance in kilometers"
                    min="1"
                    step="1"
                  />
                </div>

                {/* Schwarzschild Radius Display */}
                <div className="p-4 bg-black/30 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-2">Schwarzschild Radius</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Event Horizon:</span>
                    <span className="text-neon-blue font-mono">
                      {schwarzschildRadius.toFixed(2)} km
                    </span>
                  </div>
                  {isInsideEventHorizon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm"
                    >
                      ⚠️ Distance is inside the event horizon!
                    </motion.div>
                  )}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalculate}
                  disabled={loading || isInsideEventHorizon}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <LoaderComponent size="small" message="Calculating..." />
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      <span>Calculate Time Dilation</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Time Dilation Info */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Time Dilation Formula</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="bg-black/30 p-4 rounded-lg border border-gray-600">
                  <code className="text-neon-pink">
                    t = t₀ / √(1 - 2GM/rc²)
                  </code>
                </div>
                <div className="space-y-2">
                  <p>• <span className="text-neon-blue">t</span> = Time at observer location</p>
                  <p>• <span className="text-neon-purple">t₀</span> = Time at infinity</p>
                  <p>• <span className="text-neon-pink">G</span> = Gravitational constant</p>
                  <p>• <span className="text-neon-green">M</span> = Black hole mass</p>
                  <p>• <span className="text-neon-blue">r</span> = Distance from center</p>
                  <p>• <span className="text-neon-purple">c</span> = Speed of light</p>
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
              <ThreeScene 
                type="spacetime" 
                distortion={results.timeDilation?.time_dilation_factor || 1}
              />
            </div>

            {/* Results */}
            {results.timeDilation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <SimulationCard
                  type="time"
                  data={results.timeDilation}
                  title="Time Dilation Factor"
                  description={`Time flows ${results.timeDilation.time_dilation_factor.toFixed(4)}x slower`}
                  color="pink"
                />

                {/* Time Comparison */}
                <div className="card-glow">
                  <h3 className="text-lg font-semibold text-white mb-4">Time Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">1 second at infinity:</span>
                      <span className="text-neon-blue font-mono">
                        {(1 / results.timeDilation.time_dilation_factor).toFixed(6)}s at observer
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">1 hour at infinity:</span>
                      <span className="text-neon-purple font-mono">
                        {(3600 / results.timeDilation.time_dilation_factor).toFixed(2)}s at observer
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">1 day at infinity:</span>
                      <span className="text-neon-pink font-mono">
                        {(86400 / results.timeDilation.time_dilation_factor).toFixed(0)}s at observer
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Spacetime Curvature Visualization */}
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Spacetime Curvature</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  The massive object warps spacetime, creating a "well" that affects 
                  both space and time. The closer you get, the more pronounced the effects.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-black/30 rounded-lg border border-gray-600">
                    <div className="text-neon-blue font-semibold">Distance</div>
                    <div className="text-xs">{distance} km</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg border border-gray-600">
                    <div className="text-neon-purple font-semibold">Curvature</div>
                    <div className="text-xs">
                      {results.timeDilation ? 
                        `${(1 - 1/results.timeDilation.time_dilation_factor).toFixed(4)}` : 
                        '0.0000'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              title="Time Dilation Analysis"
              onExport={() => storageUtils.exportData()}
            />
          </motion.div>
        )}

        {/* Relativity Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <div className="card-glow">
            <h3 className="text-2xl font-semibold text-white mb-6">Einstein's General Relativity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-neon-pink mb-3">Time Dilation Effects</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• GPS satellites need time correction</li>
                  <li>• Clocks run slower near massive objects</li>
                  <li>• Gravitational redshift of light</li>
                  <li>• Frame-dragging effects</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-neon-purple mb-3">Real-World Examples</h4>
                <ul className="text-gray-300 space-y-2">
                  <li>• Earth: ~7 microseconds/year difference</li>
                  <li>• GPS satellites: 38 microseconds/day</li>
                  <li>• Near black holes: Extreme effects</li>
                  <li>• Interstellar travel implications</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeDilation;
