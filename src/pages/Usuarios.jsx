import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importar SweetAlert
import api from "../services/axiosConfig";
import "../pages/Usuarios.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioData, setUsuarioData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    contrasena: "",
    rol: "docente",
    fechaRegistro: new Date().toISOString(),
  });
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await api.get("usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        if (busqueda.trim() === "") {
          await obtenerUsuarios();
        } else {
          const response = await api.get(`usuarios/buscar?query=${busqueda}`);
          setUsuarios(response.data);
        }
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
        setUsuarios([]);
      }
    };

    const timeoutId = setTimeout(buscarUsuarios, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuarioData({ ...usuarioData, [name]: value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (usuarioEditando) {
        await api.put(`usuarios/${usuarioEditando._id}`, usuarioData);
      } else {
        await api.post("usuarios", usuarioData);
      }
      await obtenerUsuarios();
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormulario = () => {
    setUsuarioData({
      nombre: "",
      apellidos: "",
      telefono: "",
      correo: "",
      contrasena: "",
      rol: "docente",
      fechaRegistro: new Date().toISOString(),
    });
    setUsuarioEditando(null);
  };

  const editarUsuario = (usuario) => {
    setUsuarioData(usuario);
    setUsuarioEditando(usuario);
  };

  const confirmarEliminarUsuario = (usuario) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará a ${usuario.nombre} ${usuario.apellidos}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`usuarios/${usuario._id}`);
          await obtenerUsuarios();
          Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
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
            <div className="user-list-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
              </div>

              <h3 className="section-title">Usuarios Registrados</h3>

              <div className="user-list-container">
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <div key={usuario._id} className="user-card">
                      <div className="user-avatar">
                        {usuario.nombre.charAt(0)}{usuario.apellidos.charAt(0)}
                      </div>
                      <div className="user-info">
                        <h4 className="user-name">
                          {usuario.nombre} {usuario.apellidos}
                        </h4>
                        <p className="user-email">{usuario.correo}</p>
                        <span className={`user-role ${usuario.rol}`}>{usuario.rol}</span>
                      </div>
                      <div className="user-actions">
                        <button onClick={() => editarUsuario(usuario)} className="action-btn edit">
                          Editar
                        </button>
                        <button onClick={() => confirmarEliminarUsuario(usuario)} className="action-btn delete">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No se encontraron usuarios.</p>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                {usuarioEditando ? "Editar Usuario" : "Registrar Nuevo Usuario"}
              </h3>
              <form onSubmit={manejarEnvio} className="premium-form">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    value={usuarioData.nombre}
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
                    value={usuarioData.apellidos}
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
                    value={usuarioData.telefono}
                    onChange={manejarCambio}
                    placeholder="Ej. 555-123-4567"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={usuarioData.correo}
                    onChange={manejarCambio}
                    placeholder="Ej. juan@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={usuarioData.contrasena}
                    onChange={manejarCambio}
                    placeholder="********"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <select name="rol" value={usuarioData.rol} onChange={manejarCambio} className="form-input">
                    <option value="docente">Docente</option>
                    <option value="administrador">Administrador</option>
                    <option value="estudiante">Estudiante</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : usuarioEditando ? "Actualizar" : "Registrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;
