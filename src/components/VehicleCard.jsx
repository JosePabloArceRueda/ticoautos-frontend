import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const VehicleCard = ({ vehicle }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(price);

  const imageUrl = vehicle.images?.length > 0 ? `${API_BASE_URL}${vehicle.images[0]}` : null;

  return (
    <Link
      to={`/vehicles/${vehicle.id || vehicle._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 overflow-hidden flex flex-col"
    >
      <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Sin imagen</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-1">{vehicle.brand} {vehicle.model}</h3>
        <p className="text-gray-500 text-sm mb-2">{vehicle.year}</p>
        <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(vehicle.price)}</p>

        {vehicle.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vehicle.description}</p>
        )}

        <div className="mt-auto flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {vehicle.status === 'AVAILABLE' ? 'Disponible' : 'Vendido'}
          </span>
          <span className="text-gray-400 text-xs">{formatDate(vehicle.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};
