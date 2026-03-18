import React from 'react';
import api from '../services/api';

export const ImageGallery = ({ vehicleId, images, onImageDelete, isOwner }) => {
  // Delete image from vehicle
  const handleDelete = async (imageUrl) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const response = await api.delete(
        `/api/vehicles/${vehicleId}/images/${encodeURIComponent(imageUrl)}`
      );
      onImageDelete(response.data.images);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar imagen');
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay imágenes disponibles
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${imageUrl}`}
            alt={`Vehículo ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg"
          />
          {isOwner && (
            <button
              onClick={() => handleDelete(imageUrl)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};