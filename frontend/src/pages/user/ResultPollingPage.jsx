import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import Sponsor from '../../components/Sponsor';

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
        <>
            {/* Content Layout sesuai template hasil.html */}
            <div className="content" style={{
                display: 'flex',
                flexWrap: 'wrap',
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <Sponsor />
                {error && (
                    <ErrorModal error={error} onClose={() => setError('')} />
                )}
                {success && (
                    <SuccessModal message={success} onClose={() => setSuccess('')} />
                )}

                {/* Right Column - Main Content */}
                <div className="right-column" style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '20px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    {/* Poll Title dengan animasi sesuai template */}
                    <div className="poll-title" style={{
                        textAlign: 'center',
                        fontSize: '32px',
                        color: '#0066cc',
                        marginBottom: '30px',
                        animation: 'pulse 2s infinite, float 3s ease-in-out infinite',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        fontWeight: 'bold'
                    }}>
                        Tiga Besar Pemenang Poling
                    </div>

                    {/* Donation Progress Section sesuai template */}
                    <div className="donation-section" style={{
                        marginBottom: '30px',
                        padding: '20px',
                        background: '#f5f9ff',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}>
                        <h2 className="donation-title" style={{
                            fontSize: '24px',
                            color: '#0066cc',
                            marginBottom: '15px',
                            textAlign: 'left'
                        }}>
                            Capaian Donasi Penerbitan Billboard
                        </h2>
                        <div className="progress-container" style={{
                            width: '100%',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '20px',
                            marginBottom: '10px',
                            overflow: 'hidden'
                        }}>
                            <div
                                className="progress-bar"
                                style={{
                                    height: '30px',
                                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                                    borderRadius: '20px',
                                    transition: 'width 0.5s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '10px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    width: `${getDonationPercentage()}%`
                                }}
                            >
                                {getDonationPercentage()}%
                            </div>
                        </div>
                        <div className="donation-info" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            color: '#555'
                        }}>
                            <span>Terkumpul: <span style={{ fontWeight: 'bold', color: '#0066cc' }}>Rp {formatCurrency(donationData.collected)}</span></span>
                            <span>Target: <span style={{ fontWeight: 'bold', color: '#0066cc' }}>Rp {formatCurrency(donationData.target)}</span></span>
                        </div>
                    </div>

                    {/* Chart Container sesuai template */}
                    {dataPolling.length > 0 && (
                        <div className="chart-container" style={{
                            width: '100%',
                            height: 'auto',
                            marginBottom: '40px',
                            background: '#f9f9f9',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ marginBottom: '20px', color: '#0066cc', fontSize: '18px', fontWeight: 'bold' }}>Perolehan Suara</h2>
                            {dataPolling.slice(0, 3).map((polling, index) => (
                                <div key={polling.id} className="chart-bar" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div className="chart-label" style={{
                                        width: '150px',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {getCreatorName(polling)}
                                    </div>
                                    <div className="chart-bar-inner" style={{
                                        flexGrow: 1,
                                        height: '30px',
                                        background: '#e0e0e0',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <div className="chart-bar-fill" style={{
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #0066cc, #4da6ff)',
                                            borderRadius: '15px',
                                            transition: 'width 1s ease-out',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            paddingRight: '10px',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            width: `${Math.max(getPercentage(polling.polling_votes_count), 5)}%`
                                        }}>
                                            {formatCurrencyPrefix(polling.polling_votes_count)} suara
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Poll Table sesuai template */}
                    {dataPolling.length > 0 && (
                        <table className="poll-table" style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '30px'
                        }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        backgroundColor: '#0066cc',
                                        color: 'white',
                                        padding: '12px',
                                        textAlign: 'left'
                                    }}>No</th>
                                    <th style={{
                                        backgroundColor: '#0066cc',
                                        color: 'white',
                                        padding: '12px',
                                        textAlign: 'left'
                                    }}>Kata-kata/Quote</th>
                                    <th style={{
                                        backgroundColor: '#0066cc',
                                        color: 'white',
                                        padding: '12px',
                                        textAlign: 'left'
                                    }}>Nama User</th>
                                    <th style={{
                                        backgroundColor: '#0066cc',
                                        color: 'white',
                                        padding: '12px',
                                        textAlign: 'left'
                                    }}>Suara</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPolling.map((polling, index) => (
                                    <tr key={polling.id}
                                        style={{
                                            backgroundColor: index % 2 === 1 ? '#f5f9ff' : 'white'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#e6f0ff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = index % 2 === 1 ? '#f5f9ff' : 'white';
                                        }}
                                    >
                                        <td style={{
                                            padding: '10px 12px',
                                            borderBottom: '1px solid #ddd'
                                        }}>{index + 1}</td>
                                        <td style={{
                                            padding: '10px 12px',
                                            borderBottom: '1px solid #ddd'
                                        }}>"{polling?.kalimat}"</td>
                                        <td style={{
                                            padding: '10px 12px',
                                            borderBottom: '1px solid #ddd'
                                        }}>{getCreatorName(polling)}</td>
                                        <td style={{
                                            padding: '10px 12px',
                                            borderBottom: '1px solid #ddd',
                                            fontWeight: 'bold'
                                        }}>{formatCurrencyPrefix(polling?.polling_votes_count)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Thank You Message sesuai template */}
                    <div className="thank-you" style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        color: '#0066cc',
                        marginTop: '40px',
                        padding: '20px',
                        background: '#f5f9ff',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}>
                        Terima kasih kepada semua Netizen yang telah berpartisipasi dan Selamat kepada tiga orang Netizen dengan perolehan suara terbanyak
                    </div>
                </div>
            </div>

            {/* CSS untuk animasi pulse dan float */}
            <style jsx>{`
                .sponsor-img {
                    width: 100%;
                    height: auto;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }

                @media(max-width: 768px) {
                    .content {
                        flex-direction: column !important;
                        padding-top: 10px !important;
                    }
                    
                    .left-column {
                        width: 100% !important;
                        margin-right: 0 !important;
                        margin-bottom: 20px !important;
                    }
                    
                    .poll-title {
                        font-size: 26px !important;
                    }
                    
                    .chart-label {
                        width: 100px !important;
                        font-size: 14px !important;
                    }
                    
                    .donation-title {
                        font-size: 22px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .poll-title {
                        font-size: 22px !important;
                    }
                    
                    .thank-you {
                        font-size: 16px !important;
                    }
                    
                    .donation-title {
                        font-size: 20px !important;
                    }
                    
                    .progress-bar {
                        height: 25px !important;
                        font-size: 14px !important;
                    }
                    
                    .chart-label {
                        width: 80px !important;
                        font-size: 12px !important;
                    }
                }
            `}</style>
        </>
    );
};

export default ResultPollingPage;