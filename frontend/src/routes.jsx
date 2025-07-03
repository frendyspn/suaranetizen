import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './layouts/AdminLayout';

import DonasiList from './pages/admin/DonasiList';
import DonasiForm from './pages/admin/DonasiForm';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/admin/dashboard"
                element={
                    <PrivateRoute>
                        <AdminLayout>
                            <DashboardPage />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />
            <Route path="/admin/donasi" element={<AdminLayout><DonasiList /></AdminLayout>} />
            <Route path="/admin/donasi/create" element={<AdminLayout><DonasiForm /></AdminLayout>} />
            <Route path="/admin/donasi/:id/edit" element={<AdminLayout><DonasiForm /></AdminLayout>} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
