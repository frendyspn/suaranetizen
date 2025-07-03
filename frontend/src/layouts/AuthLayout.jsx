import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-page bg-light d-flex justify-content-center align-items-center vh-100">
            {children}
        </div>
    );
};

export default AuthLayout;
