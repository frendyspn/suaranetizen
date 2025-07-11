import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const HomePage = () => {
    const [form, setForm] = useState({ kalimat: '', kategori_id: '' });
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState('');
    const [kategoriList, setKategoriList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/kategori').then(res => {
            setKategoriList(res.data);
        });
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmitPolling = async () => {
        setError('');
        if (!userToken) {
            setShowLogin(true);
            return;
        }

        try {
            const res = await axios.post('/user/polling', form, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            
            navigate(`/polling/${res.data.polling.id}`);
            // Simulasikan QR muncul
            // setQrisImage('/assets/images/qris.jpg');
        } catch (err) {
            console.log(err.response);
            if (err.response?.status === 401) {
                localStorage.setItem('user_token', '');
                setUserToken(null);
                setError('silakan login kembali');
                setShowLogin(true);
                return;
            }
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    };

    const handleLogin = async (email, password) => {
        setError('');
        try {
            const res = await axios.post('/user/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setUserToken(token);
            setShowLogin(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    };

    return (
        <div className="container">
            <h3>Kirim Polling </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <textarea
                name="kalimat"
                placeholder="Tulis polling anda..."
                className="form-control mb-2"
                value={form.kalimat}
                onChange={handleChange}
            />
            <select
                name="kategori_id"
                className="form-select mb-3"
                value={form.kategori_id}
                onChange={handleChange}
            >
                <option value="">Pilih Kategori</option>
                {kategoriList.map(k => (
                    <option key={k.id} value={k.id}>
                        {k.nama}
                    </option>
                ))}
                {/* Dinamis jika kamu punya API kategori */}
            </select>
            <button className="btn btn-success" onClick={handleSubmitPolling}>
                Donasi & Kirim Polling
            </button>

            {!userToken && (
                <div className="card mt-4 p-3">
                    {showLogin && (
                        <>
                            <h5>Login</h5>
                            <LoginForm onLogin={handleLogin} />
                            <div className="mt-2">
                                Belum punya akun?{' '}
                                <button
                                    className="btn-link p-0"
                                    onClick={() => {
                                        setShowRegister(true);
                                        setShowLogin(false);
                                    }}
                                >
                                    Daftar di sini
                                </button>
                            </div>
                        </>
                    )}

                    {showRegister && (
                        <>
                            <h5>Registrasi</h5>
                            <RegisterForm
                                onSuccess={(token) => {
                                    setUserToken(token);
                                    setShowRegister(false);
                                }}
                            />
                            <div className="mt-2">
                                Sudah punya akun?{' '}
                                <button
                                    className="btn-link p-0"
                                    onClick={() => {
                                        setShowLogin(true);
                                        setShowRegister(false);
                                    }}
                                >
                                    Login di sini
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            
        </div>
    );
};

export default HomePage;
