import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import DonasiList from './pages/admin/DonasiList';
import DonasiForm from './pages/admin/DonasiForm';
import KategoriList from './pages/admin/KategoriList';
import KategoriForm from './pages/admin/KategoriForm';

import HomePage from './pages/user/HomePage';
import PollingDetailPage from './pages/user/PollingDetailPage';
import QuotePage from './pages/user/QuotePage';

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

            <Route path="/admin/kategori" element={<AdminLayout><KategoriList /></AdminLayout>} />
            <Route path="/admin/kategori/create" element={<AdminLayout><KategoriForm /></AdminLayout>} />
            <Route path="/admin/kategori/:id/edit" element={<AdminLayout><KategoriForm /></AdminLayout>} />




            {/* USER */}
            <Route
                index
                path="/"
                element={
                    <PrivateRoute>
                        <UserLayout>
                            <HomePage />
                        </UserLayout>
                    </PrivateRoute>
                }
            />
            <Route
                index
                path="/quote/:id"
                element={
                    <PrivateRoute>
                        <UserLayout>
                            <QuotePage />
                        </UserLayout>
                    </PrivateRoute>
                }
            />

            <Route
                index
                path="/quotes"
                element={
                    <PrivateRoute>
                        <UserLayout>
                            <QuotePage />
                        </UserLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <UserLayout>
                            <HomePage />
                        </UserLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/polling/:id"
                element={
                    <PrivateRoute>
                        <UserLayout>
                            <PollingDetailPage />
                        </UserLayout>
                    </PrivateRoute>
                }
            />

        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
