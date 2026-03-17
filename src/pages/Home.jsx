import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { VehicleCard } from '../components/VehicleCard';
import { FilterForm } from '../components/FilterForm';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Get filters from URL params
  const getFiltersFromParams = () => {
    return {
      brand: searchParams.get('brand') || '',
      model: searchParams.get('model') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      status: searchParams.get('status') || 'AVAILABLE',
      page: parseInt(searchParams.get('page')) || 1,
      sort: searchParams.get('sort') || 'createdAt:desc',
    };
  };

  const fetchVehicles = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.minYear) params.append('minYear', filters.minYear);
      if (filters.maxYear) params.append('maxYear', filters.maxYear);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.status) params.append('status', filters.status);
      params.append('page', filters.page);
      params.append('limit', filters.limit || 12);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/api/vehicles?${params.toString()}`);
      
      setVehicles(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError('Error al cargar los vehículos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles on mount or when params change
  useEffect(() => {
    const filters = getFiltersFromParams();
    fetchVehicles(filters);
  }, [searchParams]);

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.minYear) params.append('minYear', filters.minYear);
    if (filters.maxYear) params.append('maxYear', filters.maxYear);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.status) params.append('status', filters.status);
    params.append('page', '1'); // Reset to page 1
    if (filters.sort) params.append('sort', filters.sort);

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const filters = getFiltersFromParams();
    const params = new URLSearchParams();
    
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.minYear) params.append('minYear', filters.minYear);
    if (filters.maxYear) params.append('maxYear', filters.maxYear);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.status) params.append('status', filters.status);
    params.append('page', newPage);
    if (filters.sort) params.append('sort', filters.sort);

    setSearchParams(params);
  };

  const filters = getFiltersFromParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/*<h1 className="text-4xl font-bold">TicoAutos</h1>*/}
          <p className="text-gray-600">Encuentra tu vehículo perfecto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="md:col-span-1">
            <FilterForm 
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Listado de vehículos */}
          <div className="md:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">Cargando vehículos...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">No se encontraron vehículos</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
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
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
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
                        )
                      )}
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

                <p className="text-center text-gray-600 mt-4">
                  Mostrando {vehicles.length} de {pagination.total} vehículos
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};