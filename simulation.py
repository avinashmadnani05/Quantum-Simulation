
import numpy as np
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.visualization import plot_histogram
from astropy.constants import G, c, M_sun
from astropy import units as u

# 1. Define inputs
mass_of_black_hole = 1000 * M_sun  # mass of the black hole in solar masses
spin_parameter = 0  # spin parameter (between 0 and 1 for non-extremal black holes)
distance_from_horizon = 1  # distance from the event horizon (normalized)

# 2. Calculate Schwarzschild radius (Event Horizon)
def schwarzschild_radius(mass):
    """Calculate Schwarzschild radius in kilometers."""
    return (2 * G * mass / c**2).to(u.km)

event_horizon_radius = schwarzschild_radius(mass_of_black_hole)
print(f"Schwarzschild radius: {event_horizon_radius:.2f}")

# 3. Quantum Circuit: Superposition and Entanglement
def create_quantum_circuit():
    """Create a simple quantum circuit simulating quantum states near the event horizon."""
    qc = QuantumCircuit(2, 2)

    # Apply Hadamard gate for superposition on qubit 0
    qc.h(0)

    # Apply CNOT gate for entanglement between qubit 0 and qubit 1
    qc.cx(0, 1)

    # Measure qubits
    qc.measure([0, 1], [0, 1])

    return qc

# Create and visualize quantum circuit
quantum_circuit = create_quantum_circuit()
quantum_circuit.draw(output='mpl')  # Use 'mpl' to draw with Matplotlib
plt.show()

# 4. Run simulation
simulator = Aer.get_backend('qasm_simulator')
compiled_circuit = transpile(quantum_circuit, simulator)
result = simulator.run(compiled_circuit).result()

# 5. Visualize results
counts = result.get_counts()
plot_histogram(counts)
plt.show()

# 6. Simulation of Hawking Radiation (Approximation)
def hawking_radiation_simulation(mass):
    """Approximate Hawking radiation using a simplified model."""
    h = 6.626e-34  # Planck constant
    k_B = 1.381e-23  # Boltzmann constant
    pi = np.pi
    temperature = (h * c**3) / (8 * pi * G * mass * k_B)
    return temperature

    


masses = np.logspace(-9, 1, 100)  # Masses from 10^-9 to 10 solar masses
h = 6.626e-34  # Planck constant
k_B = 1.381e-23  # Boltzmann constant
pi = np.pi
temperatures = (h * c**3) / (8 * np.pi * G * masses * M_sun * k_B)

plt.plot(masses, temperatures)
plt.xscale('log')
plt.yscale('log')
plt.xlabel("Black Hole Mass (Solar Masses)")
plt.ylabel("Hawking Radiation Temperature (K)")
plt.title("Hawking Radiation Temperature vs Mass")
plt.show()

# Simulate Hawking radiation
hawking_temp = hawking_radiation_simulation(mass_of_black_hole)  # Mass of the black hole used
print(f"Approximate Hawking Radiation Temperature: {hawking_temp:.2e} K")


# from fastapi import FastAPI
# from pydantic import BaseModel
# import numpy as np
# from qiskit import QuantumCircuit, transpile
# from qiskit_aer import Aer

# from astropy.constants import G, c, M_sun
# from astropy import units as u
# import matplotlib.pyplot as plt

# app = FastAPI()

# # Input model
# class BlackHoleParams(BaseModel):
#     mass: float
#     spin: float
#     distance: float

# @app.post("/calculate_radius")
# async def calculate_radius(params: BlackHoleParams):
#     mass_of_black_hole = params.mass * M_sun
#     radius = (2 * G * mass_of_black_hole / c**2).to(u.km)
#     return {"radius": radius.value}

# @app.post("/simulate_quantum")
# async def simulate_quantum():
#     qc = QuantumCircuit(2, 2)
#     qc.h(0)
#     qc.cx(0, 1)
#     qc.measure([0, 1], [0, 1])
    
#     simulator = Aer.get_backend('qasm_simulator')
#     compiled_circuit = transpile(qc, simulator)
#     result = simulator.run(compiled_circuit).result()
#     counts = result.get_counts()

#     # Plot and save histogram
#     plot_path = "static/histogram.png"
#     plt.figure()
#     plt.bar(counts.keys(), counts.values())
#     plt.savefig(plot_path)
#     plt.close()

#     return {"plot_path": plot_path, "counts": counts}

# @app.post("/hawking_radiation")
# async def hawking_radiation(params: BlackHoleParams):
#     h = 6.626e-34  # Planck constant
#     k_B = 1.381e-23  # Boltzmann constant
#     mass_of_black_hole = params.mass * M_sun
#     pi = np.pi
#     temperature = (h * c**3) / (8 * pi * G * mass_of_black_hole * k_B)
#     return {"temperature": temperature.value}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
