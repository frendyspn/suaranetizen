import React, { useEffect, useState, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import formatCurrency from '../../utils/formatCurrency';

const QuotePage = () => {
    const { id } = useParams();
    const [targetDonasi, setTargetDonasi] = useState(0);
    const [danaTerkumpul, setDanaTerkumpul] = useState(0);
    const [dataDonasi, setDataDonasi] = useState([]);
    const [progress, setProgress] = useState(0);

    const [error, setError] = useState('');
    
    const handleGetDonasi = useCallback(async () => {
        try {
            const res = await axios.get('/user/quote/' + id);
            setDataDonasi(res.data);
            setTargetDonasi(res.data.target);
            setDanaTerkumpul(res.data.polling.reduce((acc, curr) => acc + curr.nominal, 0));
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal submit polling');
        }
    }, [id]);

    useEffect(() => {
        // Simulasi perhitungan progress
        if (targetDonasi > 0) {
            setProgress((danaTerkumpul / targetDonasi) * 100);
        } else {
            setProgress(0);
        }
    }, [targetDonasi, danaTerkumpul]);

    useEffect(() => {
        // Simulasi pengambilan data donasi
        handleGetDonasi();
    }, [handleGetDonasi]);

    

    return (
        <div className="rounded p-5" style={{ backgroundColor: '#3053a7' }}>
            {error && (
            <div className="alert alert-danger mb-3">
                {error}
            </div>
        )}
            <div className='row'>
                <div className='col-4 text-center' style={{alignContent: 'center'}}>
                    <span className='text-white'>Join At</span>
                    <h4 className='text-white'>{WEB_NAME}</h4>
                </div>
                <div className='col-8'>
                    <div className='bg-white rounded m-5'>
                        <div className='headQuote p-3'>
                            <p className=''>Target Donasi {dataDonasi?.nama_donasi}: Rp.{formatCurrency(targetDonasi)}</p>
                            <div class="d-flex gap-8 mt-12 flex-column pe-8">
                                <div class="progress w-100 bg-main-100 rounded-pill h-10" role="progressbar" aria-label="Basic example" >
                                    <div class="progress-bar bg-main-600 rounded-pill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            <p className=''>Dana Terkumpul: Rp.{formatCurrency(danaTerkumpul)}</p>
                        </div>
                        <h1 className='text-center'>Selamat</h1>
                        <div className='dataQuote p-3'>
                            <p>Pesan / Quote Terpilih Berdasarkan Hasil Polling</p>
                            {
                                dataDonasi?.polling?.map((item, index) => (
                                    <div key={index} className='border-bottom pb-2 mb-5'>
                                        <p className='mb-1'>{item.kalimat}</p>
                                        <div class="d-flex gap-8 flex-column pe-8">
                                            <div class="progress w-100 bg-info-100 rounded-pill h-10" role="progressbar" aria-label="Basic example" >
                                                <div class="progress-bar bg-info-600 rounded-pill" style={{ width: `100%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default QuotePage;