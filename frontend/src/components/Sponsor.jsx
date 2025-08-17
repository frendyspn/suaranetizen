import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { API_BASE_URL } from '../constants';

const Sponsor = ({ 
    title = "Sponsor", 
    width = "300px",
    showTitle = true
}) => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default sponsors sebagai fallback
    const defaultSponsors = [
        { id: 1, title: "Sponsor 1", image: "/assets/images/sponsor1.jpg" },
        { id: 2, title: "Sponsor 2", image: "/assets/images/sponsor2.jpg" },
        { id: 3, title: "Sponsor 3", image: "/assets/images/sponsor3.jpg" }
    ];

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/sponsors');
                if (response.data && response.data.length > 0) {
                    setSponsors(response.data);
                } else {
                    setSponsors(defaultSponsors);
                }
            } catch (err) {
                console.error('Error fetching sponsors:', err);
                setError('Failed to load sponsors');
                setSponsors(defaultSponsors);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <div className="sponsor-container" style={{
                width: width,
                padding: '20px',
                marginRight: '20px',
                background: '#f5f9ff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                {showTitle && (
                    <h3 style={{ 
                        marginTop: 0, 
                        color: '#0066cc',
                        marginBottom: '20px'
                    }}>
                        {title}
                    </h3>
                )}
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="sponsor-container" style={{
            width: width,
            padding: '20px',
            marginRight: '20px',
            background: '#f5f9ff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            {showTitle && (
                <h3 style={{ 
                    marginTop: 0, 
                    color: '#0066cc',
                    marginBottom: '20px'
                }}>
                    {title}
                </h3>
            )}
            
            {sponsors.map((sponsor, index) => (
                <div key={sponsor.id || index} style={{ marginBottom: '20px' }}>
                    <img 
                        src={sponsor.image ? 
                            (sponsor.image.startsWith('http') || sponsor.image.startsWith('/assets') ? 
                                sponsor.image : 
                                `${API_BASE_URL}uploads/${sponsor.image}`
                            ) : 
                            '/assets/images/sponsor-placeholder.jpg'
                        }
                        alt={sponsor.title || `Sponsor ${index + 1}`} 
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                        onError={(e) => {
                            e.target.src = '/assets/images/sponsor-placeholder.jpg';
                        }}
                    />
                    {sponsor.title && (
                        <div style={{
                            marginTop: '8px',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            {sponsor.title}
                        </div>
                    )}
                </div>
            ))}

            {error && (
                <div style={{
                    textAlign: 'center',
                    padding: '20px 0',
                    color: '#666'
                }}>
                    <i className="ph ph-warning-circle" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <div style={{ fontSize: '14px' }}>
                        {error}
                    </div>
                </div>
            )}

            {/* Responsive CSS */}
            <style jsx>{`
                @media(max-width: 768px) {
                    .sponsor-container {
                        width: 100% !important;
                        margin-right: 0 !important;
                        margin-bottom: 20px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .sponsor-container {
                        padding: 15px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sponsor;
