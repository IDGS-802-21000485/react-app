import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  );
}

export default App;
