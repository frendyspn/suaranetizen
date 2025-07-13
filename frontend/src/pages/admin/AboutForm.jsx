import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import MdEditor from 'react-markdown-editor-lite';
import Markdown from 'react-markdown';


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
        <div>
            <h3 className="mb-3">Edit “About Us”</h3>
            {saved && <div className="alert alert-success">Tersimpan!</div>}
            <form onSubmit={submit}>
                <MdEditor
                    value={content}
                    style={{ height: '500px' }}
                    renderHTML={text => <Markdown>{text}</Markdown>}
                    onChange={({ text }) => setContent(text)}
                />
                <button className="btn btn-success mt-3">Simpan</button>
            </form>
        </div>
    );
}
