import React, { useEffect, useState } from 'react';
import axios from '../../axios';

export default function AboutPage() {
    const [content, setContent] = useState('');
    useEffect(() => {
        axios.get('/user/about').then(res => setContent(res.data?.content || ''));
    }, []);

    return (
        <div className="container mt-4">
            {content}
        </div>
    );
}
