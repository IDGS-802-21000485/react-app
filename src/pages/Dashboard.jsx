import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    documentos: 0,
    categorias: 0,
    usuarios: 0,
    loading: true,
    error: null
  });

  // Obtener datos reales de las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, catsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/documentos'),
          axios.get('http://localhost:5000/api/categorias'),
          axios.get('http://localhost:5000/api/usuarios')
        ]);

        setStats({
          documentos: docsRes.data.length,
          categorias: catsRes.data.length,
          usuarios: usersRes.data.length,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los datos del sistema'
        }));
      }
    };

    fetchData();
  }, []);

  const modules = [
    {
      title: "Gestión de Documentos",
      icon: "📄",
      description: "Sube, organiza y gestiona documentos asociados a usuarios y categorías. Incluye funciones para visualizar, descargar y reemplazar archivos.",
      action: () => navigate('/documentos'),
      color: "#4361ee"
    },
    {
      title: "Gestión de Categorías",
      icon: "🗂️",
      description: "Administra las categorías para clasificar documentos. Crea, edita y elimina categorías según tus necesidades.",
      action: () => navigate('/categorias'),
      color: "#3a0ca3"
    },
    {
      title: "Gestión de Usuarios",
      icon: "👥",
      description: "Administra los usuarios del sistema con diferentes roles (administrador, docente, administrativo).",
      action: () => navigate('/usuarios'),
      color: "#7209b7"
    }
  ];

  return (
    <div className="premium-container">
      <div className="premium-card">
        <div className="premium-header">
          <h1 className="premium-title">Sistema de Gestión Documental</h1>
          <p className="premium-subtitle">Panel principal de administración</p>
        </div>

        <div className="premium-content">
          {/* Estadísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <h3>Documentos</h3>
              <p>{stats.loading ? '...' : stats.documentos}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🗂️</div>
              <h3>Categorías</h3>
              <p>{stats.loading ? '...' : stats.categorias}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <h3>Usuarios</h3>
              <p>{stats.loading ? '...' : stats.usuarios}</p>
            </div>
          </div>

          {/* Módulos */}
          <h2 className="section-title">Módulos del Sistema</h2>
          <div className="modules-grid">
            {modules.map((module, index) => (
              <div 
                key={index} 
                className="module-card"
                onClick={module.action}
                style={{ borderTop: `4px solid ${module.color}` }}
              >
                <div className="module-icon" style={{ color: module.color }}>
                  {module.icon}
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <button 
                  className="action-btn secondary"
                  style={{ backgroundColor: module.color }}
                >
                  Acceder
                </button>
              </div>
            ))}
          </div>

          {/* Mensaje de error */}
          {stats.error && (
            <div className="error-message">
              <p>{stats.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;