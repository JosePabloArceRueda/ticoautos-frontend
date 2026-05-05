import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AiErrorBanner } from '../components/AiErrorBanner';

export const StartChat = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAiError('');
    setLoading(true);

    try {
      const response = await api.post(
        `/api/vehicles/${vehicleId}/chat`,
        { text: message }
      );
      navigate(`/chats/${response.data.chatId}`);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422 && data?.message) {
        setAiError(data.message);
      } else if (status === 403) {
        setError('No podés enviar mensajes sobre tus propios vehículos.');
      } else if (status === 404) {
        setError('Vehículo no encontrado.');
      } else {
        setError('Error al enviar el mensaje.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 mb-6"
        >
          ← Atrás
        </button>

        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">Enviar mensaje</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <AiErrorBanner message={aiError} onClose={() => setAiError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tu mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={1}
                maxLength={500}
                rows={6}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Tienes alguna pregunta sobre el vehículo?"
              />
              <p className="text-sm text-gray-600 mt-1">
                {message.length}/500 caracteres
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-base disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold text-base"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};