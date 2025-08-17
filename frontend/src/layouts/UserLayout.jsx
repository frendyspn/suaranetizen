import React, {useContext, useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { SettingContext } from '../contexts/SettingContext';
import { API_BASE_URL } from '../constants';
import axios from '../axios';

const UserLayout = ({ children }) => {
    const settings = useContext(SettingContext);
    const [blinkingText, setBlinkingText] = useState('Selamat datang di platform polling terpercaya!');

    useEffect(() => {
        axios.get('/user/introduction')
            .then(res => {
                setBlinkingText(res.data?.content || 'Selamat datang di platform polling terpercaya!');
            })
            .catch(err => {
                console.error('Error fetching blinking text:', err);
                // Keep default text if API fails
            });
    }, []);
    

    return (
        <div >
            <Helmet>
                            {settings.site_thumbnail && (
                                <meta property="og:image" content={`${API_BASE_URL}uploads/${settings.site_thumbnail}`} />
                            )}
                        </Helmet>
            {/* <div className="side-overlay"></div> */}
            {/* <SidebarUser isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/> */}
            <div className="dashboard-main bg-white">
                
                <div className="top-navbar-container" style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'white'
                }}>
                    <div className="top-navbar flex-between gap-16">
                        <Navbar />
                    </div>

                    {/* Blinking Text */}
                    <div style={{
                        backgroundColor: '#0066cc',
                        color: 'white',
                        padding: '12px 0',
                        textAlign: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            animation: 'blink 1.5s linear infinite'
                        }}>
                            {blinkingText}
                        </div>
                    </div>
                </div>
            

            <div className="dashboard-body">
                {children}
            </div>

            <div className="dashboard-footer">
                <Footer />
            </div>
            </div>

            {/* CSS Animation for blinking text */}
            <style jsx>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }

                .top-navbar-container {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                /* Center align navbar */
                .top-navbar {
                    text-align: center !important;
                }

                .top-navbar .navbar {
                    text-align: center !important;
                }

                .top-navbar .navbar .menu-scroll {
                    justify-content: center !important;
                }

                @media (max-width: 480px) {
                    .blinking-text div {
                        font-size: 13px !important;
                    }
                    
                    /* Additional mobile styling for inline styles */
                    div[style*="animation: blink"] {
                        font-size: 13px !important;
                    }

                    .top-navbar-container div[style*="backgroundColor: #0066cc"] div {
                        font-size: 13px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserLayout;
