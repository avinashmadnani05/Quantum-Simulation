import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Download, Trash2, RefreshCw, Calendar, TrendingUp, Atom, Zap, Clock, Calculator } from 'lucide-react';
import { storageUtils } from '../api/physicsApi';
import DataPanel from '../components/DataPanel';
import SimulationCard from '../components/SimulationCard';

const Dashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = () => {
    const data = storageUtils.getSimulations();
    setSimulations(data);
  };

  const handleExport = () => {
    storageUtils.exportData();
  };

  const handleClear = () => {
    storageUtils.clearSimulations();
    setSimulations([]);
  };

  const filteredSimulations = simulations.filter(sim => 
    filter === 'all' || sim.type === filter
  ).sort((a, b) => {
    if (sortBy === 'timestamp') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return 0;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'radius': return Atom;
      case 'temperature': return Zap;
      case 'timeDilation': return Clock;
      case 'quantum': return Zap;
      default: return BarChart3;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'radius': return 'blue';
      case 'temperature': return 'purple';
      case 'timeDilation': return 'pink';
      case 'quantum': return 'purple';
      default: return 'blue';
    }
  };

  const getTypeTitle = (type) => {
    switch (type) {
      case 'radius': return 'Schwarzschild Radius';
      case 'temperature': return 'Hawking Radiation';
      case 'timeDilation': return 'Time Dilation';
      case 'quantum': return 'Quantum Simulation';
      default: return 'Simulation';
    }
  };

  const aggregateData = () => {
    const aggregated = {
      radius: simulations.filter(s => s.type === 'radius').length,
      temperature: simulations.filter(s => s.type === 'temperature').length,
      timeDilation: simulations.filter(s => s.type === 'timeDilation').length,
      quantum: simulations.filter(s => s.type === 'quantum').length
    };
    return Object.entries(aggregated).map(([type, count]) => ({
      name: getTypeTitle(type),
      value: count
    }));
  };

  const recentSimulations = simulations.slice(0, 5);

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
            Simulation <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            View, analyze, and manage all your physics simulations in one place.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/legacy">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Legacy Simulation</span>
              </motion.button>
            </Link>
            <Link to="/blackhole">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
              >
                <Atom className="w-4 h-4" />
                <span>New Simulation</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-300">Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                >
                  <option value="all">All Types</option>
                  <option value="radius">Black Hole Radius</option>
                  <option value="temperature">Hawking Radiation</option>
                  <option value="timeDilation">Time Dilation</option>
                  <option value="quantum">Quantum Simulation</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-300">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                >
                  <option value="timestamp">Most Recent</option>
                  <option value="type">By Type</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadSimulations}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="btn-secondary flex items-center space-x-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="card-glow">
              <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Simulations:</span>
                  <span className="text-neon-blue font-semibold">{simulations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">This Week:</span>
                  <span className="text-neon-purple font-semibold">
                    {simulations.filter(s => 
                      new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Most Common:</span>
                  <span className="text-neon-pink font-semibold">
                    {getTypeTitle(
                      Object.entries(
                        simulations.reduce((acc, sim) => {
                          acc[sim.type] = (acc[sim.type] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
                    )}
                  </span>
                </div>
              </div>
            </div>

            <DataPanel
              data={aggregateData()}
              type="pie"
              title="Simulation Types"
              onRefresh={loadSimulations}
            />
          </motion.div>

          {/* Simulation List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {filter === 'all' ? 'All Simulations' : getTypeTitle(filter)}
              </h2>
              <span className="text-gray-400">
                {filteredSimulations.length} result{filteredSimulations.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredSimulations.length > 0 ? (
              <div className="space-y-4">
                {filteredSimulations.map((simulation, index) => {
                  const Icon = getTypeIcon(simulation.type);
                  const color = getTypeColor(simulation.type);
                  
                  return (
                    <motion.div
                      key={simulation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SimulationCard
                        type={simulation.type}
                        data={simulation.data}
                        title={getTypeTitle(simulation.type)}
                        description={`Run on ${new Date(simulation.timestamp).toLocaleDateString()}`}
                        icon={Icon}
                        color={color}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Simulations Found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? 'Start running simulations to see them here.'
                    : `No ${getTypeTitle(filter).toLowerCase()} simulations found.`
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        {recentSimulations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="card-glow">
              <h3 className="text-2xl font-semibold text-white mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {recentSimulations.map((simulation) => {
                  const Icon = getTypeIcon(simulation.type);
                  return (
                    <div
                      key={simulation.id}
                      className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-gray-600 hover:border-neon-blue/30 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        getTypeColor(simulation.type) === 'blue' ? 'from-neon-blue to-blue-600' :
                        getTypeColor(simulation.type) === 'purple' ? 'from-neon-purple to-purple-600' :
                        getTypeColor(simulation.type) === 'pink' ? 'from-neon-pink to-pink-600' :
                        'from-neon-green to-green-600'
                      }`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{getTypeTitle(simulation.type)}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(simulation.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(simulation.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
