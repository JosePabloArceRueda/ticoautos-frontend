import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
    pages: 0,
  });

  const page = parseInt(searchParams.get('page')) || 1;

  // Fetch user's vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/me/vehicles?page=${page}&limit=12`);
        setVehicles(response.data.data);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      } catch (err) {
        setError('Error loading your vehicles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  // Format price in Costa Rican currency
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
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your vehicles</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Create Vehicle Button */}
        <div className="mb-8">
          <Link
            to="/dashboard/vehicles/new"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold inline-block transition"
          >
            ➕ Create new vehicle
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading your vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">You have no vehicles registered yet</p>
            <Link
              to="/dashboard/vehicles/new"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold transition"
            >
              Create the first one
            </Link>
          </div>
        ) : (
          <>
            {/* Vehicles List */}
            <div className="space-y-4 mb-8">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        <span> Año {vehicle.year}</span>
                        <span> Precio {formatPrice(vehicle.price)}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            vehicle.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vehicle.status === 'AVAILABLE' ? 'Available' : 'Sold'}
                        </span>
                      </div>
                      {vehicle.description && (
                        <p className="text-gray-600 line-clamp-2">
                          {vehicle.description}
                        </p>
                      )}
                      {vehicle.images && vehicle.images.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                           {vehicle.images.length} image(s)
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-8 ml-6">
                      <button
                        onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/edit`)}
                        className="px-2000 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/vehicles/${vehicle._id}/delete`)}
                        className="px-8 py-2 bg-red-600 text-white rounded hover:bg-red-600 font-semibold transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                        className="px-8 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-4 py-2 rounded ${
                      pagination.page === p
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};