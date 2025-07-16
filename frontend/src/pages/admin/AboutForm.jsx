import React, { useEffect, useState } from 'react';
import axios from '../../axios';


export default function AboutForm() {
    const [content, setContent] = useState('');
    const [saved, setSaved] = useState(false);

    // ambil data awal
    useEffect(() => {
        axios.get('/user/about').then(res => setContent(res.data?.content || ''));
    }, []);

    const submit = async e => {
        e.preventDefault();
        await axios.put('/admin/about', { content });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className='card p-4'>
            <div className='card-header'>
                <h3>Edit About Us</h3>
            </div>
            <div className='card-body'>
                {saved && <div className="alert alert-success">Tersimpan!</div>}
                <form onSubmit={submit}>
                    <textarea
                        className="form-control"
                        rows={12}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <button className="btn btn-success mt-3">Simpan</button>
                </form>
            </div>
        </div>
    );
}
