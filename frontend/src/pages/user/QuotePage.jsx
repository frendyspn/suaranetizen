import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import { formatCurrency, formatCurrencyPrefix } from '../../utils/formatCurrency';
import Sponsor from '../../components/Sponsor';

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
        <>
            {/* Content Layout sesuai template kata_terbit.html */}
            <div className="content" style={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* Left Column - Sponsor */}
                <Sponsor />

                {/* Right Column - Winner Container */}
                <div className="winner-container" style={{
                    flex: 1,
                    minWidth: '400px',
                    background: '#fff',
                    padding: '30px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        color: '#0066cc',
                        marginTop: 0,
                        marginBottom: '20px',
                        fontSize: '28px'
                    }}>
                        Selamat Buat Netizen
                    </h2>
                    
                    <div className="congrat-message" style={{
                        marginBottom: '30px',
                        lineHeight: '1.6',
                        color: '#333'
                    }}>
                        Selamat Kata-kata yang Anda buat mendapatkan suara terbanyak dan akan ditayangkan pada papan iklan billboard di Jantung Ibu Kota Jakarta. Terima kasih atas partisipasi dan donasi dari seluruh Netizen+62
                    </div>
                    
                    {/* Winner Quote - menggunakan data dari API jika tersedia */}
                    {dataDonasi?.polling && dataDonasi.polling.length > 0 ? (
                        <>
                            <div className="winner-quote" style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: '30px 0',
                                padding: '20px',
                                background: '#f5f9ff',
                                borderLeft: '4px solid #0066cc',
                                textAlign: 'left'
                            }}>
                                "{dataDonasi.polling[0]?.kalimat}"
                            </div>
                            
                            <div className="winner-name" style={{
                                fontSize: '16px',
                                color: '#666',
                                marginBottom: '30px',
                                fontStyle: 'italic'
                            }}>
                                - Oleh: {getUserName(dataDonasi.polling[0])} (ID: {dataDonasi.polling[0]?.id || 'N/A'})
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="winner-quote" style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333',
                                margin: '30px 0',
                                padding: '20px',
                                background: '#f5f9ff',
                                borderLeft: '4px solid #0066cc',
                                textAlign: 'left'
                            }}>
                                "Kebijakan sejati lahir dari mendengar suara rakyat, bukan dari gemerincing kepentingan"
                            </div>
                            
                            <div className="winner-name" style={{
                                fontSize: '16px',
                                color: '#666',
                                marginBottom: '30px',
                                fontStyle: 'italic'
                            }}>
                                - Oleh: netizen_jaya123 (ID: N-2874)
                            </div>
                        </>
                    )}
                    
                    <div className="billboard-specs" style={{
                        textAlign: 'left',
                        fontSize: '12px',
                        marginTop: '30px',
                        padding: '15px',
                        background: '#f9f9f9',
                        borderRadius: '4px',
                        lineHeight: '1.5'
                    }}>
                        <div style={{ marginBottom: '5px' }}><strong>Ukuran billboard:</strong> 10m x 5m</div>
                        <div style={{ marginBottom: '5px' }}><strong>Media:</strong> Digital LED Billboard</div>
                        <div style={{ marginBottom: '5px' }}><strong>Tanggal:</strong> 15 Agustus 2025</div>
                        <div style={{ marginBottom: '5px' }}><strong>Lokasi pemasangan:</strong> Bundaran HI, Jakarta Pusat</div>
                        <div style={{ marginBottom: '5px' }}><strong>Durasi:</strong> 7 hari (24 jam non-stop)</div>
                        <div><strong>Biaya:</strong> Rp 25.000.000 (didanai oleh donasi netizen)</div>
                    </div>
                </div>
            </div>

            {/* CSS Responsive sesuai template */}
            <style jsx>{`
                @media(max-width: 768px) {
                    .content {
                        flex-direction: column !important;
                        gap: 10px !important;
                        padding: 10px !important;
                    }
                    
                    .left-column {
                        width: 100% !important;
                        margin-bottom: 20px;
                    }
                    
                    .winner-container h2 {
                        font-size: 24px !important;
                    }
                    
                    .winner-quote {
                        font-size: 20px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .winner-container {
                        padding: 20px !important;
                        min-width: auto !important;
                    }
                    
                    .winner-container h2 {
                        font-size: 22px !important;
                    }
                    
                    .winner-quote {
                        font-size: 18px !important;
                        padding: 15px !important;
                    }
                    
                    .billboard-specs {
                        font-size: 11px !important;
                        padding: 12px !important;
                    }
                }
            `}</style>
        </>
    );
}

export default QuotePage;