import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await api.post('/auth/login', {
        data: {
          email: normalizedEmail,
          password,
        },
      });

      if (data?.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin';
      } else {
        throw new Error('Connexion impossible. Vérifiez vos identifiants.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-teal-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img
              src="./src/favicon_io/Logo28.jpeg"
              alt="logo Zone Baptiste Agapé"
              className='rounded-full w-16 h-16 bg-teal-700 hover:bg-teal-600 flex object-cover'
            />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Espace Admin</h1>
          <p className="text-teal-300 text-sm mt-1">Zone Baptiste Agapé — ZOBA</p>
        </div>

        <form onSubmit={login} className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="admin@zoba-cbt.org"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
