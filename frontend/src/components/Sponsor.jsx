import React from 'react';

const Sponsor = ({ 
    title = "Sponsor", 
    width = "300px",
    showTitle = true,
    sponsors = [
        { src: "/assets/images/sponsor1.jpg", alt: "Sponsor 1" },
        { src: "/assets/images/sponsor2.jpg", alt: "Sponsor 2" },
        { src: "/assets/images/sponsor3.jpg", alt: "Sponsor 3" }
    ]
}) => {
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
                <img 
                    key={index}
                    src={sponsor.src} 
                    alt={sponsor.alt} 
                    style={{
                        width: '100%',
                        height: 'auto',
                        marginBottom: '20px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                />
            ))}

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
