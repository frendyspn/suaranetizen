import React, { useState, useEffect } from 'react';
import HeaderBanner from '../components/HeaderBanner';

const Navbar = () => {
    const currentPath = window.location.pathname;
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        // Ganti 'user_token' sesuai nama token Anda
        setIsLogin(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLogin(false);
        window.location.href = '/'; // redirect ke home setelah logout
    };

    return (


        <div className='navbar d-block justify-content-between align-items-center p-3 bg-light' >
            <HeaderBanner />


            <div
                className={`menu-scroll d-md-flex gap-16 py-10`}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',      // menu akan turun ke bawah jika overlap
                    maxWidth: '100%',
                    scrollbarWidth: 'thin'
                }}
            >

                <a href="/" type="button" className={`text-gray-500 ${currentPath === '/' && 'fw-bold'}`}>Home</a>

                <div className='border border-dark'></div>

                <a href="/about" type="button" className={`text-gray-500 ${currentPath === '/about' && 'fw-bold'}`}>Tentang Suara Netizen</a>

                <div className='border border-dark'></div>

                <a href="/pollings" type="button" className={`text-gray-500 ${currentPath === '/pollings' && 'fw-bold'}`}>Polling</a>

                <div className='border border-dark'></div>

                <a href="/result" type="button" className={`text-gray-500 ${currentPath === '/result' && 'fw-bold'}`}>Result</a>

                <div className='border border-dark'></div>

                <a href="/quotes" type="button" className={`text-gray-500 ${currentPath === '/quotes' && 'fw-bold'}`}>Quote Terbit</a>

                <div className='border border-dark'></div>

                <a href="/team" type="button" className={`text-gray-500 ${currentPath === '/team' && 'fw-bold'}`}>Tim</a>

                

                {isLogin && (
                    <>
                    <div className='border border-dark'></div>
                    <button type="button" className="text-gray-500" onClick={handleLogout}>Logout</button>
                    </>
                    
                )}

                {/* <a href="/user-login" type="button" className="text-gray-500">Login</a> */}

                {/* <a href="/registrasi" type="button" className="text-gray-500">Registrasi</a> */}

                {/* <form action="#" className="w-350 d-sm-block d-none">
                    <div className="position-relative">
                        <button type="submit" className="input-icon text-xl d-flex text-gray-100 pointer-event-none"><i className="ph ph-magnifying-glass"></i></button> 
                        <input type="text" className="form-control ps-40 h-40 border-transparent focus-border-main-600 bg-main-50 rounded-pill placeholder-15" placeholder="Search..." />
                    </div>
                </form> */}
            </div>
        </div>
    );
};

export default Navbar;
