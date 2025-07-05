import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

const PollingDetailPage = () => {
    const { id } = useParams();
    const [polling, setPolling] = useState(null);
    const [nominal, setNominal] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('user_token');

    useEffect(() => {
        axios.get(`/user/polling/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setPolling(res.data));
    }, [id]);

    const handleGenerateQris = async () => {
        if (!nominal || parseInt(nominal) < 1000) {
            alert('Nominal minimal 1000');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`/user/polling/${id}/generate-qris`, { nominal }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPolling(res.data);
        } catch (err) {
            alert('Gagal generate QRIS');
        } finally {
            setLoading(false);
        }
    };

    if (!polling) return <p>Loading...</p>;

    return (
        <div className="container">
            <h3>Detail Polling</h3>
            <p><strong>Kategori:</strong> {polling.kategori?.nama}</p>
            <p><strong>Polling:</strong> {polling.kalimat}</p>

            {polling.qris_url ? (
                <div className="mt-4 text-center">
                    <h5>Silakan Scan QR untuk Donasi</h5>
                    <img src={polling.qris_url} alt="QRIS" style={{ maxWidth: 300 }} />
                    <p className="mt-2">Nominal: Rp {parseInt(polling.nominal).toLocaleString()}</p>
                </div>
            ) : (
                <div className="mt-4">
                    <label>Masukkan nominal donasi</label>
                    <input
                        type="number"
                        className="form-control mb-2"
                        value={nominal}
                        onChange={e => setNominal(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleGenerateQris} disabled={loading}>
                        {loading ? 'Memproses...' : 'Lanjutkan Donasi'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PollingDetailPage;
