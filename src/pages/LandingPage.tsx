
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* App Branding */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AgroForrest</h1>
          <p className="text-lg text-gray-600">
            Planejamento inteligente para seus sistemas agroflorestais
          </p>
        </div>

        {/* Login Section */}
        <div className="space-y-6 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900">
            Acesse sua conta
          </h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Entrar
          </button>

          <div className="text-sm text-gray-600 space-y-2">
            <p>Ainda não tem conta? <span className="text-gray-900 cursor-pointer hover:underline">Cadastre-se</span></p>
            <p><span className="text-gray-900 cursor-pointer hover:underline">Esqueceu sua senha?</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
