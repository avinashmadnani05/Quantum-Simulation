from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from astropy.constants import G, c, M_sun
from astropy import units as u
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import os
from pydantic import BaseModel


app = FastAPI()

# CORS to allow frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quantum-simulation-nu.vercel.app",
         "http://localhost:3000" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BlackHoleParams(BaseModel):
    mass: float
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/calculate_radius")
async def calculate_radius(params: BlackHoleParams):
    try:
        if params.mass <= 0:
            return {"error": "Mass must be a positive value."}

        # Calculate Schwarzschild radius
        mass_of_black_hole = params.mass * M_sun
        radius = (2 * G * mass_of_black_hole / c**2).to(u.km)
        return {"radius": radius.value}
    except Exception as e:
        return {"error": str(e)}

@app.post("/hawking_radiation")
async def hawking_radiation(params: BlackHoleParams):
    try:
        h = 6.626e-34 * u.J * u.s
        k_B = 1.381e-23 * u.J / u.K
        mass_of_black_hole = params.mass * M_sun
        temperature = (h * c**3) / (8 * np.pi * G * mass_of_black_hole * k_B)
        return {"temperature": temperature.to(u.K).value}
    except Exception as e:
        return {"error": str(e)}

@app.post("/simulate_quantum")
async def simulate_quantum():
    try:
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure([0, 1], [0, 1])
        simulator = AerSimulator()
        compiled_circuit = transpile(qc, simulator)
        result = simulator.run(compiled_circuit).result()
        counts = result.get_counts()
        plt.bar(counts.keys(), counts.values(), color="skyblue")
        plt.title("Quantum State Counts")
        plt.xlabel("State")
        plt.ylabel("Counts")
        buffer = BytesIO()
        plt.savefig(buffer, format="png")
        buffer.seek(0)
        plot_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        buffer.close()
        plt.close()
        return {"plot": plot_base64, "counts": counts}
    except Exception as e:
        return {"error": str(e)}

@app.post("/time_dilation")
async def time_dilation(params: BlackHoleParams):
    try:
        mass_of_black_hole = params.mass * M_sun
        Rs = (2 * G * mass_of_black_hole / c**2).to(u.km).value
        if params.distance <= Rs:
            return {"error": f"Distance ({params.distance} km) must be greater than the Schwarzschild radius ({Rs:.2f} km)"}
        denominator = params.distance * u.km * c**2
        factor = (2 * G * mass_of_black_hole / denominator).decompose()
        if factor >= 1:
            return {"error": f"Invalid factor for time dilation: {factor:.2f}"}
        time_dilation_factor = 1 / np.sqrt(1 - factor)
        return {"time_dilation_factor": time_dilation_factor.value}
    except Exception as e:
        return {"error": f"Time Dilation Calculation Failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Using the environment variable for the port
    uvicorn.run(app, host="0.0.0.0", port=port)
