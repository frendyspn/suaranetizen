import React from 'react';

const Navbar = () => {
    return (
        <div className="flex-align gap-16">
                
                <button type="button" className="toggle-btn d-xl-none d-flex text-26 text-gray-500"><i className="ph ph-list"></i></button>

                
                <form action="#" className="w-350 d-sm-block d-none">
                    <div className="position-relative">
                        <button type="submit" className="input-icon text-xl d-flex text-gray-100 pointer-event-none"><i className="ph ph-magnifying-glass"></i></button> 
                        <input type="text" className="form-control ps-40 h-40 border-transparent focus-border-main-600 bg-main-50 rounded-pill placeholder-15" placeholder="Search..." />
                    </div>
                </form>
            </div>
    );
};

export default Navbar;
