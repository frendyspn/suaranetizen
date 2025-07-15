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
import PollingPage from './pages/user/PollingPage';
import ResultPollingPage from './pages/user/ResultPollingPage';

import PengantarForm from './pages/admin/PengantarForm';

import BannerList from './pages/admin/BannerList';
import BannerForm from './pages/admin/BannerForm';

import AboutForm from './pages/admin/AboutForm';
import AboutPage from './pages/user/AboutPage';

import RegisterPage from './pages/RegisterPage';
import LoginPageUser from './pages/user/LoginPage';


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
            
            
            <Route path="/admin/pengantar" element={<AdminLayout><PengantarForm /></AdminLayout>} />

            <Route path="/admin/banners" element={<AdminLayout><BannerList/></AdminLayout>}/>
            <Route path="/admin/banner/create" element={<AdminLayout><BannerForm/></AdminLayout>}/>
            <Route path="/admin/banner/:id/edit" element={<AdminLayout><BannerForm/></AdminLayout>}/>

            <Route path="/admin/about" element={<AdminLayout><AboutForm /></AdminLayout>} />


            {/* USER */}
            <Route
                index
                path="/"
                element={
                    <UserLayout>
                        <HomePage />
                    </UserLayout>

                }
            />
            <Route
                index
                path="/quote/:id"
                element={
                    <UserLayout>
                        <QuotePage />
                    </UserLayout>

                }
            />

            <Route
                index
                path="/quotes"
                element={
                    <UserLayout>
                        <QuotePage />
                    </UserLayout>

                }
            />

            <Route
                path="/home"
                element={
                    <UserLayout>
                        <HomePage />
                    </UserLayout>

                }
            />

            <Route
                path="/pollings"
                element={
                    <UserLayout>
                        <PollingPage />
                    </UserLayout>

                }
            />

            <Route
                path="/result"
                element={
                    <UserLayout>
                        <ResultPollingPage />
                    </UserLayout>

                }
            />

            <Route
                path="/polling/:id"
                element={
                    <UserLayout>
                        <PollingDetailPage />
                    </UserLayout>

                }
            />

            <Route
                path="/about"
                element={
                    <UserLayout>
                        <AboutPage />
                    </UserLayout>

                }
            />

            <Route path="/registrasi" element={<RegisterPage />} />

            <Route path="/user-login" element={<LoginPageUser />} />


        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
