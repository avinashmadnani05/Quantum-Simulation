import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Atom, Zap, Clock, Ruler, Code, BookOpen, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Atom,
      title: 'Black Hole Physics',
      description: 'Calculate Schwarzschild radius and Hawking radiation using general relativity',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Quantum Computing',
      description: 'Simulate quantum circuits and entanglement with Qiskit',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Relativistic Effects',
      description: 'Explore time dilation and spacetime curvature',
      color: 'pink'
    },
    {
      icon: Ruler,
      title: 'Precise Calculations',
      description: 'Real-time physics calculations with high accuracy',
      color: 'green'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Modern UI framework' },
    { name: 'Three.js', description: '3D graphics and visualization' },
    { name: 'Framer Motion', description: 'Smooth animations and transitions' },
    { name: 'TailwindCSS', description: 'Utility-first styling' },
    { name: 'FastAPI', description: 'High-performance Python backend' },
    { name: 'Qiskit', description: 'Quantum computing framework' },
    { name: 'Astropy', description: 'Astronomical calculations' },
    { name: 'NumPy', description: 'Scientific computing' }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="text-gradient">Quantum Lab</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            An interactive physics simulation laboratory that brings together 
            quantum mechanics, general relativity, and modern web technologies 
            to create an immersive learning experience.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To make advanced physics concepts accessible through interactive simulations, 
              helping students, researchers, and enthusiasts explore the fundamental forces 
              that shape our universe.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key <span className="text-gradient">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card-glow group"
                >
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
                      feature.color === 'blue' ? 'from-neon-blue to-blue-600' :
                      feature.color === 'purple' ? 'from-neon-purple to-purple-600' :
                      feature.color === 'pink' ? 'from-neon-pink to-pink-600' :
                      'from-neon-green to-green-600'
                    } flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technology <span className="text-gradient">Stack</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center p-4"
              >
                <h3 className="font-semibold text-white mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Physics Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Physics <span className="text-gradient">Concepts</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-glow">
              <h3 className="text-xl font-semibold text-neon-blue mb-4">General Relativity</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Schwarzschild radius calculation</li>
                <li>• Time dilation effects</li>
                <li>• Spacetime curvature</li>
                <li>• Event horizon physics</li>
              </ul>
            </div>
            <div className="card-glow">
              <h3 className="text-xl font-semibold text-neon-purple mb-4">Quantum Mechanics</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Quantum entanglement</li>
                <li>• Superposition states</li>
                <li>• Quantum circuit simulation</li>
                <li>• Bell state generation</li>
              </ul>
            </div>
            <div className="card-glow">
              <h3 className="text-xl font-semibold text-neon-pink mb-4">Black Hole Physics</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Hawking radiation</li>
                <li>• Accretion disk dynamics</li>
                <li>• Gravitational lensing</li>
                <li>• Information paradox</li>
              </ul>
            </div>
            <div className="card-glow">
              <h3 className="text-xl font-semibold text-neon-green mb-4">Computational Physics</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Numerical simulations</li>
                <li>• Monte Carlo methods</li>
                <li>• Data visualization</li>
                <li>• Real-time calculations</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Educational Value */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="card-glow">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Educational <span className="text-gradient">Value</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Interactive Learning</h3>
                <p className="text-gray-300">
                  Hands-on exploration of complex physics concepts through interactive simulations.
                </p>
              </div>
              <div className="text-center">
                <Code className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Real Calculations</h3>
                <p className="text-gray-300">
                  Actual physics calculations using industry-standard libraries and methods.
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-neon-pink mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Accessible Science</h3>
                <p className="text-gray-300">
                  Making advanced physics concepts accessible to learners of all levels.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links and Credits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="card-glow">
            <h2 className="text-2xl font-bold text-white mb-6">Get Involved</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span>View Source</span>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://qiskit.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Qiskit Documentation</span>
              </motion.a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-600">
              <p className="text-gray-400">
                Built with ❤️ for the physics community. 
                Powered by React, Three.js, FastAPI, and Qiskit.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
