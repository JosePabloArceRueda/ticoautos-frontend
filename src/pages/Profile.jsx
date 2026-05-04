import React, { useState, useEffect } from 'react';
import api from '../services/api';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/me')
      .then((res) => setUser(res.data))
      .catch(() => setError('No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const isGoogle = user?.authProvider === 'google';

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name} {user?.lastName}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {isGoogle ? 'Cuenta Google' : 'Cuenta local'}
              </span>
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Datos personales</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Nombre</dt>
              <dd className="text-sm font-medium">{user?.name || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Apellidos</dt>
              <dd className="text-sm font-medium">{user?.lastName || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Cédula</dt>
              <dd className="text-sm font-medium">{user?.cedula || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Fecha de nacimiento</dt>
              <dd className="text-sm font-medium">{formatDate(user?.birthDate)}</dd>
            </div>
          </dl>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contacto</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium">{user?.email || '—'}</dd>
            </div>
            {!isGoogle && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Teléfono</dt>
                <dd className="text-sm font-medium">{user?.phone || '—'}</dd>
              </div>
            )}
          </dl>
        </div>

      </div>
    </div>
  );
};
