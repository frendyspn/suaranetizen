import React, { useState, useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import axios from '../axios';
import handleApiError from "../utils/handleApiError";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    // const { setUser } = useAuth();
    const navigate = useNavigate();
    const [setting, setSetting] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/admin/dashboard");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/login", form);
            const { token, user } = res.data;

            // Simpan token ke axios header
            
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Simpan user ke context
            // setUser(user);

            // Redirect ke admin
            navigate("/admin/dashboard");
        } catch (err) {
            // console.log('handleApiError type:', typeof handleApiError);
            // handleApiError('err')
            setError(handleApiError(err));
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="card p-4" style={{ width: 400 }}>
                <h4 className="mb-3">Login Admin</h4>
                {error && <div className="alert alert-danger mb-24">{error}</div>}
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button className="btn btn-primary w-100" type="submit">Login</button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
