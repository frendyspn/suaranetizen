import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Link } from 'react-router-dom';

const KategoriList = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get('/admin/kategori').then(res => setList(res.data));
    }, []);

    return (
        <div className='card'>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Daftar Kategori</h3>
                <Link to="/admin/kategori/create" className="btn btn-primary">Tambah Kategori</Link>
            </div>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Aktif</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(k => (
                            <tr key={k.id}>
                                <td>{k.nama}</td>
                                <td>{k.is_active ? 'Ya' : 'Tidak'}</td>
                                <td>
                                    <Link to={`/admin/kategori/${k.id}/edit`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KategoriList;
