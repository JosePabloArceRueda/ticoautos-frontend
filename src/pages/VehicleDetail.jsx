import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ChatButton } from '../components/ChatButton';
import { ImageGallery } from '../components/ImageGallery';

export const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/api/vehicles/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading vehicle');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format price in Costa Rican currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(price);
  };

  // Check if current user is the vehicle owner
  const isOwner = isAuthenticated && user?.id === vehicle?.owner?._id;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando vehículo...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Vehículo no encontrado'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-700 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold">
            {vehicle.brand} {vehicle.model}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="md:col-span-2">
            {vehicle.images && vehicle.images.length > 0 ? (
              <ImageGallery
                vehicleId={vehicle._id}
                images={vehicle.images}
                onImageDelete={() => {}}
                isOwner={false}
              />
            ) : (
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xl">No images available</span>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            {/* Price */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-1">Precio</p>
              <p className="text-4xl font-bold text-blue-600">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 mb-6 border-b pb-6">
              <div>
                <p className="text-gray-600 text-sm">Año</p>
                <p className="text-lg font-semibold">{vehicle.year}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    vehicle.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {vehicle.status === 'AVAILABLE' ? 'Disponible' : 'Vendido'}
                </span>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Propietario</p>
                <p className="text-lg font-semibold">{vehicle.owner?.name}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwner ? (
                <>
                  <button
                    onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/edit`)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
                  >
                    Editar vehículo
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition"
                  >
                    Mis vehículos
                  </button>
                </>
              ) : (
                <>
                  {isAuthenticated ? (
                    <ChatButton vehicleId={vehicle._id} />
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
                    >
                      Iniciar sesión para preguntar
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handleCopyLink}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? '✓ Enlace copiado' : 'Copiar enlace'}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {vehicle.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};