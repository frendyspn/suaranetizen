import React from 'react';

const Navbar = () => {
    return (
        <div className="top-navbar flex-between gap-16 px-4 py-3 bg-white border-bottom">
            <h4 className="mb-0">-</h4>
            <div>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="btn btn-sm btn-danger"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
