import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import CKEditorComponent from '../../components/CKEditor5Component';


export default function BillboardForm() {
    const [content, setContent] = useState('');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/admin/billboard').then(res => {
            setContent(res.data?.content || '');
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const submit = async e => {
        e.preventDefault();
        try {
            await axios.put('/admin/billboard', { content });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Error saving billboard:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='card p-4'>
            <div className='card-header'>
                <h3>Edit Billboard</h3>
            </div>
            <div className='card-body'>
                {saved && <div className="alert alert-success">Billboard berhasil disimpan!</div>}
                <form onSubmit={submit}>
                    <div className="ckeditor-wrapper">
                        <CKEditorComponent
                            data={content}
                            onChange={(editorData) => {
                                setContent(editorData);
                            }}
                            height="400px"
                        />
                    </div>
                    <button className="btn btn-success mt-3">Simpan Billboard</button>
                </form>
            </div>
        </div>
    );
}