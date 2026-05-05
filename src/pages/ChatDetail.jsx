import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_CHAT_MESSAGES } from '../graphql/queries';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AiErrorBanner } from '../components/AiErrorBanner';
import { formatTime } from '../utils/date';

export const ChatDetail = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Chat metadata (vehicle, participants) — loaded once via REST
  const [chat, setChat] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState('');

  // Message sending state
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const messagesEndRef = useRef(null);

  // Load chat metadata once via REST
  useEffect(() => {
    api
      .get(`/api/chats/${chatId}/messages?page=1&limit=1`)
      .then((res) => setChat(res.data.chat))
      .catch(() => setMetaError('Error al cargar el chat'))
      .finally(() => setMetaLoading(false));
  }, [chatId]);

  // Poll messages via GraphQL every 3 seconds
  const { data, loading: messagesLoading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId, page: 1, limit: 50 },
    pollInterval: 3000,
    skip: !chat,
  });

  const messages = data?.chatMessages?.data || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');
    setAiError('');

    try {
      await api.post(`/api/chats/${chatId}/message`, { text: newMessage });
      setNewMessage('');
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422 && data?.message) {
        setAiError(data.message);
      } else if (status === 422) {
        setError('Esperá la respuesta del otro usuario antes de enviar otro mensaje.');
      } else if (status === 403) {
        setError('No tenés permiso para escribir en este chat.');
      } else {
        setError('Error al enviar el mensaje.');
      }
    } finally {
      setSending(false);
    }
  };

  if (metaLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando chat...</p>
      </div>
    );
  }

  if (metaError || !chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{metaError}</p>
          <button onClick={() => navigate('/chats')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Volver a chats
          </button>
        </div>
      </div>
    );
  }

  const userId = user?.id || user?._id;
  const otherUser = userId === (chat.interested._id || chat.interested.id) ? chat.owner : chat.interested;
  const isInterested = userId === (chat.interested._id || chat.interested.id);

  const lastMessageFromOther = messages.length > 0
    ? messages[messages.length - 1].sender.id !== userId
    : false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/chats')} className="text-blue-500 hover:text-blue-700 mb-2">
              ← Volver a chats
            </button>
            <h1 className="text-2xl font-bold">{chat.vehicle.brand} {chat.vehicle.model}</h1>
            <p className="text-gray-600 text-sm">Conversación con {otherUser.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{isInterested ? 'Interesado' : 'Propietario'}</p>
            <a href={`/vehicles/${chat.vehicle._id || chat.vehicle.id}`} className="text-blue-500 hover:underline text-sm">
              Ver vehículo
            </a>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-6">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">Aún no hay mensajes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender.id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  message.sender.id === userId ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender.id === userId ? 'text-blue-100' : 'text-gray-600'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error de turno */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">{error}</div>
      )}

      {/* Input de mensaje */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <AiErrorBanner message={aiError} onClose={() => setAiError('')} />

          {!lastMessageFromOther && messages.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              {isInterested ? 'Esperando respuesta del propietario...' : 'Esperando respuesta del interesado...'}
            </p>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              maxLength={500}
              disabled={sending || (!lastMessageFromOther && messages.length > 0)}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim() || (!lastMessageFromOther && messages.length > 0)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-base disabled:opacity-50"
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-2">{newMessage.length}/500 caracteres</p>
        </div>
      </div>
    </div>
  );
};
