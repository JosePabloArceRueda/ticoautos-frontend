import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_CHATS_AS_INTERESTED, GET_CHATS_AS_OWNER } from '../graphql/queries';
import { formatDateTime } from '../utils/date';

export const ChatsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'interested');

  const { data: interestedData, loading: interestedLoading, error: interestedError } = useQuery(
    GET_CHATS_AS_INTERESTED,
    { skip: activeTab !== 'interested' }
  );

  const { data: ownerData, loading: ownerLoading, error: ownerError } = useQuery(
    GET_CHATS_AS_OWNER,
    { skip: activeTab !== 'owner' }
  );

  const chats = activeTab === 'interested'
    ? interestedData?.myChatsAsInterested || []
    : ownerData?.myChatsAsOwner || [];

  const loading = activeTab === 'interested' ? interestedLoading : ownerLoading;
  const error = activeTab === 'interested' ? interestedError : ownerError;

  const getOtherUser = (chat) => activeTab === 'interested' ? chat.owner : chat.interested;

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(price);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button onClick={() => navigate('/')} className="text-blue-500 hover:text-blue-700 mb-4">
            ← Volver
          </button>
          <h1 className="text-4xl font-bold">Mis chats</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('interested')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'interested' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Vehículos consultados
          </button>
          <button
            onClick={() => setActiveTab('owner')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'owner' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Consultas en mis vehículos
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">Error al cargar los chats</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Cargando chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">
              {activeTab === 'interested' ? 'Aún no has consultado vehículos' : 'Aún no hay consultas en tus vehículos'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chats/${chat.id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{chat.vehicle.brand} {chat.vehicle.model}</h3>
                    <p className="text-gray-600 text-sm">
                      {activeTab === 'interested' ? 'Propietario' : 'Interesado'}: {getOtherUser(chat).name}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">{formatPrice(chat.vehicle.price)}</p>
                </div>

                <div className="bg-gray-100 p-3 rounded mb-2">
                  {chat.lastMessage ? (
                    <>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{chat.lastMessage.sender.name}:</span>{' '}
                        {chat.lastMessage.text}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{formatDateTime(chat.lastMessage.createdAt)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 italic">No hay mensajes aún</p>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/chats/${chat.id}`); }}
                  className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                  Ver conversación →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
