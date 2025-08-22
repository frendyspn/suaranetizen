import React, { useContext } from 'react';
import { SettingContext } from '../contexts/SettingContext';
import { API_BASE_URL } from '../constants';

const Footer = () => {
    const settings = useContext(SettingContext);

    return (
        <footer className="dashboard-footer p-4 text-center text-sm text-gray-500 border-top mt-5">
            {/* {settings.site_logo && (
                <img
                    src={`${API_BASE_URL}uploads/${settings.site_logo}`}
                    alt={settings.site_title || 'Logo'}
                    style={{ height: 32, marginBottom: 8 }}
                />
            )}
            <div>
                <strong>{settings.site_title || 'SuaraNetizen'}</strong>
            </div>
            © {new Date().getFullYear()} SuaraNetizen. All rights reserved. */}
        </footer>
    );
};

export default Footer;
