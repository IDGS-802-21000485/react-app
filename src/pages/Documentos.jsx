import React, { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import Swal from "sweetalert2";
import "./Documentos.css";

const GestionDocumentos = () => {
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [documento, setDocumento] = useState(null);
  const [documentosUsuario, setDocumentosUsuario] = useState([]);
  const [isLoading, setIsLoading] = useState({
    usuarios: true,
    categorias: true,
    documentos: false,
    subida: false,
  });

  // Obtener usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, usuarios: true }));
        const response = await api.get("/usuarios");

        if (Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setUsuarios([]);
          Swal.fire({
            icon: "error",
            title: "Error de formato",
            text: "Los usuarios no se recibieron en el formato esperado",
            confirmButtonColor: "#3085d6",
          });
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsuarios([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los usuarios",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setIsLoading((prev) => ({ ...prev, usuarios: false }));
      }
    };
    fetchUsuarios();
  }, []);

  // Obtener categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, categorias: true }));
        const response = await api.get("/categorias");

        if (Array.isArray(response.data)) {
          setCategorias(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setCategorias([]);
          Swal.fire({
            icon: "error",
            title: "Error de formato",
            text: "Las categorías no se recibieron en el formato esperado",
            confirmButtonColor: "#3085d6",
          });
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las categorías",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setIsLoading((prev) => ({ ...prev, categorias: false }));
      }
    };
    fetchCategorias();
  }, []);

  // Obtener documentos del usuario seleccionado
  useEffect(() => {
    const fetchDocumentosUsuario = async () => {
      if (usuarioSeleccionado) {
        try {
          setIsLoading((prev) => ({ ...prev, documentos: true }));
          const response = await api.get(
            `/documentos/usuario/${usuarioSeleccionado._id}`
          );

          if (Array.isArray(response.data)) {
            setDocumentosUsuario(response.data);
          } else {
            console.error("La respuesta no es un array:", response.data);
            setDocumentosUsuario([]);
          }
        } catch (error) {
          console.error("Error al obtener documentos:", error);
          setDocumentosUsuario([]);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los documentos del usuario",
            confirmButtonColor: "#3085d6",
          });
        } finally {
          setIsLoading((prev) => ({ ...prev, documentos: false }));
        }
      }
    };
    fetchDocumentosUsuario();
  }, [usuarioSeleccionado]);

  // Manejar selección de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "El tamaño máximo permitido es 5MB",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setDocumento({
          nombreArchivo: file.name,
          tipoArchivo: file.type,
          archivo: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Subir documento
  const subirDocumento = async () => {
    if (!usuarioSeleccionado || !categoriaSeleccionada || !documento) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Debes seleccionar un usuario, una categoría y un archivo",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsLoading((prev) => ({ ...prev, subida: true }));

    try {
      const documentoData = {
        nombreArchivo: documento.nombreArchivo,
        tipoArchivo: documento.tipoArchivo,
        archivo: documento.archivo, // El base64 sin prefijo
        usuarioId: usuarioSeleccionado._id,
        categoriaId: categoriaSeleccionada._id,
      };

      // Configuración de Axios para la petición
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 segundos de timeout
      };

      const response = await api.post("/documentos", documentoData, config);

      if (response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Documento subido",
          text: "El documento se ha guardado correctamente",
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });

        // Actualizar lista de documentos
        const docsResponse = await api.get(
          `/documentos/usuario/${usuarioSeleccionado._id}`
        );
        setDocumentosUsuario(docsResponse.data);
        setDocumento(null);

        // Limpiar selección de archivo
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error(`Respuesta inesperada: ${response.status}`);
      }
    } catch (error) {
      console.error("Error detallado al subir documento:", {
        error: error.response ? error.response.data : error.message,
        config: error.config,
      });

      let errorMessage = "No se pudo subir el documento";
      if (error.response) {
        // El servidor respondió con un código de error
        errorMessage =
          error.response.data.message ||
          `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Error al configurar la petición
        errorMessage = error.message || "Error al configurar la petición";
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        html: `<div>${errorMessage}</div><small>Por favor intenta nuevamente</small>`,
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, subida: false }));
    }
  };

  // Ver documento
  const verDocumento = async (doc) => {
    if (!doc || !doc.archivo || !doc.tipoArchivo) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "El documento no tiene datos válidos para visualizar",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Verificar si es un tipo de archivo que podemos mostrar en el navegador
    const tiposVisualizables = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ];

    if (!tiposVisualizables.includes(doc.tipoArchivo)) {
      const { isConfirmed } = await Swal.fire({
        title: "Descargar documento",
        text: "Este tipo de archivo no puede visualizarse directamente. ¿Deseas descargarlo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, descargar",
        cancelButtonText: "Cancelar",
      });

      if (isConfirmed) {
        descargarDocumento(doc);
      }
      return;
    }

    // Crear un blob y URL para el documento
    try {
      const blob = base64ToBlob(doc.archivo, doc.tipoArchivo);
      if (!blob) {
        throw new Error("No se pudo crear el blob");
      }

      const url = URL.createObjectURL(blob);

      // Abrir en nueva pestaña
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        const { isConfirmed } = await Swal.fire({
          title: "Ventana emergente bloqueada",
          text: "Tu navegador bloqueó la apertura del documento. ¿Deseas descargarlo en su lugar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, descargar",
          cancelButtonText: "Cancelar",
        });

        if (isConfirmed) {
          descargarDocumento(doc);
        }
      }
    } catch (error) {
      console.error("Error al visualizar documento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo abrir el documento",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Convertir base64 a Blob
  const base64ToBlob = (base64, contentType = "") => {
    try {
      const base64WithoutPrefix = base64.replace(/^data:[^;]+;base64,/, "");
      const byteCharacters = atob(base64WithoutPrefix);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    } catch (error) {
      console.error("Error al convertir base64 a Blob:", error);
      return null;
    }
  };

  // Descargar documento
  const descargarDocumento = async (doc) => {
    try {
      const blob = base64ToBlob(doc.archivo, doc.tipoArchivo);
      if (!blob) {
        throw new Error("No se pudo crear el archivo para descarga");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.nombreArchivo || "documento";
      document.body.appendChild(link);
      link.click();

      // Limpiar después de un breve retraso
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      await Swal.fire({
        icon: "success",
        title: "Descarga iniciada",
        text: "El documento se está descargando",
        confirmButtonColor: "#3085d6",
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al descargar documento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo descargar el documento",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // En tu componente GestionDocumentos.jsx

  const eliminarDocumento = async (doc) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar documento?",
      text: `¿Estás seguro que deseas eliminar "${doc.nombreArchivo}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return;

    try {
      setIsLoading((prev) => ({ ...prev, [doc._id]: true }));
      console.log("Eliminando documento:", doc._id);
      const response = await api.delete(`/documentos/${doc._id}`);

        await Swal.fire({
          icon: "success",
          title: "Documento eliminado",
          text: response.data.mensaje,
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });

        // Actualizar la lista de documentos
        const updatedDocs = documentosUsuario.filter((d) => d._id !== doc._id);
        setDocumentosUsuario(updatedDocs);
  
    } finally {
      setIsLoading((prev) => ({ ...prev, [doc._id]: false }));
    }
  };

  return (
    <div className="documentos-container">
      <div className="documentos-card">
        <div className="documentos-header">
          <h2>Gestión de Documentos</h2>
          <p>Sube y administra documentos por usuario y categoría</p>
        </div>

        <div className="documentos-content">
          {/* Selección de usuario */}
          <div className="selection-section">
            <h3>Seleccionar Usuario</h3>
            {isLoading.usuarios ? (
              <div className="loading-spinner">Cargando usuarios...</div>
            ) : (
              <div className="users-grid">
                {Array.isArray(usuarios) && usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <div
                      key={usuario._id}
                      className={`user-card ${
                        usuarioSeleccionado?._id === usuario._id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setUsuarioSeleccionado(usuario)}
                    >
                      <div className="user-avatar">
                        {usuario.nombre.charAt(0)}
                        {usuario.apellidos.charAt(0)}
                      </div>
                      <div className="user-info">
                        <h4>
                          {usuario.nombre} {usuario.apellidos}
                        </h4>
                        <p>{usuario.correo}</p>
                        <span className={`user-role ${usuario.rol}`}>
                          {usuario.rol}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay usuarios disponibles</p>
                )}
              </div>
            )}
          </div>

          {/* Selección de categoría y subida */}
          {usuarioSeleccionado && (
            <div className="upload-section">
              <h3>Seleccionar Categoría</h3>
              {isLoading.categorias ? (
                <div className="loading-spinner">Cargando categorías...</div>
              ) : (
                <>
                  <div className="categories-grid">
                    {Array.isArray(categorias) && categorias.length > 0 ? (
                      categorias.map((categoria) => (
                        <div
                          key={categoria._id}
                          className={`category-card ${
                            categoriaSeleccionada?._id === categoria._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => setCategoriaSeleccionada(categoria)}
                        >
                          {categoria.nombreCategoria}
                        </div>
                      ))
                    ) : (
                      <p>No hay categorías disponibles</p>
                    )}
                  </div>

                  {categoriaSeleccionada && (
                    <div className="file-upload">
                      <h3>Subir Documento</h3>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="file-input"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="file-label">
                        {documento
                          ? documento.nombreArchivo
                          : "Seleccionar archivo"}
                      </label>
                      {documento && (
                        <button
                          onClick={subirDocumento}
                          className="upload-btn"
                          disabled={isLoading.subida}
                        >
                          {isLoading.subida ? (
                            <>
                              <span className="spinner"></span>
                              Subiendo...
                            </>
                          ) : (
                            "Subir Documento"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Documentos del usuario */}
          {usuarioSeleccionado && (
            <div className="documents-section">
              <h3>Documentos de {usuarioSeleccionado.nombre}</h3>
              {isLoading.documentos ? (
                <div className="loading-spinner">Cargando documentos...</div>
              ) : Array.isArray(documentosUsuario) &&
                documentosUsuario.length > 0 ? (
                <div className="documents-list">
                  {documentosUsuario.map((doc) => (
                    <div key={doc._id} className="document-card">
                      <div className="document-info">
                        <h4>{doc.nombreArchivo}</h4>
                        <p>
                          Categoría:{" "}
                          {categorias.find((c) => c._id === doc.categoriaId)
                            ?.nombreCategoria || "Desconocida"}
                        </p>
                        <p>
                          Subido:{" "}
                          {new Date(doc.fechaSubida).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="document-actions">
                        <button
                          onClick={() => verDocumento(doc)}
                          className="action-btn view"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => descargarDocumento(doc)}
                          className="action-btn download"
                        >
                          Descargar
                        </button>
                        <button
                          onClick={() => eliminarDocumento(doc)}
                          className="action-btn delete"
                          disabled={isLoading[doc._id]}
                        >
                          {isLoading[doc._id] ? (
                            <span className="spinner"></span>
                          ) : (
                            "Eliminar"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-documents">
                  No hay documentos para este usuario
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionDocumentos;
