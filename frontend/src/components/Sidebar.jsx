import React, {useContext} from 'react';
import axios from '../axios';
import { SettingContext } from "../contexts/SettingContext";
import { API_BASE_URL } from '../constants';


export default function Sidebar() {
    const { site_logo } = useContext(SettingContext);

    const handleLogout = async () => {
    try {
        await axios.post('/admin/logout'); // gunakan baseURL sudah /api
    } catch (err) {
        console.error('Logout error:', err);
    } finally {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login'; // atau navigate('/login')
    }
    };

  return (
    <aside className="sidebar">
    
     <button type="button" className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"><i className="ph ph-x"></i></button>
    
    <a href="index.html" className="sidebar__logo text-center p-20 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-10">
        {site_logo && (
        <img src={`${API_BASE_URL}uploads/${site_logo}`} alt="Logo" className="h-50 mr-3" />
      )}
        
    </a>

    <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
        <div className="p-20 pt-10">
            <ul className="sidebar-menu">
                <li className="sidebar-menu__item has-dropdown">
                    <button
                        type="button"
                        className="sidebar-menu__link"
                        style={{ background: "none", border: "none", padding: 0, width: "100%", textAlign: "left" }}
                    >
                        <span className="icon"><i className="ph ph-gauge"></i></span>
                        <span className="text">Dashboard</span>
                        {/* <span className="link-badge">3</span> */}
                    </button>
                    {/* <ul className="sidebar-submenu">
                        <li className="sidebar-submenu__item">
                            <a href="index.html" className="sidebar-submenu__link"> Dashboard One </a>
                        </li>
                        <li className="sidebar-submenu__item">
                            <a href="index-2.html" className="sidebar-submenu__link"> Dashboard Two </a>
                        </li>
                        <li className="sidebar-submenu__item">
                            <a href="index-3.html" className="sidebar-submenu__link"> Dashboard Three </a>
                        </li>
                    </ul> */}
                </li>
                
                <li className="sidebar-menu__item">
                    <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">Website</span>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/pengantar" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-info"></i></span>
                        <span className="text">Pengantar</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/banners" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-image"></i></span>
                        <span className="text">Banner</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/about" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-user-circle"></i></span>
                        <span className="text">About</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/settings" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-gear"></i></span>
                        <span className="text">Setting</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/teams" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-users"></i></span>
                        <span className="text">Team</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/gallery" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-images"></i></span>
                        <span className="text">Gallery</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/billboard" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-chat-circle-text"></i></span>
                        <span className="text">Billboard</span>
                    </a>
                </li>
                
                <li className="sidebar-menu__item">
                    <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">Master</span>
                </li>
                <li className="sidebar-menu__item">
                    <a href="/admin/donasi" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-hand-heart"></i></span>
                        <span className="text">Donasi</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <a href="/admin/kategori" className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-list-bullets"></i></span>
                        <span className="text">Kategori</span>
                    </a>
                </li>

                <li className="sidebar-menu__item">
                    <button onClick={handleLogout} className="sidebar-menu__link">
                        <span className="icon"><i className="ph ph-sign-out"></i></span>
                        <span className="text">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
        
    </div>

</aside>  
  );
};


