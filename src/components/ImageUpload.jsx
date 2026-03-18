import React, { useState } from 'react';
import api from '../services/api';

export const ImageUpload = ({ vehicleId, onImagesUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = React.useRef(null);

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
      setErrorMessage('Seleccione al menos una imagen');
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
      fileInputRef.current.value = '';
      onImagesUpload(response.data.images);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Error al subir imágenes'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger file input click
  const handleClickUploadButton = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
        onClick={handleClickUploadButton}
      >
        <div className="text-4xl mb-2">📁</div>
        <p className="text-gray-700 font-semibold mb-1">
          Haga clic para seleccionar imágenes
        </p>
        <p className="text-gray-500 text-sm">
          JPG, PNG o WebP (áx. 5MB cada uno, hasta 5 imágenes)
        </p>
      </div>

      {/* Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            Selected: {selectedFiles.length} image(s)
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {previewUrls.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isLoading || selectedFiles.length === 0}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isLoading
          ? 'Subiendo...'
          : selectedFiles.length > 0
          ? `Subir ${selectedFiles.length} imagen(es)`
          : 'Subir imágenes'}
      </button>
    </div>
  );
};