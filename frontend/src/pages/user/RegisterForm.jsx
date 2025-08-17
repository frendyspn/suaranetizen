import React, { useState } from 'react';
import axios from '../../axios';

const RegisterForm = ({ onRegister }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/user/register', form);
            // Panggil onRegister dengan data user yang berhasil register
            onRegister(res.data);
        } catch (err) {
            console.error('Register error:', err);
            setError(err.response?.data?.message || 'Gagal registrasi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                }}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                }}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                }}
            />

            <input
                type="password"
                name="password_confirmation"
                placeholder="Ulangi Password"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    margin: '5px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                }}
            />

            <button 
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '10px',
                    background: loading ? '#cccccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Loading...' : 'Daftar'}
            </button>
        </form>
    );
};

export default RegisterForm;
