import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_VEHICLES } from '../graphql/queries';
import { VehicleCard } from '../components/VehicleCard';
import { FilterForm } from '../components/FilterForm';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getVariables = () => ({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    minYear: searchParams.get('minYear') ? parseInt(searchParams.get('minYear')) : undefined,
    maxYear: searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')) : undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined,
    status: searchParams.get('status') || 'AVAILABLE',
    sort: searchParams.get('sort') || 'createdAt:desc',
  });

  const { data, loading, error } = useQuery(GET_VEHICLES, {
    variables: getVariables(),
  });

  const vehicles = data?.vehicles?.data || [];
  const pagination = data?.vehicles?.pagination || { page: 1, pages: 0, total: 0 };

  const buildParams = (filters, page) => {
    const params = new URLSearchParams();
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.minYear) params.append('minYear', filters.minYear);
    if (filters.maxYear) params.append('maxYear', filters.maxYear);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.status) params.append('status', filters.status);
    if (filters.sort) params.append('sort', filters.sort);
    params.append('page', page || filters.page || 1);
    return params;
  };

  const handleFilterChange = (filters) => {
    setSearchParams(buildParams(filters, 1));
  };

  const handlePageChange = (newPage) => {
    const filters = {
      brand: searchParams.get('brand'),
      model: searchParams.get('model'),
      minYear: searchParams.get('minYear'),
      maxYear: searchParams.get('maxYear'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      status: searchParams.get('status'),
      sort: searchParams.get('sort'),
    };
    setSearchParams(buildParams(filters, newPage));
  };

  const currentFilters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    status: searchParams.get('status') || 'AVAILABLE',
    sort: searchParams.get('sort') || 'createdAt:desc',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-600">Encuentra tu vehículo perfecto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <FilterForm initialFilters={currentFilters} onFilterChange={handleFilterChange} />
          </div>

          <div className="md:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                Error al cargar los vehículos
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
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Anterior
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => handlePageChange(n)}
                          className={`px-3 py-2 rounded ${
                            n === pagination.page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
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
