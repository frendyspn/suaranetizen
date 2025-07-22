import React, { useEffect, useState } from 'react';
import axios from '../axios';

const BillboardSection = () => {
    const [billboard, setBillboard] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user/billboard').then(res => {
            setBillboard(res.data?.content || '');
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (!billboard) {
        return null; // Jangan tampilkan jika tidak ada konten
    }

    return (
        <section className="billboard-section bg-primary text-white p-4 mb-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div 
                            className="billboard-content text-center"
                            dangerouslySetInnerHTML={{ __html: billboard }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BillboardSection;