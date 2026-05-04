import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AiErrorBanner } from '../components/AiErrorBanner';

export const ChatDetail = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await api.get(
          `/api/chats/${chatId}/messages?page=1&limit=50`
        );
        setChat(response.data.chat);
        setMessages(response.data.messages);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el chat');
        setLoading(false);
      }
    };

    fetchChat();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');
    setAiError('');

    try {
      const response = await api.post(`/api/chats/${chatId}/message`, {
        text: newMessage,
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422 && data?.message) {
        // AI validation error — show message, keep input intact
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando chat...</p>
      </div>
    );
  }

  if (error && !chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/chats')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver a chats
          </button>
        </div>
      </div>
    );
  }

  const otherUser =
    user.id === chat.interested._id ? chat.owner : chat.interested;
  const isInterested = user.id === chat.interested._id;
  const lastMessageFromOther = messages.length > 0
    ? messages[messages.length - 1].sender._id !== user.id
    : false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/chats')}
              className="text-blue-500 hover:text-blue-700 mb-2"
            >
              ← Volver a chats
            </button>
            <h1 className="text-2xl font-bold">
              {chat.vehicle.brand} {chat.vehicle.model}
            </h1>
            <p className="text-gray-600 text-sm">
              Conversación con {otherUser.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {isInterested ? 'Interesado' : 'Propietario'}
            </p>
            <a
              href={`/vehicles/${chat.vehicle._id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              Ver vehículo
            </a>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">Aún no hay mensajes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender._id === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender._id === user.id
                        ? 'text-blue-100'
                        : 'text-gray-600'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString('es-CR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">
          {error}
        </div>
      )}

      {/* Input de mensaje */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <AiErrorBanner message={aiError} onClose={() => setAiError('')} />

          {!lastMessageFromOther && messages.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              {isInterested
                ? 'Esperando respuesta del propietario...'
                : 'Esperando respuesta del interesado...'}
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
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={
                sending ||
                !newMessage.trim() ||
                (!lastMessageFromOther && messages.length > 0)
              }
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50"
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-2">
            {newMessage.length}/500 caracteres
          </p>
        </div>
      </div>
    </div>
  );
};