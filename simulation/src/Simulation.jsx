import React, { useState } from "react";
import axios from "axios";
import "./Simulation.css";

const Simulation = () => {
    const [mass, setMass] = useState(10);
    const [radius, setRadius] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [quantumPlot, setQuantumPlot] = useState(null);
    const [quantumCounts, setQuantumCounts] = useState(null);
    const [timeDilation, setTimeDilation] = useState(null);
    const [error, setError] = useState("");

    const fetchData = async (endpoint, payload, setData) => {
        try {
            setError("");
            const response = await axios.post(`http://localhost:8000/${endpoint}`, payload);

            setData(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || "An unexpected error occurred.";
            setError(errorMsg);
        }
    };

    return (
        <div className="container">
            <section className="info-section">
                <h1>About Black Holes</h1>
                <p>
                    Black holes are regions of space where gravity is so strong that nothing, not even light, can escape.
                </p>
            </section>
            <section className="simulator-section">
                <h2>Black Hole Simulator</h2>
                <label>
                    Black Hole Mass (in Solar Masses):
                    <input
                        type="number"
                        value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                    />
                </label>
                <div className="buttons">
                    <button
                        onClick={() => fetchData("calculate_radius", { mass }, (data) => setRadius(data.radius))}
                    >
                        Calculate Radius
                    </button>
                    <button
                        onClick={() => fetchData("hawking_radiation", { mass }, (data) => setTemperature(data.temperature))}
                    >
                        Calculate Hawking Radiation
                    </button>
                    <button
                        onClick={() => fetchData("simulate_quantum", {}, (data) => {
                            setQuantumPlot(data.plot);
                            setQuantumCounts(data.counts);
                        })}
                    >
                        Simulate Quantum
                    </button>
                    <button
                        onClick={() => fetchData("time_dilation", { mass, distance: 10 }, (data) => setTimeDilation(data.time_dilation_factor))}
                    >
                        Calculate Time Dilation
                    </button>
                </div>
                {error && <p className="error-message">Error: {error}</p>}
                {radius && <p>Schwarzschild Radius: {radius} km</p>}
                {temperature && <p>Hawking Radiation Temperature: {temperature} K</p>}
                {timeDilation && <p>Time Dilation Factor: {timeDilation}</p>}
                {quantumPlot && (
                    <div>
                        <h3>Quantum Simulation Results</h3>
                        <img src={`data:image/png;base64,${quantumPlot}`} alt="Quantum Plot" />
                        <pre>{JSON.stringify(quantumCounts, null, 2)}</pre>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Simulation;



// import React, { useState } from "react";
// // import axios from "axios";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import BlackHole from "./components/BlackHole";
// import CosmicBackground from "./components/CosmicBackground";

// const Simulation = () => {
// //   const [mass, setMass] = useState(10);
// //   const [radius, setRadius] = useState(null);
// //   const [temperature, setTemperature] = useState(null);
// //   const [quantumPlot, setQuantumPlot] = useState(null);
// //   const [quantumCounts, setQuantumCounts] = useState(null);
// //   const [timeDilation, setTimeDilation] = useState(null);
// //   const [error, setError] = useState("");

// //   const fetchData = async (endpoint, payload, setData) => {
// //     try {
// //       setError("");
// //       const response = await axios.post(`http://localhost:8000/${endpoint}`, payload);
// //       setData(response.data);
// //     } catch (err) {
// //       setError(err.response?.data?.error || "An unexpected error occurred.");
// //     }
// //   };

//   return (
//     <div style={{ width: "100vw", height: "100vh", background: "black" }}>
//       <Canvas camera={{ position: [0, 0, 7], fov: 75 }}>
//         {/* Lighting */}
//         <ambientLight intensity={0.2} />
//         <pointLight position={[10, 10, 10]} intensity={3} />

//         {/* Black Hole */}
//         {/* <BlackHole /> */}

//         {/* Cosmic Background */}
//         <CosmicBackground />

//         {/* Controls */}
//         <OrbitControls enableZoom={true} />
//       </Canvas>
//     </div>
//   );
// };

// export default Simulation;


