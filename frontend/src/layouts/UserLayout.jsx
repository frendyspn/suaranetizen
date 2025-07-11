import React, {} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserLayout = ({ children }) => {
    
    

    return (
        <div >
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
