import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, RotateCcw, Save, Download } from 'lucide-react';

const PhysicsConstants = ({ onConstantsChange, initialConstants = {} }) => {
  const [constants, setConstants] = useState({
    G: 6.674e-11,           // Gravitational constant
    c: 299792458,           // Speed of light
    h: 6.626e-34,           // Planck constant
    k_B: 1.381e-23,         // Boltzmann constant
    M_sun: 1.989e30,        // Solar mass
    ...initialConstants
  });

  const [customMode, setCustomMode] = useState(false);
  const [presets, setPresets] = useState([
    {
      name: 'Standard Physics',
      constants: {
        G: 6.674e-11,
        c: 299792458,
        h: 6.626e-34,
        k_B: 1.381e-23,
        M_sun: 1.989e30
      }
    },
    {
      name: 'High Gravity',
      constants: {
        G: 6.674e-10,  // 10x stronger gravity
        c: 299792458,
        h: 6.626e-34,
        k_B: 1.381e-23,
        M_sun: 1.989e30
      }
    },
    {
      name: 'Slow Light',
      constants: {
        G: 6.674e-11,
        c: 29979245.8,  // 10x slower light
        h: 6.626e-34,
        k_B: 1.381e-23,
        M_sun: 1.989e30
      }
    },
    {
      name: 'Quantum World',
      constants: {
        G: 6.674e-11,
        c: 299792458,
        h: 6.626e-33,  // 10x larger Planck constant
        k_B: 1.381e-23,
        M_sun: 1.989e30
      }
    }
  ]);

  const [savedConfigs, setSavedConfigs] = useState([]);

  useEffect(() => {
    onConstantsChange(constants);
  }, [constants, onConstantsChange]);

  const handleConstantChange = (key, value) => {
    setConstants(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handlePresetSelect = (preset) => {
    setConstants(preset.constants);
    setCustomMode(false);
  };

  const handleReset = () => {
    setConstants(presets[0].constants);
    setCustomMode(false);
  };

  const handleSaveConfig = () => {
    const configName = prompt('Enter configuration name:');
    if (configName) {
      const newConfig = {
        id: Date.now(),
        name: configName,
        constants: { ...constants },
        timestamp: new Date().toISOString()
      };
      setSavedConfigs(prev => [...prev, newConfig]);
      localStorage.setItem('physicsConfigs', JSON.stringify([...savedConfigs, newConfig]));
    }
  };

  const handleLoadConfig = (config) => {
    setConstants(config.constants);
    setCustomMode(true);
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(constants, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `physics-constants-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatScientific = (value) => {
    if (value === 0) return '0';
    if (Math.abs(value) < 0.001 || Math.abs(value) > 1000000) {
      return value.toExponential(3);
    }
    return value.toFixed(6);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-neon-blue" />
          <h3 className="text-xl font-semibold text-white">Physics Constants</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCustomMode(!customMode)}
            className={`btn-secondary ${customMode ? 'bg-neon-blue/20' : ''}`}
          >
            {customMode ? 'Preset Mode' : 'Custom Mode'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>

      {!customMode ? (
        // Preset Mode
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-3">Preset Configurations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePresetSelect(preset)}
                className="card p-4 text-left hover:border-neon-blue/50 transition-colors"
              >
                <h5 className="font-semibold text-white mb-2">{preset.name}</h5>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>G: {formatScientific(preset.constants.G)}</p>
                  <p>c: {formatScientific(preset.constants.c)}</p>
                  <p>h: {formatScientific(preset.constants.h)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        // Custom Mode
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(constants).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {key === 'G' && 'Gravitational Constant (G)'}
                  {key === 'c' && 'Speed of Light (c)'}
                  {key === 'h' && 'Planck Constant (h)'}
                  {key === 'k_B' && 'Boltzmann Constant (k_B)'}
                  {key === 'M_sun' && 'Solar Mass (M_sun)'}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleConstantChange(key, e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                  step="any"
                />
                <p className="text-xs text-gray-500">
                  Current: {formatScientific(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveConfig}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Config</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportConfig}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Configurations */}
      {savedConfigs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-3">Saved Configurations</h4>
          <div className="space-y-2">
            {savedConfigs.map((config) => (
              <motion.div
                key={config.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-600 hover:border-neon-blue/50 transition-colors"
              >
                <div>
                  <h5 className="font-medium text-white">{config.name}</h5>
                  <p className="text-sm text-gray-400">
                    {new Date(config.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLoadConfig(config)}
                  className="btn-secondary text-sm"
                >
                  Load
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Preview */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <h4 className="text-lg font-semibold text-white mb-3">Impact Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-black/30 rounded-lg">
            <h5 className="font-medium text-neon-blue mb-1">Schwarzschild Radius</h5>
            <p className="text-gray-300">
              {formatScientific(2 * constants.G * constants.M_sun / (constants.c * constants.c) / 1000)} km
            </p>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <h5 className="font-medium text-neon-purple mb-1">Hawking Temperature</h5>
            <p className="text-gray-300">
              {formatScientific(constants.h * constants.c * constants.c * constants.c / (8 * Math.PI * constants.G * constants.M_sun * constants.k_B))} K
            </p>
          </div>
          <div className="p-3 bg-black/30 rounded-lg">
            <h5 className="font-medium text-neon-pink mb-1">Time Dilation</h5>
            <p className="text-gray-300">
              {formatScientific(1 / Math.sqrt(1 - 2 * constants.G * constants.M_sun / (constants.c * constants.c * 10000)))} at 10km
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhysicsConstants;
