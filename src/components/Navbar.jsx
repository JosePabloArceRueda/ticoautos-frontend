import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-blue-100">
          TicoAutos
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/chats"
                className="hover:text-blue-100 transition"
              >
                💬 Chats
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-blue-100 transition"
              >
                📋 Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-100 transition"
              >
                Inicia sesión
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};