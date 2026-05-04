import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cedulaStatus === 'loading' || cedulaStatus === 'invalid' || cedulaStatus === 'idle'}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

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
