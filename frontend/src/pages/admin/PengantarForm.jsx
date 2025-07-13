import React, { useEffect, useState } from 'react';
import axios from '../../axios';

const PengantarForm = () => {
    const [content, setKonten] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        axios.get('/user/introduction').then(res => setKonten(res.data?.content || ''));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        await axios.put('/admin/introduction', { content });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className='card'>
            <div className='card-header'>
                <h3>Edit Pengantar Beranda</h3>
            </div>
            <div className='card-body'>
            {saved && <div className="alert alert-success">Tersimpan!</div>}
            <form onSubmit={handleSubmit}>
                <textarea
                    className="form-control"
                    rows="10"
                    value={content}
                    onChange={e => setKonten(e.target.value)}
                />
                <button className="btn btn-success mt-3">Simpan</button>
            </form>
            </div>
        </div>
    );
};

export default PengantarForm;
