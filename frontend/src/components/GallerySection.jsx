import { useEffect, useState } from "react";
import axios from "../axios";
import { API_BASE_URL } from "../constants";

const GallerySection = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("/user/galleries").then(res => setItems(res.data));
    }, []);

    return (
        <section className="p-4">
            <div className="row g-3">
                {items.map(g => (
                    <div key={g.id} className="col-6 col-sm-4 col-md-3">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={`${API_BASE_URL}uploads/${g.image}`}
                                alt={g.title}
                                className="card-img-top rounded bg-light"
                                style={{
                                    objectFit: 'contain',
                                    width: '100%',
                                    maxHeight: 180,
                                    minHeight: 100,
                                    background: '#f8f9fa'
                                }}
                            />
                            <div className="card-body p-2">
                                <p className="card-text text-center text-truncate mb-0">{g.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
