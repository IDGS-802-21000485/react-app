import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Documentos from "./pages/Documentos";
import Categoria from "./pages/Categorias";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/documentos" element={<Documentos />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/categorias" element={<Categoria />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;