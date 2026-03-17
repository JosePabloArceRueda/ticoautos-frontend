import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const ChatsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'interested'
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchChats = async (tab, page = 1) => {
    setLoading(true);
    setError('');
    try {
      const endpoint =
        tab === 'interested'
          ? '/api/me/chats/as-interested'
          : '/api/me/chats/as-owner';

      const response = await api.get(`${endpoint}?page=${page}&limit=12`);

      setChats(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError('Error al cargar los chats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(activeTab, pagination.page);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchChats(activeTab, newPage);
  };

  const getOtherUser = (chat) => {
    return activeTab === 'interested' ? chat.owner : chat.interested;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-700 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold">Mis chats</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => handleTabChange('interested')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'interested'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Vehículos consultados
          </button>
          <button
            onClick={() => handleTabChange('owner')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'owner'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Consultas en mis vehículos
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Cargando chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">
              {activeTab === 'interested'
                ? 'Aún no has consultado vehículos'
                : 'Aún no hay consultas en tus vehículos'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/chats/${chat._id}`)}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">
                        {chat.vehicle.brand} {chat.vehicle.model}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {activeTab === 'interested'
                          ? `Propietario: ${getOtherUser(chat).name}`
                          : `Interesado: ${getOtherUser(chat).name}`}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {formatPrice(chat.vehicle.price)}
                    </p>
                  </div>

                  <div className="bg-gray-100 p-3 rounded mb-2">
                    {chat.lastMessage ? (
                      <>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {chat.lastMessage.sender.name}:
                          </span>{' '}
                          {chat.lastMessage.text}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(chat.lastMessage.createdAt)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 italic">
                        No hay mensajes aún
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chats/${chat._id}`);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  >
                    Ver conversación →
                  </button>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Anterior
                </button>

                <div className="flex gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded ${
                        pageNum === pagination.page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};