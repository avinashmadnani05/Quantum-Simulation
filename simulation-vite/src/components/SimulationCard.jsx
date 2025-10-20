import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Thermometer, Ruler, Zap } from 'lucide-react';

const SimulationCard = ({ 
  type, 
  data, 
  title, 
  description, 
  icon: Icon, 
  color = 'blue',
  onAction,
  actionLabel = 'View Details'
}) => {
  const colorClasses = {
    blue: 'from-neon-blue to-blue-600',
    purple: 'from-neon-purple to-purple-600',
    pink: 'from-neon-pink to-pink-600',
    green: 'from-neon-green to-green-600'
  };

  const getIcon = (type) => {
    switch (type) {
      case 'radius': return Ruler;
      case 'temperature': return Thermometer;
      case 'time': return Clock;
      case 'quantum': return Zap;
      default: return TrendingUp;
    }
  };

  const IconComponent = Icon || getIcon(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card-glow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </div>

      {data && (
        <div className="space-y-3">
          {type === 'radius' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Schwarzschild Radius:</span>
              <span className="text-neon-blue font-mono">
                {data.radius ? `${data.radius.toFixed(2)} km` : 'N/A'}
              </span>
            </div>
          )}
          
          {type === 'temperature' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Hawking Temperature:</span>
              <span className="text-neon-purple font-mono">
                {data.temperature ? `${data.temperature.toExponential(2)} K` : 'N/A'}
              </span>
            </div>
          )}
          
          {type === 'time' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Time Dilation Factor:</span>
              <span className="text-neon-pink font-mono">
                {data.timeDilationFactor ? data.timeDilationFactor.toFixed(4) : 'N/A'}
              </span>
            </div>
          )}
          
          {type === 'quantum' && data.counts && (
            <div className="space-y-2">
              <span className="text-gray-300 text-sm">Quantum States:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.counts).map(([state, count]) => (
                  <span
                    key={state}
                    className="px-2 py-1 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded text-xs font-mono"
                  >
                    {state}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`w-full mt-4 py-2 px-4 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white font-medium transition-all duration-300 hover:shadow-lg`}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default SimulationCard;
