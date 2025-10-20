import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Thermometer, Ruler, Loader } from 'lucide-react';
import { physicsApi, dataUtils, storageUtils } from '../api/physicsApi';
import SimulationCard from '../components/SimulationCard';
import DataPanel from '../components/DataPanel';
import ThreeScene from '../components/ThreeScene';
import LoaderComponent from '../components/Loader';

const BlackHole = () => {
  const [mass, setMass] = useState(10);
  const [distance, setDistance] = useState(100);
  const [results, setResults] = useState({
    radius: null,
    temperature: null,
    timeDilation: null
  });
  const [loading, setLoading] = useState({
    radius: false,
    temperature: false,
    timeDilation: false
  });
  const [error, setError] = useState('');

  const handleCalculate = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError('');

    try {
      let result;
      switch (type) {
        case 'radius':
          result = await physicsApi.calculateRadius(mass);
          if (result.success) {
            setResults(prev => ({ ...prev, radius: result.data }));
            storageUtils.saveSimulation('radius', result.data);
          } else {
            setError(result.error);
          }
          break;
        case 'temperature':
          result = await physicsApi.calculateHawkingRadiation(mass);
          if (result.success) {
            setResults(prev => ({ ...prev, temperature: result.data }));
            storageUtils.saveSimulation('temperature', result.data);
          } else {
            setError(result.error);
          }
          break;
        case 'timeDilation':
          result = await physicsApi.calculateTimeDilation(mass, distance);
          if (result.success) {
            setResults(prev => ({ ...prev, timeDilation: result.data }));
            storageUtils.saveSimulation('timeDilation', result.data);
          } else {
            setError(result.error);
          }
          break;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleCalculateAll = async () => {
    await Promise.all([
      handleCalculate('radius'),
      handleCalculate('temperature'),
      handleCalculate('timeDilation')
    ]);
  };

  const chartData = results.radius ? [
    { name: 'Schwarzschild Radius', value: results.radius.radius },
    { name: 'Input Mass', value: mass }
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
            Black Hole <span className="text-gradient">Physics</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Calculate Schwarzschild radius, Hawking radiation temperature, 
            and time dilation effects for any black hole mass.
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
                <Calculator className="w-6 h-6 text-neon-blue" />
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
                    onClick={handleCalculateAll}
                    disabled={loading.radius || loading.temperature || loading.timeDilation}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading.radius || loading.temperature || loading.timeDilation ? (
                      <LoaderComponent size="small" message="Calculating..." />
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        <span>Calculate All</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Individual Calculation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCalculate('radius')}
                disabled={loading.radius}
                className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.radius ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Ruler className="w-4 h-4" />
                    <span>Radius</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCalculate('temperature')}
                disabled={loading.temperature}
                className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading.temperature ? (
                  <LoaderComponent size="small" />
                ) : (
                  <>
                    <Thermometer className="w-4 h-4" />
                    <span>Temperature</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCalculate('timeDilation')}
                disabled={loading.timeDilation}
                className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
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

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* 3D Visualization */}
            <div className="card-glow h-64">
              <ThreeScene 
                type="blackhole" 
                mass={mass} 
                radius={results.radius?.radius ? results.radius.radius / 1000 : 1}
              />
            </div>

            {/* Results Cards */}
            <div className="space-y-4">
              {results.radius && (
                <SimulationCard
                  type="radius"
                  data={results.radius}
                  title="Schwarzschild Radius"
                  description={`Event horizon for ${mass} solar mass black hole`}
                  color="blue"
                />
              )}

              {results.temperature && (
                <SimulationCard
                  type="temperature"
                  data={results.temperature}
                  title="Hawking Radiation"
                  description={`Temperature of quantum radiation`}
                  color="purple"
                />
              )}

              {results.timeDilation && (
                <SimulationCard
                  type="time"
                  data={results.timeDilation}
                  title="Time Dilation"
                  description={`Time dilation factor at ${distance} km`}
                  color="pink"
                />
              )}
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
              title="Black Hole Properties"
              onExport={() => storageUtils.exportData()}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlackHole;
