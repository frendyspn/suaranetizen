import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import { WEB_NAME } from '../../constants';

import GallerySlideshow from '../../components/GallerySlideshow';

import  '../../components/DropdownMultiSelect.css';

const HomePage = () => {
    const [form, setForm] = useState({ 
        kalimat: '', 
        kategori_ids: [], 
        is_anonymous: false 
    });
    const [userToken, setUserToken] = useState(localStorage.getItem('token'));
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState('');
    const [kategoriList, setKategoriList] = useState([]);
    const [pengantar, setPengantar] = useState('');
    const [remainingChars, setRemainingChars] = useState(30);
    const [showDropdown, setShowDropdown] = useState(false); // New state for dropdown

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/user/kategori').then(res => {
            setKategoriList(res.data);
        });

        axios.get('/user/introduction').then(res => setPengantar(res.data?.content || ''));
    }, []);

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

    // Get selected category names for display
    const getSelectedKategoriNames = () => {
        if (form.kategori_ids.length === 0) return 'Pilih kategori...';
        if (form.kategori_ids.length === 1) {
            const kategori = kategoriList.find(k => k.id === form.kategori_ids[0]);
            return kategori?.nama || '';
        }
        return `${form.kategori_ids.length} kategori dipilih`;
    };

    // Handle anonymous checkbox
    const handleAnonymousChange = (e) => {
        setForm({ ...form, is_anonymous: e.target.checked });
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

        try {
            const res = await axios.post('/user/polling', form, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            navigate(`/polling/${res.data.polling.id}`);
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

        try {
            const res = await axios.post('/user/polling-free', form, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            navigate(`/polling/${res.data.polling.id}`);
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
    }

    const handleLogin = async (email, password) => {
        setError('');
        try {
            const res = await axios.post('/user/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setUserToken(token);
            setShowLogin(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login');
        }
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
                <div className='col-md-8 col-sm-12'>
                    <div className='bg-white rounded m-5 p-3'>
                        <h5 className='mt-5'>Buat Kata-kata/Quote/Pesan</h5>
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {/* Multiple Category Selection Dropdown with Checkbox Style */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Pilih Kategori (bisa lebih dari satu):</label>
                            <div className="dropdown-multiple-select">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{ 
                                        backgroundColor: 'white',
                                        borderColor: '#ced4da',
                                        color: form.kategori_ids.length === 0 ? '#6c757d' : '#212529'
                                    }}
                                >
                                    <span>{getSelectedKategoriNames()}</span>
                                    <i className={`ph ph-caret-${showDropdown ? 'up' : 'down'}`}></i>
                                </button>
                                
                                {showDropdown && (
                                    <div 
                                        className="dropdown-menu show w-100 p-2" 
                                        style={{ 
                                            position: 'absolute', 
                                            zIndex: 1000,
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.375rem',
                                            boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
                                        }}
                                    >
                                        {kategoriList.map(kategori => (
                                            <div key={kategori.id} className="dropdown-item p-1">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`kategori-${kategori.id}`}
                                                        checked={form.kategori_ids.includes(kategori.id)}
                                                        onChange={() => handleKategoriChange(kategori.id)}
                                                    />
                                                    <label 
                                                        className="form-check-label w-100" 
                                                        htmlFor={`kategori-${kategori.id}`}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {kategori.nama}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {form.kategori_ids.length > 0 && (
                                            <div className="dropdown-divider"></div>
                                        )}
                                        
                                        {/* Action buttons - always show */}
                                        <div className="dropdown-item-text text-center">
                                            {form.kategori_ids.length > 0 && (
                                                <>
                                                    <small className="text-muted mb-2 d-block">
                                                        <i className="ph ph-check-circle me-1"></i>
                                                        {form.kategori_ids.length} kategori dipilih
                                                    </small>
                                                </>
                                            )}
                                            
                                            <div className="d-flex gap-2 justify-content-center">
                                                {form.kategori_ids.length > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => setForm({ ...form, kategori_ids: [] })}
                                                    >
                                                        <i className="ph ph-x me-1"></i>
                                                        Hapus Semua
                                                    </button>
                                                )}
                                                
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <i className="ph ph-check me-1"></i>
                                                    Konfirmasi
                                                </button>
                                            </div>
                                            
                                            {form.kategori_ids.length === 0 && (
                                                <small className="text-muted mt-1 d-block">
                                                    Pilih minimal satu kategori untuk melanjutkan
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Selected categories preview */}
                            {form.kategori_ids.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">Kategori dipilih:</small>
                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                        {form.kategori_ids.map(id => {
                                            const kategori = kategoriList.find(k => k.id === id);
                                            return (
                                                <span key={id} className="badge bg-primary">
                                                    {kategori?.nama}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white ms-1"
                                                        style={{ fontSize: '0.7em' }}
                                                        onClick={() => handleKategoriChange(id)}
                                                        aria-label="Remove"
                                                    ></button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Textarea with character limit - same as before */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Kata-kata/Quote/Pesan:</label>
                            <textarea
                                name="kalimat"
                                placeholder="Tulis Kata-kata Anda di sini (maksimal 30 karakter)..."
                                className="form-control"
                                value={form.kalimat}
                                onChange={handleChange}
                                rows={3}
                                maxLength={30}
                            />
                            <div className="d-flex justify-content-between mt-1">
                                <small className={`${remainingChars < 5 ? 'text-danger' : 'text-muted'}`}>
                                    Sisa karakter: {remainingChars}
                                </small>
                                <small className="text-muted">
                                    {form.kalimat.length}/30
                                </small>
                            </div>
                        </div>

                        {/* Anonymous Option - same as before */}
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="anonymous-check"
                                    checked={form.is_anonymous}
                                    onChange={handleAnonymousChange}
                                />
                                <label className="form-check-label" htmlFor="anonymous-check">
                                    <i className="ph ph-mask me-1"></i>
                                    Tulis Sebagai Anonim
                                </label>
                            </div>
                            <small className="text-muted">
                                Jika dicentang, nama Anda tidak akan ditampilkan pada polling ini
                            </small>
                        </div>
                        
                        <div className='row'>
                            <div className='col-sm-12 col-md-6 mb-2'>
                            <button 
                            className="btn btn-success w-100" 
                            onClick={handleSubmitPolling}
                            disabled={!form.kalimat.trim() || form.kategori_ids.length === 0}
                        >
                            <i className="ph ph-paper-plane me-2"></i>
                            Donasi & Kirim Kata-kata
                        </button>
                        </div>

                        <div className='col-sm-12 col-md-6 mb-2'>
                        <button 
                            className="btn btn-secondary w-100" 
                            onClick={handleSubmitPollingFree}
                            disabled={!form.kalimat.trim() || form.kategori_ids.length === 0}
                        >
                            <i className="ph ph-paper-plane me-2"></i>
                            Ikut Polling Tanpa Donasi
                        </button>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default HomePage;
