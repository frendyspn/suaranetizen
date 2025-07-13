import React, { useEffect, useState } from 'react';
import axios from '../axios';

export default function HeaderBanner() {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        axios.get('/user/banner-active').then(res => setBanner(res.data));
    }, []);

    if (!banner) return null;           // tidak ada banner aktif

    const Img = (
        <img
            src={banner.image_url}
            alt={banner.title || 'Banner'}
            style={{ width: '100vw', maxHeight: 250, objectFit: 'cover', display: 'block' }}
        />
    );

    return (
        <div className="mb-4">
            {banner.link
                ? <a href={banner.link} target="_blank" rel="noopener noreferrer">{Img}</a>
                : Img}
        </div>
    );
}
