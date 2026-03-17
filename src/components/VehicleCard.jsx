import React from 'react';
import { Link } from 'react-router-dom';

export const VehicleCard = ({ vehicle }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(price);
  };

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
    >
      <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
        <span className="text-gray-500">Imagen del vehículo</span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">
          {vehicle.brand} {vehicle.model}
        </h3>

        <p className="text-gray-600 text-sm mb-2">{vehicle.year}</p>

        <p className="text-2xl font-bold text-blue-600 mb-3">
          {formatPrice(vehicle.price)}
        </p>

        {vehicle.description && (
          <p className="text-gray-700 text-sm mb-3 truncate">
            {vehicle.description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              vehicle.status === 'AVAILABLE'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {vehicle.status === 'AVAILABLE' ? 'Disponible' : 'Vendido'}
          </span>

          <span className="text-gray-500 text-sm">
            {new Date(vehicle.createdAt).toLocaleDateString('es-CR')}
          </span>
        </div>
      </div>
    </Link>
  );
};