import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

const BillboardPage = () => {
    const [billboard, setBillboard] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBillboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/billboard');
                setBillboard(response.data?.content || '');
            } catch (err) {
                console.error('Error fetching billboard:', err);
                setError('Failed to load billboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchBillboard();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center">
                <i className="ph ph-warning-circle me-2"></i>
                {error}
            </div>
        );
    }

    return (
        <>
            {/* Content Layout sesuai template bilboard.html */}
            <div className="content" style={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div className="billboard-container" style={{
                    width: '100%',
                    background: '#fff',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        color: '#0066cc',
                        marginTop: 0,
                        borderBottom: '2px solid #0066cc',
                        paddingBottom: '10px',
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}>
                        Alur Penerbitan Billboard SuaraNetizen
                    </h2>

                    {/* Flow Image Container sesuai template */}
                    <div className="flow-image-container" style={{
                        width: '70%', // Diperkecil 30% dari 100% sesuai template
                        margin: '20px auto',
                        textAlign: 'center'
                    }}>
                        {/* Dynamic content jika ada dari API */}
                        <img
                                src="https://suaranetizen.co.id/images/alur.jpg"
                                alt="Alur Penerbitan Billboard SuaraNetizen"
                                className="flow-image"
                                style={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    display: 'block',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        
                        
                        {/* Fallback jika gambar tidak ada */}
                        <div 
                            style={{
                                display: 'none',
                                width: '100%',
                                height: '400px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                background: '#f0f0f0',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0066cc',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <i className="ph ph-flow-arrow" style={{ fontSize: '4rem', marginBottom: '15px' }}></i>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                                    Alur Penerbitan Billboard
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    Gambar alur akan ditampilkan di sini
                                </div>
                            </div>
                        </div>
                        
                        {/* Penjelasan alur proses jika tidak ada gambar dari API */}
                        {!billboard && (
                            <div style={{
                                marginTop: '30px',
                                padding: '20px',
                                background: '#f5f9ff',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                textAlign: 'left'
                            }}>
                                <h3 style={{
                                    color: '#0066cc',
                                    marginTop: 0,
                                    marginBottom: '15px',
                                    textAlign: 'center'
                                }}>
                                    Proses Penerbitan Billboard
                                </h3>
                                <div style={{ lineHeight: '1.6', color: '#333' }}>
                                    <p><strong>1. Pengumpulan Kata-kata:</strong> Netizen mengirimkan kata-kata inspiratif melalui platform SuaraNetizen</p>
                                    <p><strong>2. Voting:</strong> Masyarakat memberikan suara untuk kata-kata terbaik</p>
                                    <p><strong>3. Seleksi Pemenang:</strong> Kata-kata dengan suara terbanyak terpilih menjadi pemenang</p>
                                    <p><strong>4. Pengumpulan Dana:</strong> Donasi terkumpul dari partisipasi netizen</p>
                                    <p><strong>5. Desain Billboard:</strong> Kata-kata pemenang dirancang untuk billboard</p>
                                    <p><strong>6. Penerbitan:</strong> Billboard dipasang di lokasi strategis Jakarta</p>
                                    <p><strong>7. Dokumentasi:</strong> Foto billboard diabadikan dan dibagikan ke galeri</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Responsive sesuai template bilboard.html */}
            <style jsx>{`
                .flow-image-container {
                    width: 70%; /* Diperkecil 30% dari 100% */
                    margin: 20px auto;
                    text-align: center;
                }
                
                .flow-image {
                    width: 100%;
                    max-width: 100%;
                    display: block;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                @media(max-width: 768px) {
                    .flow-image-container {
                        width: 85% !important; /* Sedikit lebih lebar di tablet */
                    }
                    
                    .content {
                        padding: 10px !important;
                    }
                    
                    .billboard-container {
                        padding: 15px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .flow-image-container {
                        width: 95% !important; /* Hampir full width di mobile */
                    }
                    
                    .billboard-container h2 {
                        font-size: 18px !important;
                    }
                }
            `}</style>
        </>
    );
};

export default BillboardPage;