import { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { api } from '../../lib/api';

type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data?.valid) {
          setUser(data.admin);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <AdminDashboard user={user} /> : <AdminLogin />;
}
