import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DonasiForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        nama_donasi: '',
        target: '',
        is_active: true,
        status: 'new',
        expired_date: ''
    });

    useEffect(() => {
        if (isEdit) {
            axios.get(`/admin/donasi/${id}`).then(res => {
                setForm(res.data);
            });
        }
    }, [id]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/admin/donasi/${id}`, form);
            } else {
                await axios.post('/admin/donasi', form);
            }
            toast.success('Donasi berhasil disimpan!');
            navigate('/admin/donasi');
        } catch (err) {
            alert('Gagal menyimpan data');
        }
    };

    return (
        <div className="card p-4">

            <form onSubmit={handleSubmit}>
                <div className='card-header d-flex justify-content-between align-items-center'>
                    <h3 className="card-title">{isEdit ? 'Edit Donasi' : 'Tambah Donasi'}</h3>
                </div>
                <div className='card-body'>
                    <div className="mb-2">
                        <label>Nama Donasi</label>
                        <input className="form-control" name="nama_donasi" value={form.nama_donasi} onChange={handleChange} required />
                    </div>
                    <div className="mb-2">
                        <label>Target</label>
                        <input className="form-control" name="target" value={form.target} onChange={handleChange} type="number" required />
                    </div>
                    <div className="mb-2">
                        <label>Expired Date</label>
                        <input className="form-control" name="expired_date" value={form.expired_date} onChange={handleChange} type="date" required />
                    </div>
                    <div className="mb-2">
                        <label>Status</label>
                        <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                            <option value="new">New</option>
                            <option value="onprogress">On Progress</option>
                            <option value="finish">Finish</option>
                            <option value="reject">Reject</option>
                        </select>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" checked={form.is_active} name="is_active" onChange={handleChange} />
                        <label className="form-check-label">Aktif</label>
                    </div>
                    <button className="btn btn-success" type="submit">Simpan</button>
                </div>
            </form>
        </div>
    );
};

export default DonasiForm;
