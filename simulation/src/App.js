



import {BrowserRouter, Route, Routes} from "react-router-dom";
import Simulation from "./Simulation";
import Home from "./Home.jsx";
import "./App.css";
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