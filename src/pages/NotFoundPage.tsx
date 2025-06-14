
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Página não encontrada
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
        >
          <Home size={20} />
          <span>Voltar ao início</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
