import React, { useState } from 'react';

export const FilterForm = ({ initialFilters, onFilterChange }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      status: 'AVAILABLE',
      sort: 'createdAt:desc',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* brand */}
        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            placeholder="Toyota, Honda..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* model */}
        <div>
          <label className="block text-sm font-medium mb-1">Modelo</label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleChange}
            placeholder="Corolla, Civic..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* year */}
        <div>
          <label className="block text-sm font-medium mb-1">Año</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minYear"
              value={filters.minYear}
              onChange={handleChange}
              placeholder="Desde"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="maxYear"
              value={filters.maxYear}
              onChange={handleChange}
              placeholder="Hasta"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Precio</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Desde"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Hasta"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="SOLD">Vendido</option>
            <option value="">Todos</option>
          </select>
        </div>

        {/* Order by */}
        <div>
          <label className="block text-sm font-medium mb-1">Ordenar por</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt:desc">Más recientes</option>
            <option value="price:asc">Precio: menor a mayor</option>
            <option value="price:desc">Precio: mayor a menor</option>
            <option value="year:desc">Año: más nuevo</option>
            <option value="year:asc">Año: más viejo</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          Aplicar filtros
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
        >
          Limpiar filtros
        </button>
      </form>
    </div>
  );
};