import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';

export default function BannerForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const nav = useNavigate();

    const [form, setForm] = useState({
        title: '', link: '', sort_order: 0, is_active: false, image: null, preview: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // load data ketika edit
    useEffect(() => {
        if (isEdit) {
            axios.get(`/admin/banners/${id}`).then(({ data }) => {
                setForm(f => ({
                    ...f,
                    title: data.title || '',
                    link: data.link || '',
                    sort_order: data.sort_order,
                    is_active: data.is_active,
                    preview: data.image_url
                }));
            });
        }
    }, [id, isEdit]);

    const handleChange = e => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setForm(f => ({ ...f, image: files[0], preview: URL.createObjectURL(files[0]) }));
        } else {
            setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'preview') return;
            if (k === 'image' && !v) return; // skip if no new file
            fd.append(k, v);
        });
        try {
            console.log('Form data:', Object.fromEntries(fd.entries()));
            if (isEdit) {
                await axios.post(`/admin/banners/${id}`, fd);
                setSuccess('Banner berhasil diubah!');
            } else {
                await axios.post('/admin/banners', fd);
                setSuccess('Banner berhasil ditambahkan!');
            }
            setTimeout(() => nav('/admin/banners'), 1200);
        } catch (err) {
            setError(err.response?.data?.errors || err.response?.data?.message);
        }
    };

    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className="mb-3">{isEdit ? 'Ubah' : 'Tambah'} Banner</h3>
            </div>

            <div className='card-body'>
                {error && <ErrorModal error={error} onClose={() => setError('')} />}
                {success && <SuccessModal message={success} onClose={() => setSuccess('')} />}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="form-label">Judul</label>
                        <input name="title" value={form.title} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Link (opsional)</label>
                        <input name="link" value={form.link} onChange={handleChange} className="form-control" />
                    </div>
                    {/* <div className="mb-3">
                        <label className="form-label">Urutan</label>
                        <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="form-control" />
                    </div> */}
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" name="is_active"
                            checked={form.is_active} onChange={handleChange} />
                        <label className="form-check-label">Set sebagai banner aktif</label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gambar {isEdit ? '(biarkan kosong jika tidak ganti)' : ''}</label>
                        <input type="file" accept="image/*" name="image" onChange={handleChange} className="form-control" />
                        <small className='text-danger'>Disarankan 1250 pixel x 250 pixel</small>
                        {form.preview && <img alt="" src={form.preview} className="img-fluid mt-2" style={{ maxWidth: 300 }} />}
                    </div>
                    <button className="btn btn-success">Simpan</button>
                </form>
            </div>
        </div>
    );
}
