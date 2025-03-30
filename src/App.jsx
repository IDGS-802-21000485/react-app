// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Documentos from "./pages/Documentos";
import Categoria from "./pages/Categorias";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Rutas protegidas */}
          <Route element={<MainLayout />}>
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <Usuarios />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route element={<MainLayout />}>
            <Route path="/documentos" element={
              <ProtectedRoute>
                <Documentos />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route element={<MainLayout />}>
            <Route path="/categorias" element={
              <ProtectedRoute>
                <Categoria />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;