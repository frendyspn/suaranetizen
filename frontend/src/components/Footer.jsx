import React from 'react';

const Footer = () => {
    return (
        <footer className="dashboard-footer p-4 text-center text-sm text-gray-500 border-top mt-5">
            © {new Date().getFullYear()} SuaraNetizen. All rights reserved.
        </footer>
    );
};

export default Footer;
