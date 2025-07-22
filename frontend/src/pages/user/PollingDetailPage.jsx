import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../axios';

const PollingDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [polling, setPolling] = useState(null);
    const [nominal, setNominal] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('user_token');

    const navigate = useNavigate();

    // Ambil parameter dari query string
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('order_id');
    const statusCode = searchParams.get('status_code');
    const transactionStatus = searchParams.get('transaction_status');

    useEffect(() => {
        axios.get(`/user/polling/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setPolling(res.data));
    }, [id, token]);

    const handleUpdateStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/user/polling/${id}/update-status-payment`, { orderId, statusCode, transactionStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Status updated:', res.data);
            navigate(`/quote/${res.data?.donasi_id}`);
        } catch (err) {
            alert('Gagal Update data');
        } finally {
            setLoading(false);
        }
    }, [id, orderId, statusCode, transactionStatus, token, navigate]);

    useEffect(() => {
        if (orderId && statusCode && transactionStatus) {
            handleUpdateStatus();
            console.log('Ada parameter Midtrans:', { orderId, statusCode, transactionStatus });
        }
    }, [orderId, statusCode, transactionStatus, handleUpdateStatus]);

    const handleGenerateQris = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/user/polling/${id}/generate-qris`, { nominal }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPolling(res.data);
        } catch (err) {
            alert('Gagal generate QRIS');
        } finally {
            setLoading(false);
        }
    };

    // Function untuk menentukan status dan label
    const getPollingStatus = () => {
        if (polling.nominal === 0 || polling.nominal === null) {
            return {
                status: 'free',
                label: 'Tanpa Donasi',
                badgeClass: 'bg-info',
                icon: 'ph-gift'
            };
        }
        
        if (polling.status === 'paid') {
            return {
                status: 'paid',
                label: 'Sudah Dibayar',
                badgeClass: 'bg-success',
                icon: 'ph-check-circle'
            };
        }
        
        return {
            status: 'pending',
            label: 'Menunggu Pembayaran',
            badgeClass: 'bg-warning',
            icon: 'ph-clock'
        };
    };

    // Function untuk menampilkan kategori
    const renderKategoris = () => {
        if (!polling.kategoris || polling.kategoris.length === 0) {
            return <span className="text-muted">Tidak ada kategori</span>;
        }

        if (polling.kategoris.length === 1) {
            return <span className="badge bg-primary">{polling.kategoris[0].nama}</span>;
        }

        return (
            <div className="d-flex flex-wrap gap-1">
                {polling.kategoris.map((kategori, index) => (
                    <span key={kategori.id} className="badge bg-primary">
                        {kategori.nama}
                    </span>
                ))}
            </div>
        );
    };

    // Function untuk menampilkan nama user
    const renderUserName = () => {
        if (polling.is_anonymous) {
            return (
                <span className="text-muted">
                    <i className="ph ph-mask me-1"></i>
                    Anonim
                </span>
            );
        }

        return polling.display_name || 'Unknown User';
    };

    if (!polling) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Memuat detail polling...</p>
                </div>
            </div>
        );
    }

    const statusInfo = getPollingStatus();

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title mb-0">
                                <i className="ph ph-chat-circle-text me-2"></i>
                                Detail Polling
                            </h3>
                        </div>
                        <div className="card-body">
                            {/* Polling Content */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Isi Polling:</label>
                                <div className="p-3 bg-light rounded">
                                    <h5 className="mb-0 text-primary">"{polling.kalimat}"</h5>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="ph ph-tag me-1"></i>
                                    Kategori:
                                </label>
                                <div>
                                    {renderKategoris()}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="ph ph-user me-1"></i>
                                    Dibuat oleh:
                                </label>
                                <div>
                                    {renderUserName()}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="ph ph-info me-1"></i>
                                    Status:
                                </label>
                                <div>
                                    <span className={`badge ${statusInfo.badgeClass}`}>
                                        <i className={`${statusInfo.icon} me-1`}></i>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            </div>

                            {/* Donasi Info */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="ph ph-money me-1"></i>
                                    Donasi:
                                </label>
                                <div>
                                    {polling.nominal === 0 || polling.nominal === null ? (
                                        <span className="text-muted">
                                            <i className="ph ph-gift me-1"></i>
                                            Tanpa donasi (Gratis)
                                        </span>
                                    ) : (
                                        <span className="text-success fw-bold">
                                            <i className="ph ph-currency-circle-dollar me-1"></i>
                                            Rp {parseInt(polling.nominal).toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">
                                    <i className="ph ph-calendar me-1"></i>
                                    Dibuat pada:
                                </label>
                                <div>
                                    {new Date(polling.created_at).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {/* Payment Section - hanya tampil jika status pending dan ada nominal */}
                            {statusInfo.status === 'pending' && polling.nominal > 0 && (
                                <div className="border-top pt-4">
                                    <h5 className="mb-3">
                                        <i className="ph ph-credit-card me-2"></i>
                                        Pembayaran Donasi
                                    </h5>
                                    
                                    {polling.qris_url ? (
                                        <div className="text-center">
                                            <div className="alert alert-info">
                                                <i className="ph ph-info-circle me-2"></i>
                                                Silakan lakukan pembayaran untuk mengaktifkan polling Anda
                                            </div>
                                            
                                            <iframe
                                                src={polling.qris_url}
                                                title="Pembayaran Midtrans"
                                                width="100%"
                                                height="600"
                                                frameBorder="0"
                                                allow="payment"
                                                className="rounded border"
                                            />
                                            
                                            <p className="mt-3">
                                                <strong>Nominal: Rp {parseInt(polling.nominal).toLocaleString('id-ID')}</strong>
                                            </p>
                                            
                                            <p className="text-muted">Jika halaman tidak terbuka otomatis, klik tombol di bawah:</p>
                                            <a 
                                                href={polling.qris_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-primary"
                                            >
                                                <i className="ph ph-credit-card me-2"></i>
                                                Bayar Sekarang
                                            </a>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="alert alert-warning">
                                                <i className="ph ph-warning-circle me-2"></i>
                                                Masukkan nominal donasi untuk melanjutkan ke pembayaran
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Nominal Donasi (Rp)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={nominal}
                                                    onChange={e => setNominal(e.target.value)}
                                                    placeholder="Masukkan nominal donasi"
                                                    min="1000"
                                                />
                                                <small className="text-muted">Nominal minimal Rp 1.000</small>
                                            </div>
                                            
                                            <button 
                                                className="btn btn-success w-100" 
                                                onClick={handleGenerateQris} 
                                                disabled={loading || !nominal || parseInt(nominal) < 1000}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Memproses...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="ph ph-qr-code me-2"></i>
                                                        Lanjutkan ke Pembayaran
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Success Message */}
                            {statusInfo.status === 'paid' && (
                                <div className="alert alert-success">
                                    <i className="ph ph-check-circle me-2"></i>
                                    Polling Anda sudah aktif dan dapat dilihat oleh pengguna lain!
                                </div>
                            )}

                            {/* Free Polling Message */}
                            {statusInfo.status === 'free' && (
                                <div className="alert alert-info">
                                    <i className="ph ph-gift me-2"></i>
                                    Polling gratis Anda sudah aktif dan dapat dilihat oleh pengguna lain!
                                </div>
                            )}
                        </div>

                        <div className="card-footer">
                            <button 
                                className="btn btn-outline-secondary" 
                                onClick={() => navigate(-1)}
                            >
                                <i className="ph ph-arrow-left me-2"></i>
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollingDetailPage;
