import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';

export default function BannerList() {
    const [rows, setRows] = useState([]);

    const load = () => axios.get('/admin/banners').then(r => setRows(r.data || []));
    

    useEffect(() => {
        load()
    }, []);

    const del = async (id) => {
        if (window.confirm('Hapus banner?')) {
            await axios.delete(`/admin/banners/${id}`);
            load();
        }
    };

    return (
        <div className='card'>
            <div className='card-header'>
                <h3 className="mb-3">Banner Header</h3>
            </div>
            
            <div className='card-body'>
            <Link to="/admin/banner/create" className="btn btn-primary mb-3">Tambah Banner</Link>
            
            <table className="table align-middle">
                <thead>
                    <tr><th>Gambar</th><th>Judul</th><th>Aktif</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    {rows.map(b => (
                        <tr key={b.id}>
                            <td style={{ width: 160 }}>
                                <img alt="" src={b.image_url} className="img-fluid rounded" />
                            </td>
                            <td>{b.title}</td>
                            <td>
                                {b.is_active
                                    ? <span className="badge bg-success">Aktif</span>
                                    : <span className="badge bg-secondary">Nonaktif</span>}
                            </td>
                            <td>
                                <Link to={`/admin/banner/${b.id}/edit`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                <button onClick={() => del(b.id)} className="btn btn-sm btn-danger">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}
