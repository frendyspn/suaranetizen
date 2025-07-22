import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function AboutForm() {
    const [content, setContent] = useState('');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user/about').then(res => {
            setContent(res.data?.content || '');
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const submit = async e => {
        e.preventDefault();
        await axios.put('/admin/about', { content });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='card p-4'>
            <div className='card-header'>
                <h3>Edit About Us</h3>
            </div>
            <div className='card-body'>
                {saved && <div className="alert alert-success">Tersimpan!</div>}
                <form onSubmit={submit}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                            setContent(editor.getData());
                        }}
                        config={{
                            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
                        }}
                    />
                    <button className="btn btn-success mt-3">Simpan</button>
                </form>
            </div>
        </div>
    );
}
