import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <a href="/" className="sidebar__logo text-center p-20">
                <img src="/assets/images/logo/logo.png" alt="Logo" />
            </a>

            <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
                <div className="p-20 pt-10">
                    <ul className="sidebar-menu">
                        <li className="sidebar-menu__item">
                            <Link to="/admin/dashboard" className="sidebar-menu__link">
                                <span className="icon"><i className="ph ph-squares-four"></i></span>
                                <span className="text">Dashboard</span>
                            </Link>
                        </li>
                        {/* Tambahkan menu lain di sini */}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
