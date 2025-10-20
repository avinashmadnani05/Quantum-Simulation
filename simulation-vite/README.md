# Quantum Black Hole Simulation Lab

An immersive, interactive physics simulation laboratory built with modern web technologies. Explore quantum mechanics, general relativity, and black hole physics through stunning 3D visualizations and real-time calculations.

## 🌟 Features

- **Black Hole Physics**: Calculate Schwarzschild radius and Hawking radiation
- **Quantum Simulation**: Interactive quantum circuits with Qiskit
- **Time Dilation**: Experience relativistic effects near massive objects
- **3D Visualizations**: Immersive Three.js scenes for each simulation
- **Data Dashboard**: Track and analyze all your simulations
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern styling
- **Framer Motion** for smooth animations
- **Three.js** with React Three Fiber for 3D graphics
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **FastAPI** for high-performance API
- **Qiskit** for quantum computing simulations
- **Astropy** for astronomical calculations
- **NumPy** for scientific computing

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- npm or yarn

### Frontend Setup
```bash
cd simulation-vite
npm install
npm run dev
```

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
python main.py
```

## 🎯 Usage

1. **Start the backend server** (usually on port 8000)
2. **Run the frontend** (usually on port 3000)
3. **Navigate to the application** in your browser
4. **Explore different simulations**:
   - Black Hole Physics
   - Quantum Circuits
   - Time Dilation Effects
   - Data Dashboard

## 📁 Project Structure

```
simulation-vite/
├── src/
│   ├── api/           # API integration
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Static assets
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind configuration
```

## 🎨 Design System

### Colors
- **Neon Blue**: `#00d4ff` - Primary actions
- **Neon Purple**: `#8b5cf6` - Quantum effects
- **Neon Pink**: `#ec4899` - Time dilation
- **Neon Green**: `#10b981` - Success states

### Typography
- **Primary**: Inter (modern, clean)
- **Monospace**: JetBrains Mono (code, data)

### Components
- **Glass morphism** effects for modern UI
- **Neon glow** animations for interactive elements
- **Smooth transitions** with Framer Motion
- **Responsive grid** layouts

## 🔬 Physics Simulations

### Black Hole Physics
- Schwarzschild radius calculation
- Hawking radiation temperature
- Event horizon visualization
- Accretion disk simulation

### Quantum Mechanics
- Bell state generation
- Quantum entanglement
- Superposition visualization
- Measurement statistics

### General Relativity
- Time dilation effects
- Spacetime curvature
- Gravitational lensing
- Frame-dragging

## 📊 Data Management

- **Local Storage**: Automatic saving of simulation results
- **Export Functionality**: Download data as JSON
- **Data Visualization**: Interactive charts and graphs
- **Simulation History**: Track all previous runs

## 🎮 Interactive Features

- **3D Scenes**: Rotate, zoom, and explore
- **Real-time Calculations**: Instant results
- **Parameter Adjustment**: Interactive sliders and inputs
- **Visual Feedback**: Animated results and progress indicators

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
# Deploy with requirements.txt
# Set environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Qiskit** team for quantum computing framework
- **Three.js** community for 3D graphics
- **FastAPI** for the excellent Python framework
- **Physics community** for inspiration and feedback

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: In-code comments and README

---

Built with ❤️ for the physics community
