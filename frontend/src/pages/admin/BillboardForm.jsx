import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(event, editor) => {
                                setContent(editor.getData());
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
                                height: 400
                            }}
                        />
                    </div>
                    <button className="btn btn-success mt-3">Simpan Billboard</button>
                </form>
            </div>
        </div>
    );
}