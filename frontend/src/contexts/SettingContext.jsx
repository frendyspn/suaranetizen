import { createContext, useEffect, useState } from "react";
import axios from "../axios";
import { API_BASE_URL } from "../constants";

import ErrorModal from '../components/ErrorModal';

export const SettingContext = createContext({});

export function SettingProvider({ children }) {
    const [settings, setSettings] = useState({});

    const [error, setError] = useState('');

    useEffect(() => {
        axios.get("/user/settings")
        .then(res => {
            setSettings(res.data);
            if (res.data.site_title) document.title = res.data.site_title;
            if (res.data.site_favicon) {
                const link = document.querySelector("link[rel~='icon']");
                if (link) {
                    link.href = `${API_BASE_URL}uploads/${res.data.site_favicon}`;
                }
            }
        })
        .catch(err => {
            setError(
                err.response?.data?.error || err.response?.data?.message
            );
        });
    }, []);

    return (
        <>
        {error && <ErrorModal message={error} onClose={() => setError('')} />}
            <SettingContext.Provider value={settings}>
            {children}
        </SettingContext.Provider>
        </>
        
    );
}
