import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const ChatButton = ({ vehicleId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);
    try {
      // Check if chat already exists
      const statusResponse = await api.get(
        `/api/me/chats/status/${vehicleId}`
      );

      if (statusResponse.data.chatExists) {
        // Chat exists, redirect to it
        navigate(`/chats/${statusResponse.data.chatId}`);
      } else {
        // Chat doesn't exist, show modal or navigate to create
        navigate(`/vehicles/${vehicleId}/chat/new`);
      }
    } catch (err) {
      console.error('Error checking chat status:', err);
      navigate(`/vehicles/${vehicleId}/chat/new`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:opacity-50"
    >
      {loading ? 'Cargando...' : ' Enviar mensaje'}
    </button>
  );
};