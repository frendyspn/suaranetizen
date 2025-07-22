import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import { formatCurrency, formatCurrencyPrefix } from '../../utils/formatCurrency';

const QuotePage = () => {
    const { id } = useParams();
    const [targetDonasi, setTargetDonasi] = useState(0);
    const [danaTerkumpul, setDanaTerkumpul] = useState(0);
    const [dataDonasi, setDataDonasi] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const handleGetDonasi = useCallback(async () => {
        try {
            const res = await axios.get('/user/quote/' + id);
            setDataDonasi(res.data);
            setTargetDonasi(res.data.target);
            setDanaTerkumpul(res.data.polling.reduce((acc, curr) => acc + curr.nominal, 0));
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data quote');
        }
    }, [id]);

    useEffect(() => {
        if (targetDonasi > 0) {
            setProgress(Math.min((danaTerkumpul / targetDonasi) * 100, 100));
        } else {
            setProgress(0);
        }
    }, [targetDonasi, danaTerkumpul]);

    useEffect(() => {
        handleGetDonasi();
    }, [handleGetDonasi]);

    // Get rank colors and styling
    const getRankStyle = (index) => {
        const styles = {
            0: { // 1st place
                bgColor: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderColor: '#FFD700',
                icon: 'crown',
                badgeColor: 'bg-warning',
                textColor: 'text-warning'
            },
            1: { // 2nd place
                bgColor: 'linear-gradient(135deg, #C0C0C0, #A9A9A9)',
                borderColor: '#C0C0C0',
                icon: 'medal',
                badgeColor: 'bg-secondary',
                textColor: 'text-secondary'
            },
            2: { // 3rd place
                bgColor: 'linear-gradient(135deg, #CD7F32, #A0522D)',
                borderColor: '#CD7F32',
                icon: 'trophy',
                badgeColor: 'bg-warning',
                textColor: 'text-warning'
            }
        };
        return styles[index] || {
            bgColor: 'linear-gradient(135deg, #6c757d, #495057)',
            borderColor: '#6c757d',
            icon: 'star',
            badgeColor: 'bg-primary',
            textColor: 'text-primary'
        };
    };

    // Render categories
    const renderKategoris = (kategoris) => {
        if (!kategoris) return null;
        
        // Handle both array and string formats
        const categories = Array.isArray(kategoris) ? kategoris : [kategoris];
        
        return (
            <div className="mb-2">
                {categories.map((kategori, index) => (
                    <span 
                        key={index} 
                        className="badge bg-secondary me-1 mb-1" 
                        style={{ fontSize: '0.75rem' }}
                    >
                        {typeof kategori === 'object' ? kategori.nama : kategori}
                    </span>
                ))}
            </div>
        );
    };

    // Format user name
    const getUserName = (polling) => {
        return polling?.user?.name || 'Anonim';
    };

    return (
        <div className="quote-page rounded p-5" style={{ backgroundColor: '#3053a7', minHeight: '100vh' }}>
            {error && (
                <div className="alert alert-danger mb-3 mx-5">
                    <i className="ph ph-warning-circle me-2"></i>
                    {error}
                </div>
            )}

            <div className='row'>
                <div className='col-md-4 col-sm-12 text-center d-flex align-items-center justify-content-center'>
                    <div className="brand-section text-white">
                        <i className="ph ph-trophy display-1 mb-3 text-warning"></i>
                        <h2 className='mb-2'>Join At</h2>
                        <h3 className='fw-bold'>{WEB_NAME}</h3>
                        <p className="opacity-75 mt-3">
                            Platform suara rakyat Indonesia
                        </p>
                    </div>
                </div>
                
                <div className='col-md-8 col-sm-12'>
                    <div className='bg-white rounded-4 shadow-lg m-3 m-md-5 overflow-hidden'>
                        
                        {/* Header Section */}
                        <div className="header-section bg-gradient text-white p-4 text-center position-relative overflow-hidden">
                            <div className="header-decoration position-absolute top-0 start-0 w-100 h-100 opacity-10">
                                <div className="d-flex justify-content-around align-items-center h-100">
                                    <i className="ph ph-star display-1"></i>
                                    <i className="ph ph-heart-straight-fill display-1"></i>
                                    <i className="ph ph-trophy display-1"></i>
                                </div>
                            </div>
                            
                            <div className="position-relative">
                                <div className="celebration-badge mb-3">
                                    <span className="badge bg-warning text-dark px-4 py-2 rounded-pill">
                                        <i className="ph ph-confetti me-2"></i>
                                        HASIL AKHIR
                                    </span>
                                </div>
                                
                                <h1 className='display-4 fw-bold mb-2'>
                                    🎉 Selamat! 🎉
                                </h1>
                                
                                <p className="lead mb-0 opacity-90 text-warning">
                                    Quote Terpilih Berdasarkan Suara Netizen
                                </p>
                                
                            </div>
                        </div>

                        {/* Quote List Section */}
                        <div className='quote-list-section p-4'>
                            {dataDonasi?.polling && dataDonasi.polling.length > 0 ? (
                                <>
                                    <div className="section-header text-center mb-4">
                                        <h4 className="fw-bold text-primary mb-2">
                                            <i className="ph ph-ranking me-2"></i>
                                            Top Quote Pemenang
                                        </h4>
                                        <p className="text-muted">
                                            Inilah Quote terbaik pilihan netizen Indonesia
                                        </p>
                                    </div>

                                    <div className="quotes-container pt-20">
                                        {dataDonasi.polling.map((polling, index) => {
                                            const rankStyle = getRankStyle(index);
                                            
                                            return (
                                                <div
                                                    key={polling.id || index}
                                                    className="quote-card mb-4 position-relative"
                                                    style={{
                                                        background: index < 3 ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : '#fff',
                                                        border: `3px solid ${index < 3 ? rankStyle.borderColor : '#dee2e6'}`,
                                                        borderRadius: '20px',
                                                        boxShadow: index < 3 ? `0 10px 30px rgba(0,0,0,0.15)` : '0 5px 15px rgba(0,0,0,0.08)',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = index < 3 ? '0 10px 30px rgba(0,0,0,0.15)' : '0 5px 15px rgba(0,0,0,0.08)';
                                                    }}
                                                >
                                                    {/* Top 3 Badge */}
                                                    {index < 3 && (
                                                        <div className="rank-badge position-absolute top-0 start-50 translate-middle">
                                                            <div 
                                                                className="d-flex align-items-center justify-content-center text-white fw-bold"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    background: rankStyle.bgColor,
                                                                    borderRadius: '50%',
                                                                    border: `3px solid ${rankStyle.borderColor}`,
                                                                    fontSize: '1.2rem'
                                                                }}
                                                            >
                                                                <i className={`ph ph-${rankStyle.icon} me-1`}></i>
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-4" style={{ marginTop: index < 3 ? '30px' : '0' }}>
                                                        {/* Ranking Number for non-top-3 */}
                                                        {index >= 3 && (
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div 
                                                                    className="rank-number me-3 d-flex align-items-center justify-content-center text-white fw-bold"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        background: rankStyle.bgColor,
                                                                        borderRadius: '50%',
                                                                        fontSize: '1.1rem'
                                                                    }}
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                                <div className={`badge ${rankStyle.badgeColor} px-3 py-2`}>
                                                                    <i className="ph ph-star me-1"></i>
                                                                    Nominasi Terbaik
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Quote Content */}
                                                        <div className="quote-content mb-3">
                                                            <h5 className="quote-text fw-bold mb-3" style={{ 
                                                                fontSize: index < 3 ? '1.4rem' : '1.2rem',
                                                                lineHeight: '1.4',
                                                                color: '#2c3e50'
                                                            }}>
                                                                <i className="ph ph-quotes text-primary me-2"></i>
                                                                "{polling?.kalimat}"
                                                            </h5>

                                                            {/* Categories */}
                                                            {renderKategoris(polling?.kategoris || polling?.kategori)}
                                                        </div>

                                                        {/* Quote Meta Info */}
                                                        <div className="quote-meta d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3">
                                                            <div className="author-info d-flex align-items-center">
                                                                <div className="author-avatar me-3">
                                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                                                         style={{ width: '40px', height: '40px' }}>
                                                                        <i className="ph ph-user text-white"></i>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-0 small text-muted">Quote dari</p>
                                                                    <p className="mb-0 fw-bold text-primary">
                                                                        {getUserName(polling)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="vote-stats text-end">
                                                                <div className={`badge ${rankStyle.badgeColor} px-3 py-2 mb-2`} 
                                                                     style={{ fontSize: '0.9rem' }}>
                                                                    <i className="ph ph-heart-straight-fill me-2"></i>
                                                                    {formatCurrencyPrefix(polling?.polling_votes_count || polling?.polling_votes || 0)} Suara
                                                                </div>
                                                                
                                                                {polling?.nominal && (
                                                                    <div className="small text-muted">
                                                                        <i className="ph ph-coin me-1"></i>
                                                                        Kontribusi: Rp {formatCurrency(polling.nominal)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="quote-actions mt-3 d-flex gap-2 justify-content-center">
                                                            <div className='mb-10'>&nbsp;</div>
                                                            {/* <button className="btn btn-outline-primary btn-sm">
                                                                <i className="ph ph-share-network me-1"></i>
                                                                Bagikan
                                                            </button>
                                                            <button className="btn btn-outline-success btn-sm">
                                                                <i className="ph ph-heart me-1"></i>
                                                                Apresiasi
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Summary Section */}
                                    {/* <div className="summary-section mt-5 p-4 bg-light rounded-3">
                                        <h6 className="fw-bold mb-3 text-center">
                                            <i className="ph ph-chart-pie me-2 text-primary"></i>
                                            Ringkasan Campaign
                                        </h6>
                                        <div className="row text-center">
                                            <div className="col-md-3 col-6 mb-3">
                                                <div className="stat-item">
                                                    <h4 className="text-primary fw-bold">{dataDonasi?.polling?.length || 0}</h4>
                                                    <small className="text-muted">Total Quote</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6 mb-3">
                                                <div className="stat-item">
                                                    <h4 className="text-success fw-bold">
                                                        {formatCurrencyPrefix(
                                                            dataDonasi?.polling?.reduce((acc, p) => acc + (p.polling_votes_count || p.polling_votes || 0), 0) || 0
                                                        )}
                                                    </h4>
                                                    <small className="text-muted">Total Suara</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6 mb-3">
                                                <div className="stat-item">
                                                    <h4 className="text-warning fw-bold">Rp {formatCurrency(danaTerkumpul)}</h4>
                                                    <small className="text-muted">Dana Terkumpul</small>
                                                </div>
                                            </div>
                                            <div className="col-md-3 col-6 mb-3">
                                                <div className="stat-item">
                                                    <h4 className="text-info fw-bold">{Math.round(progress)}%</h4>
                                                    <small className="text-muted">Progress Target</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </>
                            ) : (
                                <div className="empty-state text-center py-5">
                                    <i className="ph ph-folder-simple-dashed text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h5 className="text-muted">Belum Ada Quote</h5>
                                    <p className="text-muted">Campaign ini belum memiliki quote yang terpilih.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuotePage;