from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from astropy.constants import G, c, M_sun
from astropy import units as u
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for faster rendering
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import os
import asyncio
from functools import lru_cache
import time
from typing import Optional

# Initialize FastAPI with optimized settings
app = FastAPI(
    title="Quantum Physics API",
    description="High-performance physics simulation API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add compression middleware for faster responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS to allow frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quantum-simulation-nu.vercel.app",
        "https://quantum-simulation-vite.vercel.app",  # New Vite frontend
        "http://localhost:3000",
        "http://localhost:5173"  # Vite default port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for caching
_simulator_cache = None
_plot_cache = {}
_service_start_time = time.time()

# Optimize matplotlib for server environment
plt.style.use('default')
plt.rcParams['figure.figsize'] = (8, 6)
plt.rcParams['figure.dpi'] = 100
plt.rcParams['savefig.dpi'] = 100
plt.rcParams['font.size'] = 10


class BlackHoleParams(BaseModel):
    mass: float
    distance: Optional[float] = None

class TimeDilationParams(BaseModel):
    mass: float
    distance: float

# Startup event to initialize cached components
@app.on_event("startup")
async def startup_event():
    """Initialize cached components on startup for faster responses"""
    global _simulator_cache
    try:
        # Attempt to initialize simulator but don't fail startup if unavailable
        _simulator_cache = AerSimulator()
        print("✅ Quantum simulator initialized and cached")
    except Exception as e:
        _simulator_cache = None
        print(f"⚠️ Warning: Could not initialize quantum simulator: {e}")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Quantum Physics API", 
        "status": "healthy",
        "version": "2.0.0",
        "endpoints": [
            "/calculate_radius",
            "/hawking_radiation", 
            "/simulate_quantum",
            "/time_dilation",
            "/health"
        ]
    }

@app.get("/health")
async def health_check():
    """Lightweight health check for load balancers"""
    return {"status": "healthy", "timestamp": time.time(), "uptime_seconds": time.time() - _service_start_time}

@lru_cache(maxsize=1000)
def _calculate_radius_cached(mass: float) -> float:
    """Cached calculation for Schwarzschild radius"""
    mass_of_black_hole = mass * M_sun.value
    radius = (2 * G.value * mass_of_black_hole / (c.value**2)) / 1000  # Convert to km
    return radius

