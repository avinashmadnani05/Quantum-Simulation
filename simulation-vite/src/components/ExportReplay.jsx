import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Play, Pause, RotateCcw, Save, Upload, Share2 } from 'lucide-react';

const ExportReplay = ({ simulationData, onReplay }) => {
  const [replayData, setReplayData] = useState(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [savedReplays, setSavedReplays] = useState([]);
  const fileInputRef = useRef();

  // Export simulation as JSON
  const exportAsJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      simulationData,
      metadata: {
        type: 'quantum-physics-simulation',
        author: 'Quantum Lab',
        description: 'Advanced physics simulation data'
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quantum-simulation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export simulation as GIF (simplified - would need actual GIF generation)
  const exportAsGIF = () => {
    // This would require a more complex implementation with canvas recording
    // For now, we'll create a placeholder
    alert('GIF export requires additional implementation. JSON export is available.');
  };

  // Save replay state
  const saveReplay = () => {
    const replayName = prompt('Enter replay name:');
    if (replayName && simulationData) {
      const newReplay = {
        id: Date.now(),
        name: replayName,
        data: simulationData,
        timestamp: new Date().toISOString(),
        duration: 30 // seconds
      };
      
      const updatedReplays = [...savedReplays, newReplay];
      setSavedReplays(updatedReplays);
      localStorage.setItem('savedReplays', JSON.stringify(updatedReplays));
    }
  };

  // Load replay from file
  const loadReplay = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setReplayData(data);
          onReplay(data);
        } catch (error) {
          alert('Invalid replay file format');
        }
      };
      reader.readAsText(file);
    }
  };

  // Start replay
  const startReplay = (replay) => {
    setReplayData(replay);
    setIsReplaying(true);
    onReplay(replay);
  };

  // Stop replay
  const stopReplay = () => {
    setIsReplaying(false);
    setReplayData(null);
  };

  // Share replay
  const shareReplay = async (replay) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quantum Simulation: ${replay.name}`,
          text: `Check out this quantum physics simulation!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Quantum Simulation: ${replay.name}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Replay link copied to clipboard!');
    }
  };

  // Load saved replays from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('savedReplays');
    if (saved) {
      setSavedReplays(JSON.parse(saved));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Export & Replay</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportAsJSON}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportAsGIF}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export GIF</span>
          </motion.button>
        </div>
      </div>

      {/* Replay Controls */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isReplaying ? stopReplay : () => startReplay(replayData)}
            className={`btn-primary flex items-center space-x-2 ${
              isReplaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isReplaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isReplaying ? 'Stop' : 'Replay'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveReplay}
            className="btn-secondary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Replay</span>
          </motion.button>
        </div>

        {/* Replay Speed Control */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-300">Replay Speed:</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-300">{replaySpeed}x</span>
        </div>

        {/* File Upload */}
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={loadReplay}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Load Replay</span>
          </motion.button>
        </div>
      </div>

      {/* Saved Replays */}
      {savedReplays.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4">Saved Replays</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {savedReplays.map((replay) => (
              <motion.div
                key={replay.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-600 hover:border-neon-blue/50 transition-colors"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-white">{replay.name}</h5>
                  <p className="text-sm text-gray-400">
                    {new Date(replay.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startReplay(replay)}
                    className="btn-secondary text-sm"
                  >
                    <Play className="w-3 h-3" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareReplay(replay)}
                    className="btn-secondary text-sm"
                  >
                    <Share2 className="w-3 h-3" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const updated = savedReplays.filter(r => r.id !== replay.id);
                      setSavedReplays(updated);
                      localStorage.setItem('savedReplays', JSON.stringify(updated));
                    }}
                    className="btn-secondary text-sm text-red-400 hover:text-red-300"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Replay Status */}
      {isReplaying && replayData && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">
              Replaying: {replayData.name || 'Current Simulation'}
            </span>
            <span className="text-gray-400">
              Speed: {replaySpeed}x
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExportReplay;
