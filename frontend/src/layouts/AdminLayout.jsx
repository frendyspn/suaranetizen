import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLayout = ({ children }) => {
    return (
        <div className="dashboard-main-wrapper d-flex">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column">
                <Navbar />
                <main className="flex-grow-1 p-4 bg-light">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
