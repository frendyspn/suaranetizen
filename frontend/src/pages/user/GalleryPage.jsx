import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

export default function GalleryPage() {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/galleries');
                setGalleries(response.data);
            } catch (err) {
                console.error('Error fetching galleries:', err);
                setError('Failed to load gallery data');
            } finally {
                setLoading(false);
            }
        };

        fetchGalleries();
    }, []);

    // Default gallery data sesuai template galeri.html
    const defaultGalleries = [
        { id: 1, image: 'galeri/billboard ilustrasi.jpg', caption: 'Billboard SuaraNetizen di Jl. Sudirman, Jakarta' },
        { id: 2, image: 'galeri/billboard2.jpg', caption: 'Billboard SuaraNetizen di Bundaran HI' },
        { id: 3, image: 'galeri/billboard3.jpg', caption: 'Billboard SuaraNetizen di Jl. Thamrin' },
        { id: 4, image: 'galeri/billboard4.jpg', caption: 'Billboard SuaraNetizen di Kawasan Gatot Subroto' },
        { id: 5, image: 'galeri/billboard5.jpg', caption: 'Billboard SuaraNetizen di Depan Gedung DPR' },
        { id: 6, image: 'galeri/billboard6.jpg', caption: 'Billboard SuaraNetizen di Jl. Rasuna Said' },
        { id: 7, image: 'galeri/billboard7.jpg', caption: 'Billboard SuaraNetizen di Kawasan Kuningan' },
        { id: 8, image: 'galeri/billboard8.jpg', caption: 'Billboard SuaraNetizen di Jl. MH Thamrin' },
        { id: 9, image: 'galeri/billboard9.jpg', caption: 'Billboard SuaraNetizen di Depan Monas' },
        { id: 10, image: 'galeri/billboard10.jpg', caption: 'Billboard SuaraNetizen di Jl. Jendral Sudirman' },
    ];

    const displayGalleries = galleries.length > 0 ? galleries : defaultGalleries;

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
            {/* Content Layout sesuai template galeri.html */}
            <div className="content" style={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div className="gallery-container" style={{
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
                        Galeri Foto Billboard SuaraNetizen
                    </h2>

                    <div className="gallery-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                    }}>
                        {displayGalleries.map((gallery, index) => (
                            <div key={gallery.id || `gallery-${index}`} className="gallery-item" style={{
                                marginBottom: '30px'
                            }}>
                                {gallery.image || gallery.photo ? (
                                    <img
                                        src={gallery.image ? 
                                            (gallery.image.startsWith('http') ? gallery.image : `/images/${gallery.image}`) :
                                            `${API_BASE_URL}uploads/${gallery.photo}`
                                        }
                                        alt={`Billboard ${index + 1}`}
                                        className="gallery-photo"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            border: '2px solid #0066cc',
                                            borderRadius: '4px'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                
                                {/* Fallback placeholder jika gambar tidak ada */}
                                <div 
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        border: '2px solid #0066cc',
                                        borderRadius: '4px',
                                        background: '#f0f0f0',
                                        display: (gallery.image || gallery.photo) ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#0066cc'
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <i className="ph ph-image" style={{ fontSize: '3rem', marginBottom: '10px' }}></i>
                                        <div>Billboard Image</div>
                                    </div>
                                </div>
                                
                                <div className="gallery-caption" style={{
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    marginTop: '8px',
                                    color: '#333'
                                }}>
                                    {gallery.caption || gallery.title || `Billboard SuaraNetizen - ${index + 1}`}
                                </div>
                            </div>
                        ))}
                    </div>

                    {displayGalleries.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            color: '#666'
                        }}>
                            <i className="ph ph-images" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                            <p style={{ marginTop: '15px' }}>Belum ada galeri tersedia</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Responsive sesuai template galeri.html */}
            <style jsx>{`
                .gallery-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                .gallery-item {
                    margin-bottom: 30px;
                }
                
                .gallery-photo {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                    border: 2px solid #0066cc;
                    border-radius: 4px;
                }
                
                .gallery-caption {
                    font-size: 12px;
                    text-align: center;
                    margin-top: 8px;
                    color: #333;
                }

                @media(max-width: 768px) {
                    .gallery-grid {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .content {
                        padding: 10px !important;
                    }
                    
                    .gallery-container {
                        padding: 15px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .gallery-item {
                        margin-bottom: 20px !important;
                    }
                    
                    .gallery-caption {
                        font-size: 11px !important;
                    }
                }
            `}</style>
        </>
    );
}
