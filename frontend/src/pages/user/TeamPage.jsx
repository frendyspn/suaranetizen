import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

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
        <div>
            {/* Team Section */}
            <section id="team" className="py-5">
                <div className="container">
                    {/* Section Header */}
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h2 className="display-5 fw-bold text-primary mb-3">Tim Kami</h2>

                        </div>
                    </div>

                    {/* Team Cards */}
                    <div className="row g-4">
                        {teams.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <i className="ph ph-users" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                                <p className="text-muted mt-3">Belum ada data tim tersedia</p>
                            </div>
                        ) : (
                            teams.map(team => (
                                <div key={team.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                    <div className="card border-0 shadow-sm h-100 team-card">
                                        <div className="card-body text-center p-4">
                                            {/* Photo */}
                                            <div className="mb-4">
                                                <div
                                                    className="rounded-circle overflow-hidden border border-3 border-white shadow-sm d-inline-block"
                                                    style={{ width: '120px', height: '120px' }}
                                                >
                                                    {team.photo ? (
                                                        <img
                                                            src={`${API_BASE_URL}uploads/${team.photo}`}
                                                            alt={team.name}
                                                            className="w-100 h-100"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="ph ph-user text-white" style={{ fontSize: '3rem' }}></i>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <h5 className="card-title fw-bold text-dark mb-2">
                                                {team.name}
                                            </h5>

                                            {/* Position */}
                                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                                {team.position}
                                            </span>

                                            {/* Contact Info (if available) */}
                                            {team.email && (
                                                <div className="mt-3">
                                                    <small className="text-muted">
                                                        <i className="ph ph-envelope me-1"></i>
                                                        {team.email}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Company Info Footer */}
                    {(settings.address || settings.phone) && (
                        <div className="row mt-12">
                            <div className="col-12">
                                <div className="contact-section">
                                    <div className="contact-background">
                                        <div className="contact-pattern"></div>
                                        <div className="contact-glow"></div>
                                    </div>

                                    <div className="contact-content">

                                        <div className="col-12 text-center">
                                            <h3 className="display-5 fw-bold text-primary mb-3">Kunjungi Kami</h3>

                                        </div>

                                        <div className="contact-cards">
                                            <div className="row g-4 justify-content-center">
                                                {settings.address && (
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="contact-card d-flex">
                                                            <div className="contact-card-icon">
                                                                <i className="ph ph-map-pin"></i>
                                                            </div>
                                                            <div className="contact-card-content">
                                                                <h6>Alamat Kami</h6>
                                                                <p>{settings.address}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {settings.phone && (
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="contact-card d-flex">
                                                            <div className="contact-card-icon">
                                                                <i className="ph ph-phone"></i>
                                                            </div>
                                                            <div className="contact-card-content">
                                                                <h6>Telepon</h6>
                                                                <p>{settings.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default TeamPage;
