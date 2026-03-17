import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/vehicles?page=${page}&limit=12`);
        setVehicles(response.data.data);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } catch (err) {
        setError('Error al cargar tus vehículos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Administra tus vehículos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Botón crear vehículo */}
        <div className="mb-8">
          <Link
            to="/dashboard/vehicles/new"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold inline-block"
          >
            ➕ Crear nuevo vehículo
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Cargando tus vehículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Aún no tienes vehículos registrados</p>
            <Link
              to="/dashboard/vehicles/new"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
            >
              Crear el primero
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-gray-600">
                        Año: {vehicle.year} • Precio: {formatPrice(vehicle.price)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        vehicle.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vehicle.status === 'AVAILABLE' ? 'Disponible' : 'Vendido'}
                    </span>
                  </div>

                  {vehicle.description && (
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mb-4">
                    Creado: {new Date(vehicle.createdAt).toLocaleDateString('es-CR')}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      to={`/vehicles/${vehicle._id}`}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center font-semibold"
                    >
                      Ver público
                    </Link>
                    <Link
                      to={`/dashboard/vehicles/${vehicle._id}/edit`}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-center font-semibold"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/delete`)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
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