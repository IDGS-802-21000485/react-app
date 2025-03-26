import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = users.find(u => u.correo === email && u.contrasena === password);
      if (user) {
        setTimeout(() => {
          navigate('/usuarios');
        }, 1000);
      } else {
        alert('Credenciales incorrectas');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card" style={{ maxWidth: '500px' }}>
        <div className="card-header">
          <h1>Bienvenido</h1>
          <p>Sistema de Gestión Escolar</p>
        </div>
        
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Correo electrónico</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;