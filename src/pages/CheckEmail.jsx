import React from 'react';
import { Link } from 'react-router-dom';

export const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3">Revisá tu correo</h1>
        <p className="text-gray-500 mb-2">
          Te enviamos un enlace de verificación a tu dirección de email.
        </p>
        <p className="text-gray-500 mb-6">
          Hacé clic en el enlace para activar tu cuenta.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Si no lo ves en tu bandeja de entrada, revisá la carpeta de spam.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          Ir al login
        </Link>
      </div>
    </div>
  );
};
