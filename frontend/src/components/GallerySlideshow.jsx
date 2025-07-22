import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { API_BASE_URL } from '../constants';
import './GallerySlideshow.css';

const GallerySlideshow = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        axios.get("/user/galleries").then(res => setItems(res.data));
    }, []);

    // Auto slideshow
    useEffect(() => {
        if (!isPlaying || items.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 3000); // Ganti slide setiap 3 detik

        return () => clearInterval(interval);
    }, [isPlaying, items.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % items.length);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    if (items.length === 0) {
        return <div className="text-center p-4">Loading gallery...</div>;
    }

    return (
        <section className="gallery-slideshow">
            <div className="container">
                <div className="slideshow-header d-flex justify-content-between align-items-center mb-3">
                    {/* <div className="slideshow-controls">
                        <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={togglePlayPause}
                        >
                            <i className={`ph ${isPlaying ? 'ph-pause' : 'ph-play'}`}></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={goToPrev}
                        >
                            <i className="ph ph-caret-left"></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={goToNext}
                        >
                            <i className="ph ph-caret-right"></i>
                        </button>
                    </div> */}
                </div>

                {/* Main Slideshow */}
                <div className="slideshow-container">
                    <div 
                        className="slideshow-wrapper"
                        style={{ 
                            transform: `translateX(-${currentIndex * 100}%)`,
                            transition: 'transform 0.5s ease-in-out'
                        }}
                    >
                        {items.map((item, index) => (
                            <div key={item.id} className="slide-item">
                                <div className="slide-content">
                                    <img
                                        src={`${API_BASE_URL}uploads/${item.image}`}
                                        alt={item.title}
                                        className="slide-image"
                                    />
                                    <div className="slide-overlay">
                                        <h4 className="slide-title">{item.title}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="slideshow-dots">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>

                {/* Thumbnail Navigation */}
                {/* <div className="thumbnail-nav">
                    <div className="thumbnail-container">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            >
                                <img
                                    src={`${API_BASE_URL}uploads/${item.image}`}
                                    alt={item.title}
                                    className="thumbnail-image"
                                />
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </section>
    );
};

export default GallerySlideshow;