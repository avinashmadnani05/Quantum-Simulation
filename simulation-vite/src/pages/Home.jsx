import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Zap, Clock, BarChart3, Play } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';

const Home = () => {
  const features = [
    {
      icon: Atom,
      title: 'Black Hole Physics',
      description: 'Calculate Schwarzschild radius and Hawking radiation',
      link: '/blackhole',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Quantum Simulation',
      description: 'Explore quantum circuits and entanglement',
      link: '/quantum',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Time Dilation',
      description: 'Experience relativistic time effects',
      link: '/time-dilation',
      color: 'pink'
    },
    {
      icon: BarChart3,
      title: 'Data Dashboard',
      description: 'View and analyze simulation results',
      link: '/dashboard',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene type="blackhole" mass={10} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-6xl md:text-8xl font-bold"
              >
                <span className="text-gradient">Quantum</span>
                <br />
                <span className="text-white">Black Hole</span>
                <br />
                <span className="text-gradient">Simulation Lab</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Explore the mysteries of quantum physics and black hole phenomena 
                through interactive simulations and real-time calculations.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Link to="/blackhole">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
                  >
                    <Play className="w-6 h-6" />
                    <span>Start Simulation</span>
                  </motion.button>
                </Link>
                
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Dashboard</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore the <span className="text-gradient">Universe</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Dive deep into the fundamental forces that shape our universe 
                through cutting-edge physics simulations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <Link to={feature.link}>
                      <div className="card-glow h-full group-hover:scale-105 transition-all duration-300">
                        <div className="p-6">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
                            feature.color === 'blue' ? 'from-neon-blue to-blue-600' :
                            feature.color === 'purple' ? 'from-neon-purple to-purple-600' :
                            feature.color === 'pink' ? 'from-neon-pink to-pink-600' :
                            'from-neon-green to-green-600'
                          } flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-xl font-semibold text-white mb-3">
                            {feature.title}
                          </h3>
                          
                          <p className="text-gray-300 mb-4">
                            {feature.description}
                          </p>
                          
                          <div className="flex items-center text-neon-blue group-hover:text-neon-purple transition-colors duration-300">
                            <span className="text-sm font-medium">Explore</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="card-glow p-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="text-gradient">Explore</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of physics enthusiasts and researchers 
                exploring the frontiers of quantum mechanics and general relativity.
              </p>
              <Link to="/blackhole">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-xl px-12 py-4"
                >
                  Begin Your Journey
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
