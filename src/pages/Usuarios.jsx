import React, { useState, useEffect } from 'react';
import api from '../services/axiosConfig';

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    correo: '',
    contrasena: '',
    rol: 'docente'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post('usuarios', newUser);
      setUsers([...users, response.data]);
      setNewUser({
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        contrasena: '',
        rol: 'docente'
      });
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name, lastName) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <h1>Administración de Usuarios</h1>
          <p>Gestiona los usuarios del sistema escolar</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
          {/* Lista de usuarios */}
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.5rem' }}>
              Usuarios Registrados
            </h2>
            
            <div className="user-grid">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-avatar">
                    {getInitials(user.nombre, user.apellidos)}
                  </div>
                  <div className="user-info">
                    <h3>{user.nombre} {user.apellidos}</h3>
                    <p>{user.correo}</p>
                    <span className="user-role">{user.rol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de registro */}
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text)', fontSize: '1.5rem' }}>
              Registrar Nuevo Usuario
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label">Nombre</label>
                <input
                  name="nombre"
                  className="input-field"
                  placeholder="Ej. María"
                  value={newUser.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Apellidos</label>
                <input
                  name="apellidos"
                  className="input-field"
                  placeholder="Ej. González López"
                  value={newUser.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Teléfono</label>
                <input
                  name="telefono"
                  className="input-field"
                  placeholder="Ej. 5551234567"
                  value={newUser.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Correo electrónico</label>
                <input
                  name="correo"
                  type="email"
                  className="input-field"
                  placeholder="Ej. usuario@escuela.com"
                  value={newUser.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ marginTop: '1rem' }}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;