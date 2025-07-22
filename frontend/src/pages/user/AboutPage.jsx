import React, { useEffect, useState } from 'react';
import axios from '../../axios';

export default function AboutPage() {
    const [content, setContent] = useState('');
    useEffect(() => {
        axios.get('/user/about').then(res => setContent(res.data?.content || ''));
    }, []);

    return (
        <div className="container mt-4 col-lg-6 col-md-8 colxs-12">
            <div 
                    className="about-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
        </div>
    );
}