@app.post("/calculate_radius")
async def calculate_radius(params: BlackHoleParams):
    """Calculate Schwarzschild radius with caching for performance"""
    try:
        if params.mass <= 0:
            raise HTTPException(status_code=400, detail="Mass must be a positive value.")
        
        if params.mass > 1e6:  # Prevent extremely large calculations
            raise HTTPException(status_code=400, detail="Mass too large for calculation.")

        # Use cached calculation for better performance
        radius = _calculate_radius_cached(params.mass)
        
        return {
            "radius": radius,
            "mass": params.mass,
            "calculation_time": time.time()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@lru_cache(maxsize=1000)
def _calculate_hawking_temperature_cached(mass: float) -> float:
    """Cached calculation for Hawking radiation temperature"""
    h = 6.626e-34  # Planck constant
    k_B = 1.381e-23  # Boltzmann constant
    c_val = c.value  # Speed of light
    G_val = G.value  # Gravitational constant
    
    mass_of_black_hole = mass * M_sun.value
    temperature = (h * (c_val**3)) / (8 * np.pi * G_val * mass_of_black_hole * k_B)
    return temperature

@app.post("/hawking_radiation")
async def hawking_radiation(params: BlackHoleParams):
    """Calculate Hawking radiation temperature with caching"""
    try:
        if params.mass <= 0:
            raise HTTPException(status_code=400, detail="Mass must be a positive value.")
        
        if params.mass > 1e6:
            raise HTTPException(status_code=400, detail="Mass too large for calculation.")

        # Use cached calculation
        temperature = _calculate_hawking_temperature_cached(params.mass)
        
        return {
            "temperature": temperature,
            "mass": params.mass,
            "calculation_time": time.time()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/simulate_quantum")
async def simulate_quantum(params: Optional[dict] = None):
    """Optimized quantum simulation with optional params and caching.

    Accepts optional JSON body like { "shots": 1024, "circuit": "bell" }
    Returns counts and a base64-encoded plot (if plotting succeeds).
    """
    try:
        params = params or {}
        shots = int(params.get('shots', 1024))
        circuit_type = params.get('circuit', 'bell')

        # Use cached simulator for better performance
        global _simulator_cache
        if _simulator_cache is None:
            try:
                _simulator_cache = AerSimulator()
            except Exception:
                _simulator_cache = None

        # Build a simple circuit based on requested type
        if circuit_type == 'bell':
            qc = QuantumCircuit(2, 2)
            qc.h(0)
            qc.cx(0, 1)
            qc.measure([0, 1], [0, 1])
        else:
            # default fallback simple superposition
            qc = QuantumCircuit(1, 1)
            qc.h(0)
            qc.measure(0, 0)

        # Run simulation: if simulator is available, use it; else return a mocked response
        if _simulator_cache is not None:
            compiled_circuit = transpile(qc, _simulator_cache)
            job = _simulator_cache.run(compiled_circuit, shots=shots)
            result = job.result()
            counts = result.get_counts()
        else:
            # Mocked counts when simulator isn't available
            counts = { '00': shots//2, '11': shots//2 } if circuit_type == 'bell' else { '0': shots }

        # Generate optimized plot (best-effort)
        plot_base64 = None
        try:
            cache_key = f"{circuit_type}:{shots}:{str(sorted(counts.items()))}"
            if cache_key in _plot_cache:
                plot_base64 = _plot_cache[cache_key]
            else:
                fig, ax = plt.subplots(figsize=(6, 4))
                states = list(counts.keys())
                values = list(counts.values())
                bars = ax.bar(states, values, color=['#00d4ff', '#8b5cf6', '#ec4899', '#10b981'][:len(states)])
                ax.set_title("Quantum State Counts", fontsize=12)
                ax.set_xlabel("State", fontsize=10)
                ax.set_ylabel("Counts", fontsize=10)
                ax.set_facecolor('white')
                fig.patch.set_facecolor('white')
                buffer = BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
                buffer.seek(0)
                plot_base64 = base64.b64encode(buffer.read()).decode('utf-8')
                buffer.close()
                plt.close()
                _plot_cache[cache_key] = plot_base64
                if len(_plot_cache) > 100:
                    # prune oldest entries by clearing (simple strategy)
                    _plot_cache.clear()
        except Exception as e:
            # non-fatal: return counts even if plotting fails
            print(f"⚠️ Plot generation failed: {e}")

        return {
            "plot": plot_base64,
            "counts": counts,
            "shots": shots,
            "circuit": circuit_type,
            "calculation_time": time.time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quantum simulation error: {str(e)}")

@lru_cache(maxsize=1000)
def _calculate_time_dilation_cached(mass: float, distance: float) -> float:
    """Cached calculation for time dilation factor"""
    G_val = G.value
    c_val = c.value
    M_sun_val = M_sun.value
    
    mass_of_black_hole = mass * M_sun_val
    Rs = (2 * G_val * mass_of_black_hole / (c_val**2)) / 1000  # Convert to km
    
    if distance <= Rs:
        raise ValueError(f"Distance ({distance} km) must be greater than Schwarzschild radius ({Rs:.2f} km)")
    
    factor = (2 * G_val * mass_of_black_hole) / (distance * 1000 * c_val**2)
    if factor >= 1:
        raise ValueError(f"Invalid factor for time dilation: {factor:.2f}")
    
    time_dilation_factor = 1 / np.sqrt(1 - factor)
    return time_dilation_factor

@app.post("/time_dilation")
async def time_dilation(params: TimeDilationParams):
    """Calculate time dilation with caching and validation"""
    try:
        if params.mass <= 0:
            raise HTTPException(status_code=400, detail="Mass must be a positive value.")
        
        if params.distance <= 0:
            raise HTTPException(status_code=400, detail="Distance must be a positive value.")
        
        if params.mass > 1e6 or params.distance > 1e12:
            raise HTTPException(status_code=400, detail="Values too large for calculation.")

        # Use cached calculation
        time_dilation_factor = _calculate_time_dilation_cached(params.mass, params.distance)
        
        return {
            "time_dilation_factor": time_dilation_factor,
            "mass": params.mass,
            "distance": params.distance,
            "calculation_time": time.time()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Time dilation calculation error: {str(e)}")

# Additional optimized endpoints for monitoring
@app.get("/stats")
async def get_stats():
    """Get API statistics and cache info"""
    return {
        "cache_size": len(_plot_cache),
        "simulator_initialized": _simulator_cache is not None,
        "uptime_seconds": time.time() - _service_start_time,
        "memory_usage": "Unavailable (platform-dependent)",
        "version": "2.0.0"
    }

# Clear cache endpoint for maintenance
@app.post("/clear_cache")
async def clear_cache():
    """Clear all caches (admin endpoint)"""
    global _plot_cache
    _plot_cache.clear()
    _calculate_radius_cached.cache_clear()
    _calculate_hawking_temperature_cached.cache_clear()
    _calculate_time_dilation_cached.cache_clear()
    return {"message": "All caches cleared"}

if __name__ == "__main__":
    import uvicorn
    
    # Optimized uvicorn settings for production
    port = int(os.getenv("PORT", 8000))
    workers = int(os.getenv("WORKERS", 1))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=workers,
        log_level="info",
        access_log=True,
        loop="asyncio",
        http="httptools"  # Faster HTTP parsing
    )
