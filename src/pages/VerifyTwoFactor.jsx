import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const VerifyTwoFactor = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const tempToken = sessionStorage.getItem('tempToken');

  useEffect(() => {
    if (!tempToken) {
      navigate('/login');
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [tempToken, navigate]);

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Ingresá los 6 dígitos del código.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/verify-2fa', { tempToken, code });
      sessionStorage.removeItem('tempToken');
      login(response.data.user, response.data.accessToken);
      navigate('/');
    } catch (err) {
      setLoading(false);
      const status = err.response?.status;
      if (status === 400) {
        setError('El código expiró. Iniciá sesión de nuevo.');
        sessionStorage.removeItem('tempToken');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Código incorrecto. Intentá de nuevo.');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Verificación</h1>
        <p className="text-gray-500 text-center text-sm" style={{ marginBottom: '2rem' }}>
          Ingresá el código de 6 dígitos enviado a tu teléfono.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400 font-semibold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2" style={{ marginBottom: '2rem' }} onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            ))}
          </div>

          <div style={{ height: '2rem' }} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          ¿No recibiste el código?{' '}
          <button
            onClick={() => { sessionStorage.removeItem('tempToken'); navigate('/login'); }}
            className="text-blue-500 hover:underline"
          >
            Volver al login
          </button>
        </p>
      </div>
    </div>
  );
};
