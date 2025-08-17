import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(localStorage.getItem('user_token'));
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Sync with localStorage whenever userToken changes
        if (userToken) {
            localStorage.setItem('user_token', userToken);
        } else {
            localStorage.removeItem('user_token');
        }
    }, [userToken]);

    const value = {
        userToken,
        setUserToken,
        userInfo,
        setUserInfo
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
