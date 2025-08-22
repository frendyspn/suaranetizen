import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import { WEB_NAME } from '../../constants';

const HomePage = () => {
    const [kategoriList, setKategoriList] = useState([]);
    const [pengantar, setPengantar] = useState('');
    const [form, setForm] = useState({ 
        kalimat: '', 
        kategori_ids: [], 
        custom_name: ''
    });
    const [remainingChars, setRemainingChars] = useState(210);
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    // Local state for auth
    const [userToken, setUserToken] = useState(localStorage.getItem('user_token'));
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/kategori').then(res => {
            setKategoriList(res.data);
        });

        axios.get('/user/introduction').then(res => {
            setPengantar(res.data?.content || '');
        });

        // Fetch user info if token exists
        if (userToken) {
            fetchUserInfo();
        }
    }, [userToken]);

    // Function to fetch user information
    const fetchUserInfo = async () => {
        try {
            const res = await axios.get('/user/profile', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setUserInfo(res.data);
        } catch (err) {
            console.error('Error fetching user info:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('user_token');
                setUserToken(null);
                setUserInfo(null);
            }
        }
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'kalimat') {
            setRemainingChars(210 - value.length);
        }
    };

    // Handle login
    const handleLogin = (userData) => {
        setUserToken(userData.token);
        setUserInfo(userData.user);
        localStorage.setItem('user_token', userData.token);
        setError('');
    };

    // Handle register
    const handleRegister = (userData) => {
        setUserToken(userData.token);
        setUserInfo(userData.user);
        localStorage.setItem('user_token', userData.token);
        setShowRegister(false);
        setShowLogin(false);
        setError('');
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user_token');
        setUserToken(null);
        setUserInfo(null);
        setForm({ kalimat: '', kategori_ids: [], custom_name: '' });
        setShowLogin(true);
        setShowRegister(false);
    };

    // Handle submit polling with payment
    const handleSubmitPolling = async () => {
        setError('');
        
        // Validation
        if (!userToken) {
            setError('Silahkan Login Lebih Dahulu');
            return;
        }

        if (!form.kalimat.trim()) {
            setError('Kata-kata tidak boleh kosong');
            return;
        }

        if (form.kalimat.length > 210) {
            setError('Kata-kata maksimal 210 karakter');
            return;
        }

        if (form.kategori_ids.length === 0) {
            setError('Pilih minimal satu kategori');
            return;
        }

        if (!form.custom_name.trim()) {
            setError('Nama untuk ditampilkan tidak boleh kosong');
            return;
        }

        setShowPaymentPopup(true);
    };

    // Handle submit polling free (without donation)
    const handleSubmitPollingFree = async () => {
        console.log('Free Polling');
        setError('');
        
        // Validation
        if (!userToken) {
            setError('Silahkan Login Lebih Dahulu');
            return;
        }

        if (!form.kalimat.trim()) {
            setError('Kata-kata tidak boleh kosong');
            return;
        }

        if (form.kalimat.length > 210) {
            setError('Kata-kata maksimal 210 karakter');
            return;
        }

        if (form.kategori_ids.length === 0) {
            setError('Pilih minimal satu kategori');
            return;
        }

        if (!form.custom_name.trim()) {
            setError('Nama untuk ditampilkan tidak boleh kosong');
            return;
        }

        try {
            // Always set is_anonymous to true since we're using custom name
            const formData = {
                ...form,
                is_anonymous: true
            };

            const res = await axios.post('/user/polling-free', formData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            navigate(`/polling/${res.data.polling.id}`);
        } catch (err) {
            console.log(err.response);
            if (err.response?.status === 401) {
                localStorage.removeItem('user_token');
                setUserToken(null);
                setUserInfo(null);
                setError('silakan login kembali');
                setShowLogin(true);
                return;
            }
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    };

    // Handle confirm payment and submit
    const handleConfirmPayment = async () => {
        try {
            const formData = {
                ...form,
                is_anonymous: true
            };

            const res = await axios.post('/user/polling', formData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            setShowPaymentPopup(false);
            navigate(`/polling/${res.data.polling.id}`);
        } catch (err) {
            console.log(err.response);
            if (err.response?.status === 401) {
                localStorage.removeItem('user_token');
                setUserToken(null);
                setUserInfo(null);
                setError('silakan login kembali');
                setShowLogin(true);
                setShowPaymentPopup(false);
                return;
            }
            setError(err.response?.data?.message || 'Gagal submit polling');
            setShowPaymentPopup(false);
        }
    };

    return (
        <>
            {/* Main Content */}
            <div className="main-content-mobile" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: '20px' // Normal padding karena tidak ada fixed elements lagi
            }}>
                {/* Login/User Box */}
                {!userToken ? (
                    <div style={{
                        width: '300px',
                        border: '1px solid #ccc',
                        padding: '20px',
                        margin: '10px',
                        background: '#f5f9ff',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        {error && (
                            <div style={{ color: 'red', fontSize: '14px', marginBottom: '5px' }}>
                                {error}
                            </div>
                        )}
                        
                        {showLogin && !showRegister && (
                            <>
                                <h3>Login</h3>
                                <LoginForm onLogin={handleLogin} />
                                <p style={{ textAlign: 'center' }}>
                                    <a
                                        onClick={() => {
                                            setShowRegister(true);
                                            setShowLogin(false);
                                        }}
                                        style={{
                                            fontSize: '16px',
                                            textDecoration: 'none',
                                            color: '#0066ff',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Registrasi Baru!
                                    </a>
                                </p>
                            </>
                        )}
                        
                        {showRegister && (
                            <>
                                <h3>Registrasi</h3>
                                <RegisterForm onRegister={handleRegister} />
                                <p style={{ textAlign: 'center' }}>
                                    <a
                                        onClick={() => {
                                            setShowLogin(true);
                                            setShowRegister(false);
                                        }}
                                        style={{
                                            fontSize: '16px',
                                            textDecoration: 'none',
                                            color: '#0066ff',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Sudah punya akun? Login
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{
                        width: '300px',
                        border: '1px solid #ccc',
                        padding: '20px',
                        margin: '10px',
                        background: '#f5f9ff',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <h3 id="welcomeMessage">Hai, {userInfo?.user?.name}!</h3>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '15px',
                                background: '#ff4d4d',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout / Keluar
                        </button>
                    </div>
                )}

                {/* Polling Form */}
                <div style={{
                    flex: 1,
                    minWidth: '300px',
                    maxWidth: '500px',
                    margin: '10px',
                    border: '1px solid #ccc',
                    padding: '20px'
                }}>
                    <h3>Buat Kata-kata Anda hari ini untuk dijadikan billboard dan diterbitkan di Jantung Ibu Kota! (perlu login)</h3>
                    
                    <p>Pilih Kategori:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                        {kategoriList.map((kategori) => (
                            <label key={kategori.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <input
                                    type="radio"
                                    name="kategori"
                                    value={kategori.id}
                                    checked={form.kategori_ids.includes(kategori.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setForm(prev => ({
                                                ...prev,
                                                kategori_ids: [kategori.id]
                                            }));
                                        }
                                    }}
                                    disabled={!userToken}
                                />
                                {kategori.nama}
                            </label>
                        ))}
                    </div>

                    <textarea
                        value={form.kalimat}
                        onChange={handleChange}
                        name="kalimat"
                        maxLength={210}
                        placeholder="Tulis Kata-kata Anda di sini (maksimal 210 karakter)..."
                        style={{
                            width: '100%',
                            margin: '5px 0',
                            padding: '8px',
                            resize: 'vertical',
                            minHeight: '50px',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            boxSizing: 'border-box'
                        }}
                        disabled={!userToken}
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => {
                            if (e.target.value.trim() === '') {
                                e.target.placeholder = 'Tulis Kata-kata Anda di sini (maksimal 210 karakter)...';
                            }
                        }}
                    />
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>
                        <span>{form.kalimat.length}</span>/210 karakter
                    </div>

                    <input
                        type="text"
                        name="custom_name"
                        value={form.custom_name}
                        onChange={handleChange}
                        placeholder="Nama Anda"
                        style={{ 
                            width: '100%', 
                            margin: '5px 0', 
                            padding: '8px',
                            boxSizing: 'border-box'
                        }}
                        disabled={!userToken}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                        <button
                            onClick={handleSubmitPolling}
                            disabled={!userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim()}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#0066cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: userToken && form.kalimat.trim() && form.kategori_ids.length > 0 && form.custom_name.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                opacity: !userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim() ? 0.6 : 1
                            }}
                        >
                            Kirim Kata-kata & Donasi
                        </button>
                        
                        <button
                            onClick={handleSubmitPollingFree}
                            disabled={!userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim()}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: !userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim() ? '#cccccc' : '#f8f9fa',
                                color: !userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim() ? '#666666' : '#0066cc',
                                border: '2px solid #0066cc',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                textDecoration: 'none',
                                cursor: userToken && form.kalimat.trim() && form.kategori_ids.length > 0 && form.custom_name.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                display: 'block',
                                opacity: !userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim() ? 0.6 : 1
                            }}
                        >
                            Ikut Polling Tanpa Donasi
                        </button>
                    </div>
                </div>

                {/* Payment Popup */}
                {showPaymentPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 3000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '25px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%'
                        }}>
                            <h3 style={{ marginTop: 0, color: '#0066cc' }}>Pembayaran Donasi</h3>
                            <p>Scan QRIS berikut untuk melakukan pembayaran:</p>
                            <img
                                src="/assets/images/QRIS.jpeg"
                                alt="QRIS GoPay"
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    height: 'auto',
                                    margin: '15px auto',
                                    border: '1px solid #ddd',
                                    display: 'block'
                                }}
                            />
                            <p style={{
                                fontFamily: 'Arial, sans-serif',
                                background: '#f5f5f5',
                                padding: '8px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                margin: '10px auto',
                                maxWidth: '300px'
                            }}>
                                SUARANETIZEN.CO.ID<br />
                                NMID: ID1025419946161
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '20px',
                                gap: '10px'
                            }}>
                                <button
                                    onClick={handleConfirmPayment}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease',
                                        background: '#28a745',
                                        color: 'white'
                                    }}
                                >
                                    Kirim
                                </button>
                                <button
                                    onClick={() => setShowPaymentPopup(false)}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease',
                                        background: '#ff4d4d',
                                        color: 'white'
                                    }}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', marginTop: '20px' }}>
                &copy; 2025 SuaraNetizen. All rights reserved.
            </footer>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
                
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
                }
                
                button:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                button:disabled {
                    background: #cccccc !important;
                    color: #666666 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                    box-shadow: none !important;
                }

                /* Placeholder styling untuk konsistensi dengan template */
                input[type="text"]::placeholder,
                input[type="email"]::placeholder,
                input[type="password"]::placeholder,
                textarea::placeholder {
                    color: #999;
                    opacity: 1;
                    font-style: italic;
                }

                input[type="text"]:focus::placeholder,
                input[type="email"]:focus::placeholder,
                input[type="password"]:focus::placeholder,
                textarea:focus::placeholder {
                    opacity: 0;
                }

                /* Input styling konsisten dengan template */
                input[type="text"],
                input[type="email"], 
                input[type="password"],
                textarea {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }

                input[type="text"]:focus,
                input[type="email"]:focus,
                input[type="password"]:focus,
                textarea:focus {
                    border-color: #0066cc;
                    outline: none;
                    box-shadow: 0 0 3px rgba(0, 102, 204, 0.3);
                }

                input[type="text"]:disabled,
                input[type="email"]:disabled,
                input[type="password"]:disabled,
                textarea:disabled {
                    background-color: #f5f5f5;
                    color: #999;
                    cursor: not-allowed;
                }
            `}</style>
        </>
    );
};

export default HomePage;
