import axios from 'axios';

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Physics API functions
export const physicsApi = {
  // Calculate Schwarzschild radius
  calculateRadius: async (mass) => {
    try {
      const response = await api.post('/calculate_radius', { mass });
      return {
        success: true,
        data: response.data,
        radius: response.data.radius
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to calculate radius'
      };
    }
  },

  // Calculate Hawking radiation temperature
  calculateHawkingRadiation: async (mass) => {
    try {
      const response = await api.post('/hawking_radiation', { mass });
      return {
        success: true,
        data: response.data,
        temperature: response.data.temperature
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to calculate Hawking radiation'
      };
    }
  },

  // Simulate quantum circuit
  simulateQuantum: async (params = {}) => {
    try {
      const response = await api.post('/simulate_quantum', params);
      return {
        success: true,
        data: response.data,
        plot: response.data.plot,
        counts: response.data.counts,
        shots: response.data.shots,
        circuit: response.data.circuit
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to simulate quantum circuit'
      };
    }
  },

  // Calculate time dilation
  calculateTimeDilation: async (mass, distance) => {
    try {
      const response = await api.post('/time_dilation', { mass, distance });
      return {
        success: true,
        data: response.data,
        timeDilationFactor: response.data.time_dilation_factor
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to calculate time dilation'
      };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Backend is not responding'
      };
    }
  }
};

// Utility functions for data processing
export const dataUtils = {
  // Format large numbers with scientific notation
  formatScientific: (number, precision = 2) => {
    if (number === 0) return '0';
    if (Math.abs(number) < 0.001 || Math.abs(number) > 1000000) {
      return number.toExponential(precision);
    }
    return number.toFixed(precision);
  },

  // Format distance in appropriate units
  formatDistance: (km) => {
    if (km < 1) return `${(km * 1000).toFixed(2)} m`;
    if (km < 1000) return `${km.toFixed(2)} km`;
    if (km < 1000000) return `${(km / 1000).toFixed(2)} Mm`;
    return `${(km / 1000000).toFixed(2)} Gm`;
  },

  // Format temperature
  formatTemperature: (kelvin) => {
    if (kelvin < 1) return `${(kelvin * 1000).toFixed(2)} mK`;
    if (kelvin < 1000) return `${kelvin.toFixed(2)} K`;
    return `${(kelvin / 1000).toFixed(2)} kK`;
  },

  // Calculate relative size comparison
  calculateRelativeSize: (radius, referenceRadius = 696340) => { // Sun's radius in km
    return (radius / referenceRadius).toFixed(2);
  }
};

// Local storage utilities for caching results
export const storageUtils = {
  saveSimulation: (type, data) => {
    try {
      const simulations = JSON.parse(localStorage.getItem('simulations') || '[]');
      const newSimulation = {
        id: Date.now(),
        type,
        data,
        timestamp: new Date().toISOString()
      };
      simulations.push(newSimulation);
      localStorage.setItem('simulations', JSON.stringify(simulations));
      return newSimulation;
    } catch (error) {
      console.error('Failed to save simulation:', error);
      return null;
    }
  },

  getSimulations: () => {
    try {
      return JSON.parse(localStorage.getItem('simulations') || '[]');
    } catch (error) {
      console.error('Failed to load simulations:', error);
      return [];
    }
  },

  clearSimulations: () => {
    localStorage.removeItem('simulations');
  },

  exportData: () => {
    const simulations = storageUtils.getSimulations();
    const dataStr = JSON.stringify(simulations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quantum-simulations-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export default physicsApi;
