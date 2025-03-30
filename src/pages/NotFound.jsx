import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
        <h1 className="text-5xl font-light text-gray-800">404</h1>
        <p className="text-gray-500 text-lg">
          Página no encontrada
        </p>
        <p className="text-gray-700 text-sm">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;