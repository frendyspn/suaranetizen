import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';


const ResultPollingPage = () => {
    const [dataPolling, setDataPolling] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleGetPolling = useCallback(async () => {
        try {
            const res = await axios.get('/user/result-pollings');
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
                        
                                    <div className='headQuote p-3'>
                                        {
                                            dataPolling.length > 0 && (
                                                <p className=''>3 Besar Hasil Poling </p>
                                            )
                                        }
                                        
                                    </div>
                                    <div className='dataQuote p-3'>
                                        { dataPolling.length === 0 ? (
                                            <h5 className="text-center text-danger">Tidak ada polling yang tersedia</h5>
                                        ) : (
                                        dataPolling.map((polling,index) => (
                                            <div
                                                key={polling.id}
                                                className={`flex-align gap-8 mb-5 border-bottom pb-5`}
                                                style={{ cursor: 'pointer' }}
                                                
                                            >
                                                <div className={`w-40 h-40 rounded-circle bg-main-600 flex-center flex-shrink-0`}>
                                                    <span className="text-white text-18">{index+1}</span>
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
                                
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default ResultPollingPage;