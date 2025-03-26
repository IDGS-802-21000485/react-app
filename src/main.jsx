// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Estilos globales
import './App.css'; // Estilos de la aplicación
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
