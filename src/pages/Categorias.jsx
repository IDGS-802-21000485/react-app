import React, { useState, useEffect } from 'react';
import api from "../services/axiosConfig";
import Swal from 'sweetalert2';
import './Categorias.css'; // Usaremos el mismo archivo CSS premium

const GestionCategorias = () => {
  // Estados
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formData, setFormData] = useState({ nombreCategoria: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Obtener categorías al cargar
  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      mostrarError('No se pudieron cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Guardar categoría (crear o actualizar)
  const guardarCategoria = async (e) => {
    e.preventDefault();
    
    if (!formData.nombreCategoria.trim()) {
      mostrarError('El nombre de la categoría es requerido');
      return;
    }

    setIsLoading(true);
    try {
      if (categoriaEditando) {
        // Actualizar categoría existente
        const response = await api.put(`/categorias/${categoriaEditando._id}`, formData);
        setCategorias(categorias.map(cat => 
          cat._id === categoriaEditando._id ? response.data : cat
        ));
        mostrarExito('Categoría actualizada correctamente');
      } else {
        // Crear nueva categoría
        const response = await api.post('/categorias', formData);
        setCategorias([...categorias, response.data]);
        mostrarExito('Categoría creada correctamente');
      }
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      mostrarError(error.response?.data?.mensaje || 'Error al guardar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar categoría
  const editarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setFormData({
      nombreCategoria: categoria.nombreCategoria
    });
  };

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f72585',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await api.delete(`/categorias/${id}`);
      setCategorias(categorias.filter(cat => cat._id !== id));
      mostrarExito('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      mostrarError(error.response?.data?.mensaje || 'Error al eliminar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({ nombreCategoria: '' });
    setCategoriaEditando(null);
  };

  // Mostrar mensaje de éxito
  const mostrarExito = (mensaje) => {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonColor: '#4361ee',
      timer: 2000
    });
  };

  // Mostrar mensaje de error
  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#4361ee'
    });
  };

  // Filtrar categorías por búsqueda
  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombreCategoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="premium-container">
      <div className="premium-card">
        <div className="premium-header">
          <h1 className="premium-title">Gestión de Categorías</h1>
          <p className="premium-subtitle">Administra las categorías del sistema</p>
        </div>

        <div className="premium-content">
          {/* Barra de búsqueda y formulario */}
          <div className="user-management-grid">
            {/* Formulario */}
            <div className="premium-form">
              <h2 className="section-title">
                {categoriaEditando ? 'Editar Categoría' : 'Agregar Categoría'}
              </h2>
              
              <form onSubmit={guardarCategoria}>
                <div className="form-group">
                  <label htmlFor="nombreCategoria" className="form-label">Nombre de la categoría</label>
                  <input
                    type="text"
                    id="nombreCategoria"
                    name="nombreCategoria"
                    value={formData.nombreCategoria}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ej: Documentos académicos"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="user-actions">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading || !formData.nombreCategoria.trim()}
                  >
                    {isLoading ? (
                      <span className="loading-text">Procesando</span>
                    ) : (
                      categoriaEditando ? 'Actualizar' : 'Guardar'
                    )}
                  </button>
                  
                  {categoriaEditando && (
                    <button
                      type="button"
                      className="action-btn secondary"
                      onClick={limpiarFormulario}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de categorías */}
            <div>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar categorías..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <button 
                  className="search-btn secondary"
                  onClick={() => setBusqueda('')}
                  disabled={!busqueda}
                >
                  Limpiar
                </button>
              </div>

              <h2 className="section-title">Lista de Categorías</h2>
              
              {isLoading && categorias.length === 0 ? (
                <div className="loading-text">Cargando categorías...</div>
              ) : categoriasFiltradas.length === 0 ? (
                <div className="no-results">
                  {busqueda ? 'No se encontraron resultados' : 'No hay categorías registradas'}
                </div>
              ) : (
                <div className="user-list-container">
                  {categoriasFiltradas.map(categoria => (
                    <div key={categoria._id} className="user-card">
                      <div className="user-info" style={{ flex: 1 }}>
                        <h3 className="user-name">{categoria.nombreCategoria}</h3>
                        <p className="user-email">
                          ID: {categoria._id}
                        </p>
                      </div>
                      
                      <div className="user-actions">
                        <button
                          onClick={() => editarCategoria(categoria)}
                          className="action-btn edit"
                          disabled={isLoading}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarCategoria(categoria._id)}
                          className="action-btn delete"
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionCategorias;