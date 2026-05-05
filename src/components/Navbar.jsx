import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg w-full">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-blue-100 shrink-0" onClick={closeMenu}>
          TicoAutos
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/chats" className="hover:text-blue-100 transition text-base font-medium">
                Chats
              </Link>
              <Link to="/dashboard" className="hover:text-blue-100 transition text-base font-medium">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-blue-100 transition text-base font-medium">
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-base font-bold"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-100 transition text-base font-medium">
                Iniciar sesión
              </Link>
              <Link to="/register" className="px-5 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition text-base font-bold">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menú"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-blue-500 px-4 py-3 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/chats" className="hover:text-blue-100 transition py-1" onClick={closeMenu}>
                Chats
              </Link>
              <Link to="/dashboard" className="hover:text-blue-100 transition py-1" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-blue-100 transition py-1 font-medium" onClick={closeMenu}>
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-100 transition py-1" onClick={closeMenu}>
                Iniciar sesión
              </Link>
              <Link to="/register" className="px-3 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold text-center" onClick={closeMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
