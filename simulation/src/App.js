// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import BlackHoleModel from "./blackhole";
// import "./App.css";

// const App = () => {
//     const [mass, setMass] = useState(10);
//     const [radius, setRadius] = useState(null);
//     const [temperature, setTemperature] = useState(null);
//     const [quantumPlot, setQuantumPlot] = useState(null);
//     const [quantumCounts, setQuantumCounts] = useState(null);
//     const [timeDilation, setTimeDilation] = useState(null);
//     const [cosmologicalConstant, setCosmologicalConstant] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Calculate Schwarzschild radius
//     const calculateRadius = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post("http://localhost:8000/calculate_radius", { mass });
//             setRadius(response.data.radius);
//         } catch (err) {
//             setError("Error calculating radius. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Calculate Hawking radiation temperature
//     const getTemperature = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post("http://localhost:8000/hawking_radiation", { mass });
//             setTemperature(response.data.temperature);
//         } catch (err) {
//             setError("Error calculating Hawking radiation. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Simulate quantum physics experiment
//     const simulateQuantum = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post("http://localhost:8000/simulate_quantum");
//             setQuantumPlot(response.data.plot);
//             setQuantumCounts(response.data.counts);
//         } catch (err) {
//             setError("Error simulating quantum physics. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Calculate time dilation
//     const calculateTimeDilation = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post("http://localhost:8000/time_dilation", { mass, distance: 10 });
//             setTimeDilation(response.data.time_dilation);
//         } catch (err) {
//             setError("Error calculating time dilation. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Calculate cosmological constant
//     const calculateCosmologicalConstant = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post("http://localhost:8000/cosmological_constant");
//             setCosmologicalConstant(response.data.cosmological_constant);
//         } catch (err) {
//             setError("Error calculating cosmological constant. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="container">
//             <BlackHoleModel />
//             <header className="header">
//                 <h1>Black Hole Explorer</h1>
//                 <p>Unravel the mysteries of the universe with our interactive simulator.</p>
//             </header>

//             <section className="info-section">
//                 <h2>About Black Holes</h2>
//                 <p>
//                     Black holes are regions of spacetime exhibiting such strong gravitational effects 
//                     that nothing, not even light, can escape from them. Explore the fascinating phenomena 
//                     with our tools.
//                 </p>
//             </section>

//             <section className="simulator-section">
//                 <h2>Black Hole Simulator</h2>
//                 <div className="input-group">
//                     <label htmlFor="mass">Black Hole Mass (in Solar Masses):</label>
//                     <input
//                         id="mass"
//                         type="number"
//                         value={mass}
//                         onChange={(e) => setMass(e.target.value)}
//                         placeholder="Enter mass"
//                     />
//                 </div>
//                 <div className="button-group">
//                     <button onClick={calculateRadius} disabled={isLoading}>Calculate Radius</button>
//                     <button onClick={getTemperature} disabled={isLoading}>Calculate Hawking Radiation</button>
//                     <button onClick={simulateQuantum} disabled={isLoading}>Simulate Quantum</button>
//                     <button onClick={calculateTimeDilation} disabled={isLoading}>Calculate Time Dilation</button>
//                     <button onClick={calculateCosmologicalConstant} disabled={isLoading}>Calculate Cosmological Constant</button>
//                 </div>
//                 <div className="results">
//                     {radius && <p>Schwarzschild Radius: {radius} km</p>}
//                     {temperature && <p>Hawking Radiation Temperature: {temperature} K</p>}
//                     {quantumPlot && (
//                         <div>
//                             <h3>Quantum Simulation Results</h3>
//                             <img src={`data:image/png;base64,${quantumPlot}`} alt="Quantum Plot" />
//                             <pre>{JSON.stringify(quantumCounts, null, 2)}</pre>
//                         </div>
//                     )}
//                     {timeDilation && <p>Time Dilation: {timeDilation}</p>}
//                     {cosmologicalConstant && <p>Cosmological Constant: {cosmologicalConstant}</p>}
//                     {error && <p className="error">{error}</p>}
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default App;





import React, { useState } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Simulation from "./Simulation";
import Home from "./Home.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/simulation" element={<Simulation />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;