import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const Register = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [cedulaStatus, setCedulaStatus] = useState('idle'); // idle | loading | valid | invalid
  const [cedulaInfo, setCedulaInfo] = useState(null); // { name, lastName }
  const [cedulaError, setCedulaError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cedulaTimerRef = useRef(null);

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

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 8) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (formData.phone.length !== 8) {
      setError('Ingresá un número de teléfono válido de 8 dígitos.');
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/register', {
        cedula: formData.cedula,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      navigate('/check-email');
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 502) {
        setError('Error al enviar correo de verificación. Intentá de nuevo más tarde.');
      } else if (status === 400) {
        setError(data?.message || 'Datos inválidos. Verificá la información ingresada.');
      } else if (data?.errors?.length) {
        setError(data.errors.map((e) => e.msg).join(', '));
      } else {
        setError('Error en el registro. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Registrarse</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400 font-semibold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cédula */}
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="tu@email.com"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              inputMode="numeric"
              maxLength={8}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="8 dígitos"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cedulaStatus === 'loading' || cedulaStatus === 'invalid' || cedulaStatus === 'idle'}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-sm text-gray-400">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/google`; }}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <p className="text-center mt-4 text-sm">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
