import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';

const KategoriForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        nama: '',
        is_active: true
    });

    useEffect(() => {
        if (isEdit) {
            axios.get(`/admin/kategori/${id}`).then(res => {
                setForm(res.data);
            });
        }
    }, [id, isEdit]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/admin/kategori/${id}`, form);
                alert('Berhasil diubah');
            } else {
                await axios.post(`/admin/kategori`, form);
                alert('Berhasil ditambahkan');
            }
            navigate('/admin/kategori');
        } catch (err) {
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else if (err.response?.data?.errors?.nama) {
                alert(err.response.data.errors.nama.join(' '));
            } else {
                alert('Gagal menyimpan kategori');
            }
        }
    };

    return (
        <div className="card p-4">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>{isEdit ? 'Edit' : 'Tambah'} Kategori</h3>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/kategori')}>
                    Kembali
                </button>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <h4>{isEdit ? 'Edit' : 'Tambah'} Kategori</h4>
                    <div className="mb-3">
                        <label>Nama</label>
                        <input type="text" name="nama" value={form.nama} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" name="is_active" className="form-check-input" checked={form.is_active} onChange={handleChange} />
                        <label className="form-check-label">Aktif</label>
                    </div>
                    <button className="btn btn-success">Simpan</button>
                </form>
            </div>
        </div>
        
    );
};

export default KategoriForm;
