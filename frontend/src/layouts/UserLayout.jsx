import React, {useContext} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { SettingContext } from '../contexts/SettingContext';
import { API_BASE_URL } from '../constants';

const UserLayout = ({ children }) => {
    const settings = useContext(SettingContext);
    

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
                
                <div className="top-navbar flex-between gap-16">
                    <Navbar />
                    
                    
                    
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

export default UserLayout;
