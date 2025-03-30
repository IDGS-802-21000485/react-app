// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Swal from 'sweetalert2';
import './Navbar.css'; // Asegúrate de tener un archivo CSS para estilos

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Función para determinar si el enlace está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
        Swal.fire(
          'Sesión cerrada',
          'Has cerrado sesión correctamente.',
          'success'
        );
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/dashboard">
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
          
          <div className="user-section">
            {user && (
              <div className="user-info-navbar">
                <div className="user-avatar">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.nombre || 'Usuario'}</span>
                  <span className="user-email">{user.correo || ''}</span>
                </div>
              </div>
            )}
            
            <button className="logout-btn" onClick={handleLogout}>
              <span className="link-icon">🚪</span>
              <span className="link-text">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;