import React from "react";
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Login} from "./Login";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={< Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
export default App;