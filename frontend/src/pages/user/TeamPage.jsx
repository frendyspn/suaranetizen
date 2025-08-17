import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';
import Sponsor from '../../components/Sponsor';

function TeamPage() {
    const [teams, setTeams] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch teams and settings data
                const [teamsResponse, settingsResponse] = await Promise.all([
                    axios.get('/user/teams'),
                    axios.get('/user/settings') // Atau endpoint yang sesuai untuk settings
                ]);

                setTeams(teamsResponse.data);
                setSettings(settingsResponse.data);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            {/* Content Layout sesuai template tim.html */}
            <div className="content" style={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div className="team-container" style={{
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
                        Tim Suara Netizen
                    </h2>

                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center">
                            <i className="ph ph-warning-circle me-2"></i>
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Team Grid sesuai template tim.html - 3 baris terpisah */}
                            <div className="team-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                gap: '20px',
                                marginBottom: '40px'
                            }}>
                                {teams.length === 0 ? (
                                    <div style={{
                                        gridColumn: '1 / -1',
                                        textAlign: 'center',
                                        padding: '40px 0',
                                        color: '#666'
                                    }}>
                                        <i className="ph ph-users" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                                        <p style={{ marginTop: '15px' }}>Belum ada data tim tersedia</p>
                                        
                                        {/* Default team data sesuai template */}
                                        <div className="default-team" style={{ marginTop: '30px' }}>
                                            {/* Baris 1 - Foto */}
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <div key={`photo-${num}`} className="team-member" style={{ 
                                                    display: 'inline-block', 
                                                    textAlign: 'center', 
                                                    margin: '0 20px 20px 0' 
                                                }}>
                                                    <div
                                                        className="team-photo"
                                                        style={{
                                                            width: '3cm',
                                                            height: '4cm',
                                                            border: '2px solid #0066cc',
                                                            borderRadius: '4px',
                                                            background: '#f0f0f0',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginBottom: '10px'
                                                        }}
                                                    >
                                                        <i className="ph ph-user" style={{ fontSize: '2rem', color: '#0066cc' }}></i>
                                                    </div>
                                                </div>
                                            ))}
                                            <br />
                                            
                                            {/* Baris 2 - Nama */}
                                            {['Rinto Jatmiko', 'Budi Santoso', 'Ani Wijayanti', 'Dewi Kartika', 'Agus Prasetyo'].map((name, idx) => (
                                                <div key={`name-${idx}`} className="team-member" style={{ 
                                                    display: 'inline-block', 
                                                    textAlign: 'center',
                                                    width: '3cm',
                                                    margin: '0 20px 15px 0' 
                                                }}>
                                                    <div className="team-name" style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '5px',
                                                        color: '#333',
                                                        fontSize: '14px'
                                                    }}>
                                                        {name}
                                                    </div>
                                                </div>
                                            ))}
                                            <br />
                                            
                                            {/* Baris 3 - Jabatan */}
                                            {['CEO & Founder', 'Direktur Teknologi', 'Direktur Kreatif', 'Manajer Media', 'Koordinator Lapangan'].map((position, idx) => (
                                                <div key={`position-${idx}`} className="team-member" style={{ 
                                                    display: 'inline-block', 
                                                    textAlign: 'center',
                                                    width: '3cm',
                                                    margin: '0 20px 15px 0' 
                                                }}>
                                                    <div className="team-position" style={{
                                                        color: '#666',
                                                        fontSize: '14px'
                                                    }}>
                                                        {position}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Baris 1 - Foto */}
                                        {teams.map((team, index) => (
                                            <div key={`photo-${team.id}`} className="team-member" style={{ textAlign: 'center' }}>
                                                {team.photo ? (
                                                    <img
                                                        src={`${API_BASE_URL}uploads/${team.photo}`}
                                                        alt={`Anggota Tim ${index + 1}`}
                                                        className="team-photo"
                                                        style={{
                                                            width: '3cm',
                                                            height: '4cm',
                                                            objectFit: 'cover',
                                                            border: '2px solid #0066cc',
                                                            borderRadius: '4px',
                                                            marginBottom: '10px'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="team-photo"
                                                        style={{
                                                            width: '3cm',
                                                            height: '4cm',
                                                            border: '2px solid #0066cc',
                                                            borderRadius: '4px',
                                                            background: '#f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginBottom: '10px'
                                                        }}
                                                    >
                                                        <i className="ph ph-user" style={{ fontSize: '2rem', color: '#0066cc' }}></i>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {/* Baris 2 - Nama */}
                                        {teams.map((team) => (
                                            <div key={`name-${team.id}`} className="team-member" style={{ textAlign: 'center' }}>
                                                <div className="team-name" style={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '5px',
                                                    color: '#333'
                                                }}>
                                                    {team.name}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Baris 3 - Jabatan */}
                                        {teams.map((team) => (
                                            <div key={`position-${team.id}`} className="team-member" style={{ textAlign: 'center' }}>
                                                <div className="team-position" style={{
                                                    color: '#666',
                                                    fontSize: '14px'
                                                }}>
                                                    {team.position}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Contact Info sesuai template */}
                            <div className="contact-info" style={{
                                marginTop: '40px',
                                padding: '20px',
                                background: '#f5f9ff',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}>
                                <h3 style={{
                                    color: '#0066cc',
                                    marginTop: 0,
                                    marginBottom: '15px'
                                }}>
                                    Alamat/Hubungi Kami:
                                </h3>
                                
                                <div style={{ lineHeight: '1.6', color: '#333' }}>
                                    {settings.address ? (
                                        <>
                                            <p style={{ marginBottom: '8px' }}>{settings.address}</p>
                                            {settings.phone && (
                                                <p style={{ marginBottom: '8px' }}>Telp. {settings.phone}</p>
                                            )}
                                            {settings.email && (
                                                <p style={{ marginBottom: '8px' }}>E-mail: {settings.email}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p style={{ marginBottom: 0 }}>
                                            Jl. Letjen Sutoyo, Mojosongo, Jebres, Surakarta, Jawa Tengah<br />
                                            Telp. 0271-856929<br />
                                            Mobile. 081357267822<br />
                                            E-mail: voiceofnetizen62@gmail.com
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS Responsive sesuai template tim.html */}
            <style jsx>{`
                .team-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 20px;
                    margin-bottom: 40px;
                }
                
                .team-member {
                    text-align: center;
                }
                
                .team-photo {
                    width: 3cm;
                    height: 4cm;
                    object-fit: cover;
                    border: 2px solid #0066cc;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                
                .team-name {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .team-position {
                    color: #666;
                    font-size: 14px;
                }

                .contact-info {
                    margin-top: 40px;
                    padding: 20px;
                    background: #f5f9ff;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                }
                
                .contact-info h3 {
                    color: #0066cc;
                    margin-top: 0;
                }

                @media(max-width: 1024px) {
                    .team-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                    
                    .content {
                        padding: 10px !important;
                    }
                }
                
                @media(max-width: 768px) {
                    .team-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    
                    .team-container {
                        padding: 15px !important;
                    }
                }
                
                @media(max-width: 480px) {
                    .team-grid {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .team-photo {
                        width: 2.5cm !important;
                        height: 3.5cm !important;
                    }
                    
                    .contact-info {
                        padding: 15px !important;
                    }
                    
                    .default-team .team-member {
                        margin: 0 10px 15px 0 !important;
                        width: 2.5cm !important;
                    }
                }
            `}</style>
        </>
    );
}

export default TeamPage;
