import React, { useState } from 'react';
import api from '../services/api';

export const ImageUpload = ({ vehicleId, onImagesUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file selection and preview generation
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    // Generate previews
    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      setPreviewUrls(results);
    });
  };

  // Upload images to backend
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Selecciona al menos una imagen');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post(`/api/vehicles/${vehicleId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSelectedFiles([]);
      setPreviewUrls([]);
      onImagesUpload(response.data.images);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Error al subir imágenes'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Subir Imágenes</h3>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
        className="mb-4 block w-full"
      />

      {previewUrls.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          {previewUrls.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt="Preview"
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isLoading || selectedFiles.length === 0}
        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading
          ? 'Subiendo...'
          : `Subir ${selectedFiles.length} imagen(es)`}
      </button>
    </div>
  );
};