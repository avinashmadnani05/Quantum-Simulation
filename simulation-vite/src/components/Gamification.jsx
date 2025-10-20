import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Crown, Rocket, Atom } from 'lucide-react';

const Gamification = ({ simulationData, onAchievementUnlock }) => {
  const [achievements, setAchievements] = useState([]);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [recentUnlocks, setRecentUnlocks] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Achievement definitions
  const achievementDefinitions = [
    {
      id: 'first_simulation',
      name: 'First Steps',
      description: 'Complete your first simulation',
      icon: '🚀',
      condition: (data) => Object.keys(data).length > 0,
      points: 10,
      rarity: 'common'
    },
    {
      id: 'super_massive',
      name: 'Super Massive',
      description: 'Create a black hole with radius > 1000 km',
      icon: '🌟',
      condition: (data) => data.radius?.radius > 1000,
      points: 50,
      rarity: 'rare'
    },
    {
      id: 'ultra_cold',
      name: 'Ultra Cold',
      description: 'Achieve Hawking temperature < 1e-10 K',
      icon: '❄️',
      condition: (data) => data.temperature?.temperature < 1e-10,
      points: 75,
      rarity: 'epic'
    },
    {
      id: 'time_master',
      name: 'Time Master',
      description: 'Achieve time dilation factor > 10',
      icon: '⏰',
      condition: (data) => data.timeDilation?.time_dilation_factor > 10,
      points: 100,
      rarity: 'legendary'
    },
    {
      id: 'quantum_entangled',
      name: 'Quantum Entangled',
      description: 'Achieve perfect quantum entanglement',
      icon: '⚛️',
      condition: (data) => {
        const counts = data.quantum?.counts || {};
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        return total > 0 && Math.abs((counts['00'] || 0) - (counts['11'] || 0)) < 10;
      },
      points: 150,
      rarity: 'legendary'
    },
    {
      id: 'physics_rebel',
      name: 'Physics Rebel',
      description: 'Modify physics constants significantly',
      icon: '🔬',
      condition: (data) => data.physicsConstants?.G > 6.674e-10,
      points: 200,
      rarity: 'mythic'
    },
    {
      id: 'multi_blackhole',
      name: 'Cosmic Architect',
      description: 'Simulate multiple black holes',
      icon: '🌌',
      condition: (data) => data.multiBlackHole?.count > 1,
      points: 300,
      rarity: 'mythic'
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete 10 simulations in under 5 minutes',
      icon: '⚡',
      condition: (data) => data.simulationCount >= 10 && data.totalTime < 300,
      points: 250,
      rarity: 'epic'
    }
  ];

  // Check for new achievements
  useEffect(() => {
    if (!simulationData || Object.keys(simulationData).length === 0) return;

    const newAchievements = [];
    
    achievementDefinitions.forEach(achievement => {
      const isUnlocked = achievements.some(a => a.id === achievement.id);
      if (!isUnlocked && achievement.condition(simulationData)) {
        const newAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
          id: achievement.id
        };
        newAchievements.push(newAchievement);
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setRecentUnlocks(prev => [...prev, ...newAchievements]);
      setShowCelebration(true);
      
      // Calculate experience points
      const totalPoints = newAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
      setExperience(prev => {
        const newExp = prev + totalPoints;
        const newLevel = Math.floor(newExp / 100) + 1;
        setLevel(newLevel);
        return newExp;
      });

      // Notify parent component
      onAchievementUnlock?.(newAchievements);
    }
  }, [simulationData, achievements]);

  // Clear recent unlocks after animation
  useEffect(() => {
    if (recentUnlocks.length > 0) {
      const timer = setTimeout(() => {
        setRecentUnlocks([]);
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlocks]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      case 'mythic': return '#ef4444';
      default: return '#ffffff';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Zap className="w-4 h-4" />;
      case 'epic': return <Target className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'mythic': return <Rocket className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getLevelTitle = (level) => {
    if (level < 5) return 'Novice Physicist';
    if (level < 10) return 'Quantum Explorer';
    if (level < 20) return 'Relativity Master';
    if (level < 30) return 'Cosmic Architect';
    return 'Universal Genius';
  };

  return (
    <div className="space-y-6">
      {/* Level and Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glow"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Progress</h3>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 font-bold">Level {level}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>{getLevelTitle(level)}</span>
              <span>{experience} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(experience % 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Next level: {100 - (experience % 100)} XP</span>
            <span>Total achievements: {achievements.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Unlocks */}
      <AnimatePresence>
        {recentUnlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="card-glow border-2 border-yellow-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-500">Achievement Unlocked!</h3>
            </div>
            
            <div className="space-y-3">
              {recentUnlocks.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30"
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRarityIcon(achievement.rarity)}
                    <span className="text-yellow-500 font-bold">+{achievement.points} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glow"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievementDefinitions.map((achievement) => {
            const isUnlocked = achievements.some(a => a.id === achievement.id);
            const unlockedAchievement = achievements.find(a => a.id === achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/50'
                    : 'bg-black/30 border-gray-600 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    {isUnlocked && unlockedAchievement && (
                      <p className="text-xs text-green-400 mt-1">
                        Unlocked: {new Date(unlockedAchievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div style={{ color: getRarityColor(achievement.rarity) }}>
                      {getRarityIcon(achievement.rarity)}
                    </div>
                    <span className={`text-sm font-bold ${
                      isUnlocked ? 'text-yellow-500' : 'text-gray-500'
                    }`}>
                      {achievement.points} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glow"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-blue">{level}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-purple">{experience}</div>
            <div className="text-sm text-gray-400">Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-pink">{achievements.length}</div>
            <div className="text-sm text-gray-400">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">
              {achievements.filter(a => a.rarity === 'legendary' || a.rarity === 'mythic').length}
            </div>
            <div className="text-sm text-gray-400">Rare</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Gamification;
