import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const ResultPollingPage = () => {
    const [dataPolling, setDataPolling] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [totalVotes, setTotalVotes] = useState(0);

    const navigate = useNavigate();
    
    // Donation target states
    const [donationData, setDonationData] = useState({
        target: 1000000000, // 1 Milyar
        collected: 0,
        donors: 0,
        remainingDays: 30,
        description: ''
    });

    const handleGetPolling = useCallback(async () => {
        try {
            const res = await axios.get('/user/result-pollings');
            setDataPolling(res.data);
            
            // Calculate total votes
            const total = res.data.reduce((sum, polling) => sum + (polling.polling_votes_count || 0), 0);
            setTotalVotes(total);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil hasil polling');
        }
    }, []);

    // Fetch donation data
    const handleGetDonationData = useCallback(async () => {
        try {
            // Replace with actual API endpoint
            const res = await axios.get('/user/donation-progress');
            setDonationData(res.data);
        } catch (err) {
            console.error('Error fetching donation data:', err);
            // Use default values if API fails
        }
    }, []);

    useEffect(() => {
        handleGetPolling();
        handleGetDonationData();
    }, [handleGetPolling, handleGetDonationData]);

    // Calculate donation percentage
    const getDonationPercentage = () => {
        return Math.min(Math.round((donationData.collected / donationData.target) * 100), 100);
    };

    // Format currency for donation
    const formatCurrency = (amount) => {
        if (amount >= 1000000000) {
            return `${(amount / 1000000000).toFixed(1)} Milyar`;
        } else if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)} Juta`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(0)} Ribu`;
        } else {
            return amount.toLocaleString('id-ID');
        }
    };

    // Render donation target section
    const renderDonationTarget = () => {
        const percentage = getDonationPercentage();
        const remaining = donationData.target - donationData.collected;
        
        return (
            <div className="donation-target-section bg-gradient-primary text-white p-4 rounded-3 mb-4">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <div className="donation-info">
                            <h5 className="fw-bold mb-2 d-flex align-items-center">
                                <i className="ph ph-heart-straight-fill me-2 text-warning"></i>
                                Target Donasi untuk {donationData.description || 'Kegiatan'}
                            </h5>
                            
                            
                            {/* Progress Info */}
                            <div className="row text-center mb-3">
                                <div className="col-6">
                                    <div className="donation-stat">
                                        <h6 className="fw-bold mb-1">Rp {formatCurrency(donationData.collected)}</h6>
                                        <small className="opacity-75 text-dark">Terkumpul</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="donation-stat">
                                        <h6 className="fw-bold mb-1">{donationData.donors.toLocaleString('id-ID')}</h6>
                                        <small className="opacity-75 text-dark">Donatur</small>
                                    </div>
                                </div>
                                
                            </div>

                            {/* Progress Bar */}
                            <div className="donation-progress mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="small fw-bold text-dark">Progress Donasi</span>
                                    <span className="badge bg-warning text-dark fw-bold">{percentage}%</span>
                                </div>
                                <div className="progress mt-3" style={{ height: '10px', backgroundColor: 'rgba(252, 212, 118, 0.2)' }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: `${percentage}%` }}
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="opacity-75 text-dark">Rp 0</small>
                                    <small className="opacity-75 text-dark">Target: Rp {formatCurrency(donationData.target)}</small>
                                </div>
                            </div>

                            {remaining > 0 && (
                                <p className="small mb-0 opacity-90 text-dark">
                                    <i className="ph ph-info-circle me-1"></i>
                                    Masih dibutuhkan <strong>Rp {formatCurrency(remaining)}</strong> untuk mencapai target
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* <div className="col-lg-4 text-center">
                        <div className="donation-action">
                            <div className="donation-illustration mb-3">
                                <i className="ph ph-hand-heart display-1 text-warning"></i>
                            </div>
                            <button className="btn btn-warning btn-lg fw-bold text-dark px-4 py-3 w-100">
                                <i className="ph ph-heart-straight-fill me-2"></i>
                                Donasi Sekarang
                            </button>
                            <small className="d-block mt-2 opacity-75">
                                Minimal donasi Rp 10.000
                            </small>
                        </div>
                    </div> */}

                    <hr className='border border-warning' />
                </div>
            </div>
        );
    };

    // Get creator name with proper handling for anonymous
    const getCreatorName = (polling) => {
        if (polling.is_anonymous) {
            return 'Anonim';
        }
        return polling.display_name || polling.user?.name || 'Unknown';
    };

    // Calculate percentage
    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    // Get rank colors and icons
    const getRankStyle = (index) => {
        const styles = {
            0: { // 1st place
                bgColor: 'linear-gradient(135deg, #FFD700, #FFA500)',
                textColor: '#B8860B',
                icon: 'crown',
                border: '3px solid #FFD700',
                shadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
            },
            1: { // 2nd place
                bgColor: 'linear-gradient(135deg, #C0C0C0, #A9A9A9)',
                textColor: '#696969',
                icon: 'medal',
                border: '3px solid #C0C0C0',
                shadow: '0 6px 20px rgba(192, 192, 192, 0.3)'
            },
            2: { // 3rd place
                bgColor: 'linear-gradient(135deg, #CD7F32, #A0522D)',
                textColor: '#8B4513',
                icon: 'trophy',
                border: '3px solid #CD7F32',
                shadow: '0 4px 15px rgba(205, 127, 50, 0.3)'
            }
        };
        return styles[index] || {
            bgColor: 'linear-gradient(135deg, #6c757d, #495057)',
            textColor: '#495057',
            icon: 'star',
            border: '2px solid #6c757d',
            shadow: '0 2px 10px rgba(108, 117, 125, 0.2)'
        };
    };

    // Render rank badge
    const renderRankBadge = (index, votes) => {
        const style = getRankStyle(index);
        const percentage = getPercentage(votes);
        
        return (
            <div className="rank-container position-relative">
                <div 
                    className="rank-badge d-flex flex-column align-items-center justify-content-center text-white position-relative"
                    style={{
                        width: '80px',
                        height: '80px',
                        background: style.bgColor,
                        borderRadius: '50%',
                        border: style.border,
                        boxShadow: style.shadow,
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}
                >
                    <i className={`ph ph-${style.icon} mb-1`} style={{ fontSize: '1.2rem' }}></i>
                    <span>{index + 1}</span>
                </div>
                
            </div>
        );
    };

    // Render progress bar
    const renderProgressBar = (votes, index) => {
        const percentage = getPercentage(votes);
        const style = getRankStyle(index);
        
        return (
            <div className="progress-container mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-muted small">Perolehan Suara</span>
                    {/* <span className="badge bg-primary">{formatCurrencyPrefix(votes)} suara</span> */}
                </div>
                <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{
                            width: `${percentage}%`,
                            background: style.bgColor,
                            borderRadius: '10px'
                        }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                <div className="text-center mt-1">
                    <small className="text-muted">{percentage}% dari total {formatCurrencyPrefix(totalVotes)} suara</small>
                </div>
            </div>
        );
    };

    // Render categories
    const renderKategoris = (kategoris) => {
        if (!kategoris || kategoris.length === 0) return null;
        
        return (
            <div className="mb-2">
                {kategoris.map((kategori, index) => (
                    <span key={kategori.id || index} className="badge bg-secondary me-1" style={{ fontSize: '0.75rem' }}>
                        {kategori.nama || kategori}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="rounded p-5" style={{ backgroundColor: '#3053a7' }}>
            {error && (
                <ErrorModal error={error} onClose={() => setError('')} />
            )}
            {success && (
                <SuccessModal message={success} onClose={() => setSuccess('')} />
            )}

            <div className='row'>
                <div className='col-md-4 col-sm-12 text-center' style={{ alignContent: 'center' }}>
                    <span className='text-white'>Join At</span>
                    <h4 className='text-white'>{WEB_NAME}</h4>
                </div>
                <div className='col-md-8 col-sm-12'>
                    <div className='bg-white rounded m-5'>
                        
                        {/* Header Section */}
                        <div className='headQuote p-4 border-bottom bg-light'>
                            {dataPolling.length > 0 ? (
                                <div className="text-center">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <i className="ph ph-trophy text-warning me-2" style={{ fontSize: '2rem' }}></i>
                                        <h3 className="mb-0 fw-bold text-primary">Hasil Polling Suara Netizen</h3>
                                        <i className="ph ph-trophy text-warning ms-2" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <p className="text-muted mb-0">
                                        <i className="ph ph-users me-1"></i>
                                        Total {formatCurrencyPrefix(totalVotes)} netizen telah berpartisipasi
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h5 className="text-muted">
                                        <i className="ph ph-chart-bar me-2"></i>
                                        Hasil Polling
                                    </h5>
                                </div>
                            )}
                        </div>

                        {/* Donation Target Section */}
                        <div className="p-4">
                            {renderDonationTarget()}
                        </div>

                        {/* Results Section */}
                        <div className='dataQuote p-4'>
                            {dataPolling.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="ph ph-chart-line-down text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h5 className="text-muted">Tidak ada hasil polling yang tersedia</h5>
                                    <p className="text-muted">Belum ada data polling yang dapat ditampilkan saat ini.</p>
                                </div>
                            ) : (
                                <div className="results-container">
                                    {/* Top 3 Header */}
                                    <div className="top3-header text-center mb-4">
                                        <h4 className="fw-bold text-primary mb-2">
                                            <i className="ph ph-ranking me-2"></i>
                                            Top Quote Terpopuler
                                        </h4>
                                        <p className="text-muted mb-0">Inilah quote-quote terfavorit berdasarkan suara netizen</p>
                                    </div>

                                    {dataPolling.map((polling, index) => (
                                        <div
                                            key={polling.id}
                                            className="result-card mb-4 p-4 border rounded-3 position-relative overflow-hidden"
                                            style={{
                                                background: index < 3 ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : '#fff',
                                                border: index < 3 ? getRankStyle(index).border : '1px solid #dee2e6',
                                                boxShadow: getRankStyle(index).shadow,
                                                transform: 'translateY(0)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = getRankStyle(index).shadow;
                                            }}
                                        >
                                            {/* Ranking decoration for top 3 */}
                                            {index < 3 && (
                                                <div 
                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                                                    style={{
                                                        background: getRankStyle(index).bgColor,
                                                        zIndex: 0
                                                    }}
                                                ></div>
                                            )}

                                            <div className="d-flex align-items-start gap-4 position-relative" style={{ zIndex: 1 }}>
                                                {/* Rank Badge */}
                                                <div className="flex-shrink-0">
                                                    {renderRankBadge(index, polling.polling_votes_count)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow-1">
                                                    {/* Quote Text */}
                                                    <div className="mb-3">
                                                        <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '1.3rem', lineHeight: '1.4' }}>
                                                            <i className="ph ph-quotes text-primary me-2"></i>
                                                            "{polling?.kalimat}"
                                                        </h4>
                                                        
                                                        {/* Categories */}
                                                        {renderKategoris(polling.kategoris)}
                                                    </div>

                                                    {/* Creator Info */}
                                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3">
                                                        <div className="creator-info mb-2 mb-sm-0">
                                                            <span className="text-muted">Quote dari </span>
                                                            <strong className={polling.is_anonymous ? 'text-muted' : 'text-primary'}>
                                                                {polling.is_anonymous && <i className="ph ph-mask me-1"></i>}
                                                                {getCreatorName(polling)}
                                                            </strong>
                                                        </div>
                                                        
                                                        {/* Vote Count Badge */}
                                                        <div className="vote-badge">
                                                            <span className="badge bg-success" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                                                                <i className="ph ph-heart-straight-fill me-1"></i>
                                                                {formatCurrencyPrefix(polling?.polling_votes_count)} Netizen
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    {renderProgressBar(polling.polling_votes_count, index)}

                                                    {/* Action Buttons */}
                                                    <div className="mt-3 d-flex gap-2">
                                                        <button className="btn btn-outline-primary btn-sm">
                                                            <i className="ph ph-share-network me-1"></i>
                                                            Bagikan
                                                        </button>
                                                        <button className="btn btn-outline-success btn-sm">
                                                            <i className="ph ph-heart me-1"></i>
                                                            Dukung Quote Ini
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Summary Stats */}
                                    {dataPolling.length > 0 && (
                                        <div className="summary-stats mt-5 p-4 bg-light rounded-3">
                                            <h6 className="fw-bold mb-3 text-center">
                                                <i className="ph ph-chart-pie me-2 text-primary"></i>
                                                Ringkasan Polling
                                            </h6>
                                            <div className="row text-center">
                                                <div className="col-md-3">
                                                    <div className="stat-item">
                                                        <h4 className="text-primary fw-bold">{dataPolling.length}</h4>
                                                        <small className="text-muted">Total Quote</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="stat-item">
                                                        <h4 className="text-success fw-bold">{formatCurrencyPrefix(totalVotes)}</h4>
                                                        <small className="text-muted">Total Suara</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="stat-item">
                                                        <h4 className="text-warning fw-bold">
                                                            {totalVotes > 0 ? Math.round(totalVotes / dataPolling.length) : 0}
                                                        </h4>
                                                        <small className="text-muted">Rata-rata</small>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="stat-item">
                                                        <h4 className="text-info fw-bold">{donationData.donors}</h4>
                                                        <small className="text-muted">Donatur</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Call to Action */}
                                    <div className="cta-section mt-5 p-4 bg-primary bg-opacity-10 rounded-3 text-center">
                                        <h5 className="fw-bold text-primary mb-2">
                                            <i className="ph ph-megaphone me-2"></i>
                                            Suaramu Penting!
                                        </h5>
                                        <p className="text-muted mb-3">
                                            Bergabunglah dengan ribuan netizen lainnya dalam menyuarakan pendapat dan membangun Indonesia yang lebih baik.
                                        </p>
                                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                                <i className="ph ph-plus me-1"></i>
                                                Kirim Quote Baru
                                            </button>
                                            <button className="btn btn-outline-primary border border-primary text-primary" onClick={() => navigate('/pollings')}>
                                                <i className="ph ph-chart-line me-1 text-primary"></i>
                                                <span className='text-primary'>Lihat Semua Polling</span> 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPollingPage;