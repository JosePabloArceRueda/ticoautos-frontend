import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const GoogleCompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ cedula: '' });
  const [cedulaStatus, setCedulaStatus] = useState('idle'); // idle | loading | valid | invalid
  const [cedulaInfo, setCedulaInfo] = useState(null);
  const [cedulaError, setCedulaError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const cedulaTimerRef = useRef(null);

  const tempToken = searchParams.get('tempToken');

  useEffect(() => {
    if (!tempToken) navigate('/login');
  }, [tempToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cedula') {
      const digits = value.replace(/\D/g, '').slice(0, 9);
      setFormData((prev) => ({ ...prev, cedula: digits }));
      if (digits.length < 9) {
        setCedulaStatus('idle');
        setCedulaInfo(null);
        setCedulaError('');
      }
      return;
    }

  };

  useEffect(() => {
    if (formData.cedula.length !== 9) return;

    setCedulaStatus('loading');
    setCedulaInfo(null);
    setCedulaError('');

    if (cedulaTimerRef.current) clearTimeout(cedulaTimerRef.current);
    cedulaTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/api/auth/validate-cedula/${formData.cedula}`);
        setCedulaInfo(res.data);
        setCedulaStatus('valid');
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al validar la cédula.';
        setCedulaError(msg);
        setCedulaStatus('invalid');
      }
    }, 400);

    return () => clearTimeout(cedulaTimerRef.current);
  }, [formData.cedula]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cedulaStatus !== 'valid') {
      setError('Verificá tu cédula antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/google/complete-registration', {
        tempToken,
        cedula: formData.cedula,
      });
      login(response.data.user, response.data.accessToken);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || 'Error al completar el registro. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Completar registro</h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Necesitamos algunos datos adicionales para activar tu cuenta.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400 font-semibold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
              disabled={loading}
              inputMode="numeric"
              maxLength={9}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="9 dígitos"
            />
            {cedulaStatus === 'loading' && (
              <p className="text-sm text-blue-500 mt-1">Verificando cédula...</p>
            )}
            {cedulaStatus === 'valid' && cedulaInfo && (
              <p className="text-sm text-green-600 mt-1 font-medium">
                {cedulaInfo.name} {cedulaInfo.lastName}
              </p>
            )}
            {cedulaStatus === 'invalid' && (
              <p className="text-sm text-red-600 mt-1">{cedulaError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || cedulaStatus === 'loading' || cedulaStatus === 'invalid' || cedulaStatus === 'idle'}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Completar registro'}
          </button>
        </form>
      </div>
    </div>
  );
};
