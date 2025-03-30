import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Función para determinar si el enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <span className="brand-logo">GD</span>
          <span className="brand-text">Gestión Escolar</span>
        </Link>
        
        <div className="navbar-links">
          <ul className="nav-list">
            <li className={`nav-item ${isActive('/dashboard')}`}>
              <Link className="nav-link" to="/dashboard">
                <span className="link-icon">🏠</span>
                <span className="link-text">Inicio</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/usuarios')}`}>
              <Link className="nav-link" to="/usuarios">
                <span className="link-icon">👥</span>
                <span className="link-text">Usuarios</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/categorias')}`}>
              <Link className="nav-link" to="/categorias">
                <span className="link-icon">🗂️</span>
                <span className="link-text">Categorias</span>
              </Link>
            </li>
            <li className={`nav-item ${isActive('/documentos')}`}>
              <Link className="nav-link" to="/documentos">
                <span className="link-icon">📄</span>
                <span className="link-text">Documentos</span>
              </Link>
            </li>
          </ul>
          
          <div className="user-actions">
            <button className="logout-btn">
            <Link className="nav-link" to="/">
                <span className="link-icon">🚪</span>
                <span className="link-text">Salir</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;