import React, {useState, useContext} from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/NavbarAdmin';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { SettingContext } from '../contexts/SettingContext';
import { API_BASE_URL } from '../constants';

const AdminLayout = ({ children }) => {
    const settings = useContext(SettingContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div >
            <Helmet>
                {settings.site_thumbnail && (
                    <meta property="og:image" content={`${API_BASE_URL}uploads/${settings.site_thumbnail}`} />
                )}
            </Helmet>
            <div className="side-overlay"></div>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className="dashboard-main-wrapper">
                
                <div className="top-navbar flex-between gap-16">
                    <Navbar />
                    <span>{JSON.stringify(sidebarOpen)}</span>
                    
                    
                </div>
            

            <div className="dashboard-body">
                {children}
            </div>

            <div className="dashboard-footer">
                <Footer />
            </div>
            </div>
        </div>
    );
};

export default AdminLayout;
