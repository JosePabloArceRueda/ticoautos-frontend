import React from 'react';
import { Link } from 'react-router-dom';

export const VehicleCard = ({ vehicle }) => {
  // Format price in Costa Rican currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(price);
  };

  // Get the first image or placeholder
  const imageUrl = vehicle.images && vehicle.images.length > 0 
    ? `http://localhost:3000${vehicle.images[0]}`
    : null;

  return (
    <Link
      to={`/vehicles/${vehicle._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 overflow-hidden"
    >
      {/* Vehicle Image */}
      <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">No image available</span>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">
          {vehicle.brand} {vehicle.model}
        </h3>

        <p className="text-gray-600 text-sm mb-2">📅 {vehicle.year}</p>

        <p className="text-2xl font-bold text-blue-600 mb-3">
          {formatPrice(vehicle.price)}
        </p>

        {/* Description */}
        {vehicle.description && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {vehicle.description}
          </p>
        )}

        {/* Image Counter */}
        {vehicle.images && vehicle.images.length > 0 && (
          <p className="text-gray-500 text-xs mb-3">
            📸 {vehicle.images.length} image(s)
          </p>
        )}

        {/* Status and Date */}
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              vehicle.status === 'AVAILABLE'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {vehicle.status === 'AVAILABLE' ? 'Available' : 'Sold'}
          </span>

          <span className="text-gray-500 text-xs">
            {new Date(vehicle.createdAt).toLocaleDateString('es-CR')}
          </span>
        </div>
      </div>
    </Link>
  );
};