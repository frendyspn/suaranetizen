import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div >
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
