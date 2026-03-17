import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export const DeleteVehicleConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/api/vehicles/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el vehículo');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      await api.delete(`/api/vehicles/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al eliminar el vehículo');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">Eliminar vehículo</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-6 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-2">⚠️ Advertencia</h2>
            <p className="text-gray-700 mb-4">
              Estás a punto de eliminar el siguiente vehículo:
            </p>

            {vehicle && (
              <div className="bg-white p-4 rounded mb-4">
                <p className="text-xl font-bold">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </p>
                <p className="text-gray-600">
                  Precio: ₡{vehicle.price.toLocaleString('es-CR')}
                </p>
              </div>
            )}

            <p className="text-red-700 font-semibold">
              ⚠️ Esta acción es irreversible. Se eliminarán todos los chats y
              mensajes asociados a este vehículo.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Sí, eliminar definitivamente'}
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};