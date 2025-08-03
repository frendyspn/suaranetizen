import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import CKEditor5Component from '../../components/CKEditor5Component';
import { editorConfigs } from '../../components/CKEditorConfigs';


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
                    {/* <CKEditorComponent
                        data={content}
                        onChange={(event, editor) => {
                            setContent(editor.getData());
                        }}
                        height="400px"
                    /> */}
                    <CKEditor5Component
            data={content}
            onChange={setContent}
            placeholder="Type something..."
            height="300px"
            mode="full"
          />
                    <button className="btn btn-success mt-3">Simpan</button>
                </form>
            </div>
        </div>
    );
}
