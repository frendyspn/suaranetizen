import React, {useState, useEffect} from 'react';
import axios from '../../axios';
import LoginForm from '../user/LoginForm';   // ← path relatif ke file ini
import AuthLayout from '../../layouts/AuthLayout'; // opsional, kalau Anda punya layout khusus
import { useNavigate } from 'react-router-dom';
/**
 * Halaman Login – hanya membungkus LoginForm di dalam layout.
 */
export default function LoginPage() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cek apakah user sudah login
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); // Redirect ke halaman utama jika sudah login
        }
    }, [navigate]);

    const handleLogin = async (email, password) => {
        setError('');
        try {
            const res = await axios.post('/user/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            navigate('/'); // Redirect ke halaman utama setelah login
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    };


  return (
    <AuthLayout>        {/* Hapus jika tidak pakai layout */}
      <div className="d-flex justify-content-center align-items-center m-5" style={{ minHeight: '100vh' }}>
        <div className="card p-4" style={{ width: 400 }}>
          <h4 className="mb-3">Login</h4>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {/* Gunakan LoginForm untuk menangani login */}
        <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </AuthLayout>
  );
}
