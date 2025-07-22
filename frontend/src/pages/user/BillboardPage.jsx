import React, { useEffect, useState } from 'react';
import axios from '../../axios';

const BillboardPage = () => {
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

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4">Billboard</h1>
                            <div 
                                className="billboard-content"
                                dangerouslySetInnerHTML={{ __html: billboard }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillboardPage;