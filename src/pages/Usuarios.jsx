import React, { useState, useEffect } from 'react';
import api from '../services/axiosConfig';
import '../pages/Usuarios.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    correo: '',
    contrasena: '',
    rol: 'docente'
  });
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const response = await api.get('usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Buscar usuarios
  const buscarUsuarios = async () => {
    try {
      const response = await api.get(`usuarios/buscar?query=${busqueda}`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  // Manejar cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (usuarioEditando) {
      setUsuarioEditando({ ...usuarioEditando, [name]: value });
    } else {
      setNuevoUsuario({ ...nuevoUsuario, [name]: value });
    }
  };

  // Crear usuario
  const crearUsuario = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('usuarios', nuevoUsuario);
      await obtenerUsuarios();
      setNuevoUsuario({
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        contrasena: '',
        rol: 'docente'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioEditando?._id) {
      console.error("No hay un usuario seleccionado para editar.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await api.put(`usuarios/${usuarioEditando._id}`, usuarioEditando);
      console.log("Usuario actualizado:", response.data);
      await obtenerUsuarios();
      setModalAbierto(false);
      setUsuarioEditando(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Eliminar usuario
  const eliminarUsuario = async () => {
    if (!usuarioAEliminar?._id) {
      console.error("No hay un usuario seleccionado para eliminar.");
      return;
    }
  
    try {
      await api.delete(`usuarios/${usuarioAEliminar._id}`);
      await obtenerUsuarios();
      setModalEliminarAbierto(false);
      setUsuarioAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };
  

  // Abrir modal de edición
  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando({ ...usuario });
    setModalAbierto(true);
  };

  // Abrir modal de eliminación
  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarAbierto(true);
  };

  // Generar iniciales para avatar
  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="premium-container">
      <div className="premium-card">
        <div className="premium-header">
          <h2 className="premium-title">Administración de Usuarios</h2>
          <p className="premium-subtitle">Gestiona los usuarios del sistema escolar</p>
        </div>

        <div className="premium-content">
          <div className="user-management-grid">
            {/* Lista de usuarios */}
            <div className="user-list-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
                <button 
                  onClick={buscarUsuarios}
                  className="search-btn"
                >
                  Buscar
                </button>
                <button 
                  onClick={obtenerUsuarios}
                  className="search-btn secondary"
                >
                  Mostrar Todos
                </button>
              </div>
              
              <h3 className="section-title">Usuarios Registrados</h3>
              <div className="user-list-container">
                {usuarios.map((usuario) => (
                  <div key={usuario._id} className="user-card">
                    <div className="user-avatar">
                      {getInitials(usuario.nombre, usuario.apellidos)}
                    </div>
                    <div className="user-info">
                      <h4 className="user-name">{usuario.nombre} {usuario.apellidos}</h4>
                      <p className="user-email">{usuario.correo}</p>
                      <span className={`user-role ${usuario.rol}`}>
                        {usuario.rol}
                      </span>
                    </div>
                    <div className="user-actions">
                      <button 
                        onClick={() => abrirModalEdicion(usuario)}
                        className="action-btn edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => abrirModalEliminacion(usuario)}
                        className="action-btn delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario de registro */}
            <div className="form-section">
              <h3 className="section-title">Registrar Nuevo Usuario</h3>
              <form onSubmit={crearUsuario} className="premium-form">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    value={nuevoUsuario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej. Juan"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Apellidos</label>
                  <input
                    name="apellidos"
                    value={nuevoUsuario.apellidos}
                    onChange={manejarCambio}
                    placeholder="Ej. Pérez García"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="telefono"
                    value={nuevoUsuario.telefono}
                    onChange={manejarCambio}
                    placeholder="Ej. 5551234567"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    name="correo"
                    type="email"
                    value={nuevoUsuario.correo}
                    onChange={manejarCambio}
                    placeholder="Ej. usuario@escuela.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input
                    name="contrasena"
                    type="password"
                    value={nuevoUsuario.contrasena}
                    onChange={manejarCambio}
                    placeholder="••••••••"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <select 
                    name="rol" 
                    value={nuevoUsuario.rol} 
                    onChange={manejarCambio} 
                    className="form-input"
                  >
                    <option value="docente">Docente</option>
                    <option value="administrador">Administrador</option>
                    <option value="administrativo">Administrativo</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading-text">Registrando...</span>
                  ) : (
                    <span>Registrar Usuario</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {modalAbierto && usuarioEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Usuario</h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={actualizarUsuario} className="premium-form">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  name="nombre"
                  value={usuarioEditando.nombre}
                  onChange={manejarCambio}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Apellidos</label>
                <input
                  name="apellidos"
                  value={usuarioEditando.apellidos}
                  onChange={manejarCambio}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  name="telefono"
                  value={usuarioEditando.telefono}
                  onChange={manejarCambio}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  name="correo"
                  type="email"
                  value={usuarioEditando.correo}
                  onChange={manejarCambio}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select 
                  name="rol" 
                  value={usuarioEditando.rol} 
                  onChange={manejarCambio} 
                  className="form-input"
                >
                  <option value="docente">Docente</option>
                  <option value="administrador">Administrador</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="modal-btn cancel"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="modal-btn confirm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Eliminación */}
      {modalEliminarAbierto && usuarioAEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button 
                onClick={() => setModalEliminarAbierto(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro que deseas eliminar al usuario <strong>{usuarioAEliminar.nombre} {usuarioAEliminar.apellidos}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setModalEliminarAbierto(false)}
                className="modal-btn cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={eliminarUsuario}
                className="modal-btn delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;