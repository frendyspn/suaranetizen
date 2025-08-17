import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import Sponsor from '../../components/Sponsor';

const AboutPage = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('/user/about');
                setContent(res.data?.content || '');
            } catch (error) {
                console.error('Error fetching about content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '16px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="content" style={{
                display: 'flex',
                flexWrap: 'wrap',
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Left Column - Sponsors */}
                <Sponsor />

                {/* Right Column - About Content */}
                <div className="right-column" style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '20px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        color: '#0066cc',
                        marginTop: 0,
                        borderBottom: '2px solid #0066cc',
                        paddingBottom: '10px'
                    }}>
                        Tentang Suara Netizen
                    </h2>

                    

                    {/* Display dynamic content if available */}
                    {content && (
                        <div 
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '20px',
                background: '#f5f5f5',
                marginTop: '20px',
                borderTop: '1px solid #ddd'
            }}>
                &copy; 2025 SuaraNetizen. All rights reserved.
            </footer>

            {/* Responsive CSS */}
            <style jsx>{`
                @media(max-width: 768px) {
                    .content {
                        flex-direction: column !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .content {
                        padding: 10px !important;
                    }
                    .right-column {
                        padding: 15px !important;
                    }
                }
            `}</style>
        </>
    );
};

export default AboutPage;
