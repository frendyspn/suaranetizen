import React, { useState } from 'react';
import axios from '../../axios';

const RegisterForm = ({ onSuccess }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/user/register', form);
            const token = res.data.token;
            localStorage.setItem('user_token', token);
            setSuccessMsg('Registrasi berhasil. Anda akan diarahkan...');
            onSuccess(token); // jika ingin redirect otomatis
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal registrasi');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-4">
            <h4 className="mb-3">Daftar Akun</h4>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={handleChange}
                required
            />

            <input
                type="email"
                name="email"
                className="form-control mb-2"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                className="form-control mb-2"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password_confirmation"
                className="form-control mb-3"
                placeholder="Ulangi Password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
            />

            <button className="btn btn-success w-100" type="submit">Daftar</button>
        </form>
    );
};

export default RegisterForm;
