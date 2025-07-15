import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import {jwtDecode} from 'jwt-decode';
// import FacebookLogin from 'react-facebook-login-lite';

import {GOOGLE_CLIENT_ID} from '../constants';

// const GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
// const FB_APP_ID = 'xxxxxxxxxxxxx';

export default function RegisterPage() {
    // form biasa
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');

    // ===== handle pendaftaran manual
    const submitManual = async e => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/user/register', form);
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal daftar');
        }
    };

    // ===== handler token dari popup social
    useEffect(() => {
        const handler = ev => {
            if (ev.data?.token) {
                localStorage.setItem('token', ev.data.token);
                window.location.href = '/';
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // callback Google (token id)
    const onGoogleSuccess = credentialResponse => {
        // const { email, name } = jwtDecode(credentialResponse.credential);
        // buka popup backend untuk login & kirim token
        window.open(`/api/auth/google/redirect`, '_blank', 'width=500,height=600');
    };

    // callback Facebook
    // const onFbResponse = () => {
    //     window.open(`/api/auth/facebook/redirect`, '_blank', 'width=500,height=600');
    // };

    return (
        <div className="container mt-4" style={{ maxWidth: 460 }}>
            <h3 className="mb-3">Registrasi</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submitManual}>
                <input className="form-control mb-2" placeholder="Nama"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" className="form-control mb-3" placeholder="Password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <input type="password" className="form-control mb-3" placeholder="Password Confirmation"
                    value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} />
                <button className="btn btn-primary w-100">Daftar</button>
            </form>

            <div className="divider text-center my-3"><span>atau</span></div>

            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={onGoogleSuccess} onError={() => alert('Login gagal')} width="100%" />
            </GoogleOAuthProvider>

            {/* <FacebookLogin
                appId={FB_APP_ID}
                onFail={() => alert('FB Login gagal')}
                onProfileSuccess={onFbResponse}
                render={renderProps => (
                    <button onClick={renderProps.onClick} className="btn btn-facebook w-100 mt-2">
                        Login dengan Facebook
                    </button>
                )}
            /> */}
        </div>
    );
}
