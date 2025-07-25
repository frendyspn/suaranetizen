import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import { WEB_NAME } from '../../constants';

import GallerySlideshow from '../../components/GallerySlideshow';

const HomePage = () => {
    const [form, setForm] = useState({ 
        kalimat: '', 
        kategori_ids: [], 
        custom_name: ''
    });
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const [userInfo, setUserInfo] = useState(null); // Add user info state
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState('');
    const [kategoriList, setKategoriList] = useState([]);
    const [pengantar, setPengantar] = useState('');
    const [remainingChars, setRemainingChars] = useState(30);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/kategori').then(res => {
            setKategoriList(res.data);
        });

        axios.get('/user/introduction').then(res => setPengantar(res.data?.content || ''));

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
            setUserInfo(res.data.user);
        } catch (err) {
            console.error('Failed to fetch user info:', err);
            // If token is invalid, clear it
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUserToken(null);
                setUserInfo(null);
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        
        if (name === 'kalimat') {
            // Validate max 30 characters
            if (value.length <= 30) {
                setForm({ ...form, [name]: value });
                setRemainingChars(30 - value.length);
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // Handle checkbox change for categories
    const handleKategoriChange = (kategoriId) => {
        const { kategori_ids } = form;
        const updatedKategoriIds = kategori_ids.includes(kategoriId)
            ? kategori_ids.filter(id => id !== kategoriId)
            : [...kategori_ids, kategoriId];
        
        setForm({ ...form, kategori_ids: updatedKategoriIds });
    };

    // Handle select all categories
    const handleSelectAllKategori = () => {
        const allKategoriIds = kategoriList.map(kategori => kategori.id);
        setForm({ ...form, kategori_ids: allKategoriIds });
    };

    // Handle clear all categories
    const handleClearAllKategori = () => {
        setForm({ ...form, kategori_ids: [] });
    };

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

        if (form.kalimat.length > 30) {
            setError('Kata-kata maksimal 30 karakter');
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

            const res = await axios.post('/user/polling', formData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            navigate(`/polling/${res.data.polling.id}`);
        } catch (err) {
            console.log(err.response);
            if (err.response?.status === 401) {
                localStorage.setItem('user_token', '');
                setUserToken(null);
                setUserInfo(null);
                setError('silakan login kembali');
                setShowLogin(true);
                return;
            }
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    };

    const handleSubmitPollingFree = async () => {
        console.log('Free Poling')
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

        if (form.kalimat.length > 30) {
            setError('Kata-kata maksimal 30 karakter');
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
                localStorage.setItem('user_token', '');
                setUserToken(null);
                setUserInfo(null);
                setError('silakan login kembali');
                setShowLogin(true);
                return;
            }
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    }

    const handleLogin = async (email, password) => {
        setError('');
        try {
            const res = await axios.post('/user/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setUserToken(token);
            setUserInfo(res.data.user); // Set user info from login response
            setShowLogin(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserToken(null);
        setUserInfo(null);
        setShowLogin(true);
        setForm({ kalimat: '', kategori_ids: [], custom_name: '' }); // Reset form
    };

    return (
        <>
        <GallerySlideshow />
        
        <div className="rounded p-5" style={{ backgroundColor: '#3053a7' }}>
            <div className='row'>
                <div className='col-md-12 col-sm-12 text-center py-5' style={{ alignContent: 'center' }}>
                    <div className='text-white' dangerouslySetInnerHTML={{ __html: pengantar }} />
                    <hr className='border-white' />
                </div>
                <div className='col-md-4 col-sm-12 text-center' style={{ alignContent: 'center' }}>
                    <h4 className='text-white'>{WEB_NAME}</h4>
                    
                    {/* Welcome Message for Logged In User */}
                    {userToken && userInfo && (
                        <div className="card mt-4 p-3 m-5 bg-success bg-opacity-10 border-success">
                            <div className="d-column align-items-center justify-content-between">
                                <div className="text-start">
                                    <h5 className="text-white mb-1">
                                        <i className="ph ph-user-circle me-2"></i>
                                        Hello, {userInfo.name}!
                                    </h5>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <i className="ph ph-sign-out"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Login/Register Forms - Only show if not logged in */}
                    {!userToken && (
                        <div className="card mt-4 p-3 m-5">
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
                                        onSuccess={(token, user) => {
                                            setUserToken(token);
                                            setUserInfo(user); // Set user info from register response
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
                <div className='col-md-8 col-sm-12'>
                    <div className='bg-white rounded m-5 p-3'>
                        <h5 className='mt-5'>Buat Kata-kata/Quote/Pesan</h5>
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {/* Show message if not logged in */}
                        {!userToken && (
                            <div className="alert alert-warning d-flex align-items-center mb-4">
                                <i className="ph ph-warning-circle me-2"></i>
                                <div>
                                    <strong>Perhatian:</strong> Silakan login terlebih dahulu untuk membuat kata-kata/quote/pesan.
                                </div>
                            </div>
                        )}
                        
                        {/* Category Selection - Simple Checkbox List */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label fw-bold mb-0">
                                    <i className="ph ph-folder-open me-2 text-primary"></i>
                                    Pilih Kategori (bisa lebih dari satu):
                                </label>
                                <div className="btn-group btn-group-sm" role="group">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={handleSelectAllKategori}
                                        disabled={form.kategori_ids.length === kategoriList.length || !userToken}
                                    >
                                        <i className="ph ph-check-square me-1"></i>
                                        Pilih Semua
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={handleClearAllKategori}
                                        disabled={form.kategori_ids.length === 0 || !userToken}
                                    >
                                        <i className="ph ph-x-square me-1"></i>
                                        Hapus Semua
                                    </button>
                                </div>
                            </div>

                            {/* Categories Grid */}
                            <div 
                                className={`categories-container p-3 border rounded ${!userToken ? 'opacity-50' : ''}`}
                                style={{ 
                                    backgroundColor: '#f8f9fa',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}
                            >
                                {kategoriList.length > 0 ? (
                                    <div className="row g-2">
                                        {kategoriList.map(kategori => (
                                            <div key={kategori.id} className="col-md-6 col-12">
                                                <div 
                                                    className={`d-flex align-items-center p-3 rounded transition-all ${
                                                        form.kategori_ids.includes(kategori.id) 
                                                            ? 'bg-primary bg-opacity-10 border border-primary' 
                                                            : 'bg-white border border-light hover-shadow'
                                                    }`}
                                                    style={{ 
                                                        cursor: userToken ? 'pointer' : 'not-allowed',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onClick={() => userToken && handleKategoriChange(kategori.id)}
                                                >
                                                    <input
                                                        className="form-check-input me-3 flex-shrink-0"
                                                        type="checkbox"
                                                        id={`kategori-${kategori.id}`}
                                                        checked={form.kategori_ids.includes(kategori.id)}
                                                        onChange={() => userToken && handleKategoriChange(kategori.id)}
                                                        disabled={!userToken}
                                                        style={{ cursor: userToken ? 'pointer' : 'not-allowed' }}
                                                    />
                                                    <label 
                                                        className="form-check-label fw-medium flex-grow-1" 
                                                        htmlFor={`kategori-${kategori.id}`}
                                                        style={{ cursor: userToken ? 'pointer' : 'not-allowed' }}
                                                    >
                                                        <i className="ph ph-tag me-2 text-primary"></i>
                                                        {kategori.nama}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-3">
                                        <i className="ph ph-folder-simple-dashed display-4 mb-2"></i>
                                        <p className="mb-0">Tidak ada kategori tersedia</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Textarea with character limit */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                <i className="ph ph-chat-circle-text me-2 text-primary"></i>
                                Kata-kata/Quote/Pesan:
                            </label>
                            <textarea
                                name="kalimat"
                                placeholder="Tulis Kata-kata Anda di sini (maksimal 30 karakter)..."
                                className="form-control"
                                value={form.kalimat}
                                onChange={handleChange}
                                rows={3}
                                maxLength={30}
                                disabled={!userToken}
                                style={{ resize: 'none' }}
                            />
                            <div className="d-flex justify-content-between mt-1">
                                <small className={`${remainingChars < 5 ? 'text-danger' : 'text-muted'}`}>
                                    <i className="ph ph-clock me-1"></i>
                                    Sisa karakter: {remainingChars}
                                </small>
                                <small className="text-muted">
                                    {form.kalimat.length}/30
                                </small>
                            </div>
                            
                            {remainingChars < 5 && remainingChars >= 0 && userToken && (
                                <small className="text-warning d-block mt-1">
                                    <i className="ph ph-warning me-1"></i>
                                    Karakter hampir habis!
                                </small>
                            )}
                        </div>

                        {/* Custom Name Input - Always Visible and Required */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                <i className="ph ph-user-circle me-2 text-primary"></i>
                                Nama yang akan ditampilkan:
                                <span className="text-danger ms-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="custom_name"
                                className={`form-control ${!form.custom_name.trim() && form.custom_name !== '' ? 'is-invalid' : ''}`}
                                placeholder="Masukkan nama yang ingin ditampilkan..."
                                value={form.custom_name}
                                onChange={handleChange}
                                maxLength={100}
                                disabled={!userToken}
                                required
                            />
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">
                                    <i className="ph ph-info me-1"></i>
                                    Nama ini yang akan muncul pada quote Anda
                                </small>
                                <small className="text-muted">
                                    {form.custom_name.length}/100
                                </small>
                            </div>
                            {!form.custom_name.trim() && form.custom_name !== '' && userToken && (
                                <div className="invalid-feedback">
                                    Nama untuk ditampilkan tidak boleh kosong
                                </div>
                            )}
                        </div>
                        
                        {/* Submit Buttons */}
                        <div className='row g-2'>
                            <div className='col-sm-12 col-md-6'>
                                <button 
                                    className="btn btn-success w-100 py-3" 
                                    onClick={handleSubmitPolling}
                                    disabled={!userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim()}
                                >
                                    <i className="ph ph-heart-straight-fill me-2"></i>
                                    Donasi & Kirim Kata-kata
                                </button>
                            </div>

                            <div className='col-sm-12 col-md-6'>
                                <button 
                                    className="btn btn-secondary w-100 py-3" 
                                    onClick={handleSubmitPollingFree}
                                    disabled={!userToken || !form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim()}
                                >
                                    <i className="ph ph-paper-plane me-2"></i>
                                    Ikut Polling Tanpa Donasi
                                </button>
                            </div>
                        </div>
                        
                        {/* Form Validation Helper */}
                        {userToken && (!form.kalimat.trim() || form.kategori_ids.length === 0 || !form.custom_name.trim()) && (
                            <div className="alert alert-info mt-3 d-flex align-items-center">
                                <i className="ph ph-lightbulb me-2"></i>
                                <div>
                                    <strong>Tips:</strong> 
                                    {!form.kalimat.trim() && ' Tulis kata-kata Anda terlebih dahulu.'}
                                    {form.kategori_ids.length === 0 && ' Pilih minimal satu kategori.'}
                                    {!form.custom_name.trim() && ' Masukkan nama yang ingin ditampilkan.'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default HomePage;
