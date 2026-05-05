import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  const page = parseInt(searchParams.get('page')) || 1;

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(price);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/api/me/vehicles?page=${page}&limit=12`)
      .then((res) => {
        setVehicles(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => setError('Error al cargar tus vehículos.'))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mi Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Administrá tus vehículos</p>
          </div>
          <Link
            to="/dashboard/vehicles/new"
            className="inline-block px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm transition text-center"
          >
            + Agregar vehículo
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Cargando vehículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">Aún no tenés vehículos registrados.</p>
            <Link
              to="/dashboard/vehicles/new"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
            >
              Agregar el primero
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-lg shadow hover:shadow-md transition p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {vehicle.status === 'AVAILABLE' ? 'Disponible' : 'Vendido'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>Año: {vehicle.year}</span>
                        <span>Precio: {formatPrice(vehicle.price)}</span>
                        {vehicle.images?.length > 0 && (
                          <span>{vehicle.images.length} foto(s)</span>
                        )}
                      </div>
                      {vehicle.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{vehicle.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold transition"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/edit`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/delete`)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSearchParams({ page: Math.max(1, page - 1) })}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  Anterior
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSearchParams({ page: p })}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      page === p ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setSearchParams({ page: Math.min(pagination.pages, page + 1) })}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm"
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
