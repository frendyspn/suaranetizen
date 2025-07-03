import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Link } from 'react-router-dom';

const DonasiList = () => {
    const [donasi, setDonasi] = useState([]);

    useEffect(() => {
        axios.get('/admin/donasi').then(res => {
            setDonasi(res.data);
        });
    }, []);

    return (
        <div className="card p-4">
            <div className='card-header'>
<h3>Master Donasi</h3>
            <Link to="/admin/donasi/create" className="btn btn-primary mb-3">Tambah Donasi</Link>
            </div>
            
            <div className='card-body'>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Target</th>
                        <th>Status</th>
                        <th>Expired</th>
                        <th>Active</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {donasi.map(d => (
                        <tr key={d.id}>
                            <td>{d.nama_donasi}</td>
                            <td>{parseInt(d.target).toLocaleString()}</td>
                            <td>{d.status}</td>
                            <td>{d.expired_date}</td>
                            <td>{d.is_active ? 'Aktif' : 'Nonaktif'}</td>
                            <td>
                                <Link to={`/admin/donasi/${d.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default DonasiList;
