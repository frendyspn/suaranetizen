import React, { useEffect, useState, useCallback, use } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import LoginForm from '../../pages/user/LoginForm';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';


const PollingPage = () => {
    const [dataPolling, setDataPolling] = useState([]);
    const [selectedPollingIds, setSelectedPollingIds] = useState([]); // array untuk multiple select
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(false);
    const navigate = useNavigate();

    const handleGetPolling = useCallback(async () => {
        try {
            const res = await axios.get('/user/pollings', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDataPolling(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    }, []);

    useEffect(() => {
        handleGetPolling();
    }, [handleGetPolling]);

    useEffect(() => {
        console.log('Errornya:', error);
    }, [error]);
    

    // Multiple select handler
    const handleSelect = (id) => {
        setSelectedPollingIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // alert('Silakan login terlebih dahulu!');
            setShowLoginForm(true);
            // navigate('/login');
            return;
        }

        const user_id = null;

        const postData = dataPolling.map(polling => ({
            id_polling: polling.id,
            user_id: user_id,
            nilai: selectedPollingIds.includes(polling.id),
        }));

        console.log('Post Data:', postData);

        try {
            await axios.post('/user/polling-vote', postData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Pilihan berhasil dikirim!');
            handleGetPolling(); // Refresh polling data
            setSelectedPollingIds([]); // Reset selected polling ids
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim pilihan');
        }
    };

    const handleLogin = async (email, password) => {
        setError('');
        try {
            const res = await axios.post('/user/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            handleGetPolling();
            setShowLoginForm(false);
        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.errors || err.response?.data?.message);
        }
    };

    return (
        <div className="rounded p-5" style={{ backgroundColor: '#3053a7' }}>
            {error && (
                
                <ErrorModal error={error} onClose={() => setError('')} />
            )}
            {success && (
                <SuccessModal message={success} onClose={() => setSuccess('')} />
            )}

            <div className='row'>
                <div className='col-md-4 col-sm-12 text-center' style={{ alignContent: 'center' }}>
                    <span className='text-white'>Join At</span>
                    <h4 className='text-white'>{WEB_NAME}</h4>
                </div>
                <div className='col-md-8 col-sm-12'>
                    <div className='bg-white rounded m-5'>
                        {showLoginForm ? (
                            <div className="modal-login p-3">
                                <h5 className="mb-3">Silakan Login untuk Melanjutkan</h5>
                                <LoginForm onLogin={handleLogin} />
                            </div>
                        )
                            : (
                                <>
                                    <div className='headQuote p-3'>
                                        {
                                            dataPolling.length > 0 && (
                                                <p className=''>Daftar Pesan / Quote yang Masuk </p>
                                            )
                                        }
                                        
                                    </div>
                                    <div className='dataQuote p-3'>
                                        { dataPolling.length === 0 ? (
                                            <h5 className="text-center text-danger">Tidak ada polling yang tersedia</h5>
                                        ) : (
                                        dataPolling.map((polling) => (
                                            <div
                                                key={polling.id}
                                                className={`flex-align gap-8 mb-5 border-bottom pb-5 ${selectedPollingIds.includes(polling.id) ? 'bg-main-100' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleSelect(polling.id)}
                                            >
                                                <div className={`w-40 h-40 rounded-circle ${selectedPollingIds.includes(polling.id) ? 'bg-main-600' : 'bg-gray-200'} flex-center flex-shrink-0`}>
                                                    {selectedPollingIds.includes(polling.id) ? (
                                                        <i className="ph ph-check-fat text-white text-24"></i>
                                                    ) : (
                                                        <i className="ph ph-circle text-gray-500 text-24"></i>
                                                    )}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">{polling?.kalimat}</h6>
                                                    {polling?.kategori && (
                                                        <div className="table-list">
                                                            <span className="text-13 text-gray-600">{polling?.kategori}</span>
                                                        </div>
                                                    )}
                                                    <div className="table-list">
                                                        <span className="text-13 text-gray-600">Quote dari <strong>{polling?.user?.name}</strong></span>
                                                        <span className="text-13 text-gray-600">{formatCurrencyPrefix(polling?.polling_votes_count)} Netizen Memilih Ini</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )))}
                                        
                                    </div>
                                </>
                            )}
                    </div>
                    {
                        !showLoginForm && dataPolling.length > 0  && (
                            <div className='m-5'>
                                <button className='btn border w-100' onClick={handleSubmit}>Submit Pilihan</button>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default PollingPage;