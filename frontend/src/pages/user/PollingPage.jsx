import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import LoginForm from '../../pages/user/LoginForm';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';
import { useLocation, useNavigate } from 'react-router-dom'; // Add this import

const PollingPage = () => {
    const [dataPolling, setDataPolling] = useState([]);
    const [filteredPolling, setFilteredPolling] = useState([]);
    const [displayedPolling, setDisplayedPolling] = useState([]);
    const [selectedPollingIds, setSelectedPollingIds] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const itemsPerPage = 10;
    
    // Filter states
    const [kategoris, setKategoris] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState('');
    const [searchCreator, setSearchCreator] = useState('');
    
    // Add these for URL handling
    const location = useLocation();
    const navigate = useNavigate();

    // Check for polling ID in URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const pollingId = urlParams.get('id');
        
        if (pollingId) {
            // Set search to polling ID to filter by specific polling
            setSearchCreator(pollingId);
            // Optionally show success message
            setSuccess(`Menampilkan polling dengan ID: ${pollingId}`);
        }
    }, [location.search]);

    // Fetch kategoris for filter
    useEffect(() => {
        axios.get('/user/kategori').then(res => {
            setKategoris(res.data);
        }).catch(err => {
            console.error('Error fetching categories:', err);
        });
    }, []);

    const handleGetPolling = useCallback(async () => {
        try {
            const res = await axios.get('/user/pollings', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Polling Data:', res.data);
            setDataPolling(res.data);
            setFilteredPolling(res.data);
            setCurrentPage(1);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil data polling');
        }
    }, []);

    useEffect(() => {
        handleGetPolling();
    }, [handleGetPolling]);

    // Enhanced filter effect to handle polling ID
    useEffect(() => {
        let filtered = [...dataPolling];

        // Filter by category
        if (selectedKategori) {
            filtered = filtered.filter(polling => {
                return polling.kategoris && polling.kategoris.some(kat => kat.id === selectedKategori);
            });
        }

        // Enhanced search to handle polling ID or creator name
        if (searchCreator.trim()) {
            filtered = filtered.filter(polling => {
                // Check if search term matches polling ID
                if (polling.id === searchCreator.trim()) {
                    return true;
                }
                
                // Check if search term matches creator name
                const creatorName = polling.is_anonymous ? 'anonim' : (polling.display_name || polling.user?.name || '');
                return creatorName.toLowerCase().includes(searchCreator.toLowerCase());
            });
        }

        setFilteredPolling(filtered);
        setCurrentPage(1);
    }, [dataPolling, selectedKategori, searchCreator]);

    // Update displayed polling when filteredPolling or currentPage changes
    useEffect(() => {
        const startIndex = 0;
        const endIndex = currentPage * itemsPerPage;
        setDisplayedPolling(filteredPolling.slice(startIndex, endIndex));
    }, [filteredPolling, currentPage]);

    // Load more handler
    const handleLoadMore = () => {
        setLoadingMore(true);
        
        setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setLoadingMore(false);
        }, 500);
    };

    // Check if there are more items to load
    const hasMoreItems = () => {
        return currentPage * itemsPerPage < filteredPolling.length;
    };

    // Get remaining items count
    const getRemainingCount = () => {
        return filteredPolling.length - (currentPage * itemsPerPage);
    };

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
            setShowLoginForm(true);
            return;
        }

        const user_id = null;

        const postData = displayedPolling.map(polling => ({
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
            handleGetPolling();
            setSelectedPollingIds([]);
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

    // Enhanced clear filters to also clear URL params
    const handleClearFilters = () => {
        setSelectedKategori('');
        setSearchCreator('');
        setSelectedPollingIds([]);
        
        // Clear URL parameters
        const urlParams = new URLSearchParams(location.search);
        if (urlParams.has('id')) {
            urlParams.delete('id');
            const newUrl = `${location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
            navigate(newUrl, { replace: true });
        }
    };

    // Get creator name with proper handling for anonymous
    const getCreatorName = (polling) => {
        if (polling.is_anonymous) {
            return 'Anonim';
        }
        return polling.display_name || polling.user?.name || 'Unknown';
    };

    // Render categories badges
    const renderKategoris = (kategoris) => {
        if (!kategoris || kategoris.length === 0) return null;
        
        return (
            <div className="mb-1">
                {kategoris.map((kategori, index) => (
                    <span key={kategori.id} className="badge bg-secondary me-1" style={{ fontSize: '0.7rem' }}>
                        {kategori.nama}
                    </span>
                ))}
            </div>
        );
    };

    // Enhanced share function with polling ID
    const handleShare = (polling, event) => {
        event.stopPropagation();
        
        // Create share URL with polling ID
        const shareUrl = `${window.location.origin}/pollings?id=${polling.id}`;
        
        const shareText = `Bantu polling kata-kata saya untuk diterbitkan oleh suaranetizen.co.id

"${polling.kalimat}"

Vote sekarang di: ${shareUrl}

ID Polling: ${polling.id}`;

        const shareData = {
            title: 'Suara Netizen - Vote Kata-kata',
            text: shareText,
            url: shareUrl
        };

        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData)
                .then(() => {
                    console.log('Successfully shared');
                    setSuccess('Polling berhasil dibagikan!');
                })
                .catch((error) => {
                    console.log('Error sharing:', error);
                    handleCopyToClipboard(shareText);
                });
        } else {
            // Fallback: Copy to clipboard
            handleCopyToClipboard(shareText);
        }
    };

    const handleCopyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setSuccess('Link berhasil disalin ke clipboard!');
                })
                .catch(() => {
                    fallbackCopyTextToClipboard(text);
                });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            setSuccess('Teks berhasil disalin ke clipboard!');
        } catch (err) {
            setError('Gagal menyalin teks');
        }
        
        document.body.removeChild(textArea);
    };

    // Check if currently filtering by polling ID
    const isFilteringByPollingId = () => {
        return searchCreator.trim() && dataPolling.some(polling => polling.id === searchCreator.trim());
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
                        ) : (
                            <>
                                <div className='headQuote p-3 border-bottom'>
                                    {dataPolling.length > 0 && (
                                        <>
                                            <h5 className='mb-3'>
                                                <i className="ph ph-list me-2"></i>
                                                Daftar Pesan / Quote yang Masuk
                                                {isFilteringByPollingId() && (
                                                    <span className="badge bg-warning text-dark ms-2">
                                                        <i className="ph ph-link me-1"></i>
                                                        Filter Khusus
                                                    </span>
                                                )}
                                            </h5>
                                            
                                            {/* Filter Section */}
                                            <div className="row g-3 mb-3">
                                                {/* Category Filter */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">
                                                        <i className="ph ph-funnel me-1"></i>
                                                        Filter Kategori:
                                                    </label>
                                                    <select 
                                                        className="form-select form-select-sm"
                                                        value={selectedKategori}
                                                        onChange={(e) => setSelectedKategori(e.target.value)}
                                                        disabled={isFilteringByPollingId()}
                                                    >
                                                        <option value="">Semua Kategori</option>
                                                        {kategoris.map(kategori => (
                                                            <option key={kategori.id} value={kategori.id}>
                                                                {kategori.nama}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Enhanced Creator Search */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">
                                                        <i className="ph ph-magnifying-glass me-1"></i>
                                                        Cari Pembuat Quote atau ID Polling:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${isFilteringByPollingId() ? 'border-warning' : ''}`}
                                                        placeholder="Masukkan nama pembuat atau ID polling..."
                                                        value={searchCreator}
                                                        onChange={(e) => setSearchCreator(e.target.value)}
                                                    />
                                                    {isFilteringByPollingId() && (
                                                        <small className="text-warning">
                                                            <i className="ph ph-info me-1"></i>
                                                            Menampilkan polling khusus berdasarkan ID
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Filter Actions & Counter */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex gap-2">
                                                    {(selectedKategori || searchCreator) && (
                                                        <button 
                                                            className="btn btn-secondary btn-sm py-1 px-2 text-nowrap"
                                                            onClick={handleClearFilters}
                                                        >
                                                            <i className="ph ph-x me-1"></i>
                                                            Hapus Filter
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <small className="text-muted">
                                                    <i className="ph ph-info me-1"></i>
                                                    Menampilkan {displayedPolling.length} dari {filteredPolling.length} quote
                                                    {filteredPolling.length !== dataPolling.length && ` (Total: ${dataPolling.length})`}
                                                </small>
                                            </div>

                                            {/* Active Filters Display */}
                                            {(selectedKategori || searchCreator) && (
                                                <div className="mt-2">
                                                    <small className="text-muted">Filter aktif:</small>
                                                    <div className="mt-1">
                                                        {selectedKategori && (
                                                            <span className="badge bg-primary me-1">
                                                                Kategori: {kategoris.find(k => k.id === selectedKategori)?.nama}
                                                                <button 
                                                                    className="btn-close btn-close-white ms-1"
                                                                    style={{ fontSize: '0.6em' }}
                                                                    onClick={() => setSelectedKategori('')}
                                                                ></button>
                                                            </span>
                                                        )}
                                                        {searchCreator && (
                                                            <span className={`badge me-1 ${isFilteringByPollingId() ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                                {isFilteringByPollingId() ? 'ID Polling:' : 'Pembuat:'} "{searchCreator}"
                                                                <button 
                                                                    className="btn-close ms-1"
                                                                    style={{ fontSize: '0.6em' }}
                                                                    onClick={() => setSearchCreator('')}
                                                                ></button>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className='dataQuote p-3'>
                                    {filteredPolling.length === 0 ? (
                                        <div className="text-center py-5">
                                            {dataPolling.length === 0 ? (
                                                <>
                                                    <i className="ph ph-chat-circle-slash text-muted" style={{ fontSize: '3rem' }}></i>
                                                    <h5 className="text-muted mt-2">Tidak ada polling yang tersedia</h5>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ph ph-funnel-x text-muted" style={{ fontSize: '3rem' }}></i>
                                                    <h5 className="text-muted mt-2">
                                                        {isFilteringByPollingId() ? 
                                                            `Polling dengan ID "${searchCreator}" tidak ditemukan` :
                                                            'Tidak ada quote yang sesuai dengan filter'
                                                        }
                                                    </h5>
                                                    <button 
                                                        className="btn btn-primary btn-sm mt-2"
                                                        onClick={handleClearFilters}
                                                    >
                                                        <i className="ph ph-arrow-clockwise me-1"></i>
                                                        Reset Filter
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {displayedPolling.map((polling, index) => (
                                                <div
                                                    key={polling.id}
                                                    className={`d-flex align-items-start gap-3 mb-4 pb-3 border-bottom position-relative ${selectedPollingIds.includes(polling.id) ? 'bg-light' : ''} ${isFilteringByPollingId() && polling.id === searchCreator ? 'border-warning bg-warning bg-opacity-10' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSelect(polling.id)}
                                                >
                                                    {/* Nomor Urut */}
                                                    <div className="flex-shrink-0">
                                                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                                             style={{ width: '30px', height: '30px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                            {index + 1}
                                                        </div>
                                                    </div>

                                                    {/* Checkbox */}
                                                    <div className={`flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center ${selectedPollingIds.includes(polling.id) ? 'bg-primary' : 'bg-light border'}`} 
                                                         style={{ width: '40px', height: '40px' }}>
                                                        {selectedPollingIds.includes(polling.id) ? (
                                                            <i className="ph ph-check text-white text-lg"></i>
                                                        ) : (
                                                            <i className="ph ph-circle text-muted"></i>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h6 className="mb-0 fw-bold">"{polling?.kalimat}"</h6>
                                                            {isFilteringByPollingId() && polling.id === searchCreator && (
                                                                <span className="badge bg-warning text-dark ms-2">
                                                                    <i className="ph ph-star me-1"></i>
                                                                    Target
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Categories */}
                                                        {renderKategoris(polling.kategoris)}
                                                        
                                                        <div className="d-flex flex-column flex-sm-row justify-content-between text-muted small">
                                                            <span className="mb-1 mb-sm-0">
                                                                Quote dari{' '}
                                                                <strong className={polling.is_anonymous ? 'text-muted' : 'text-primary'}>
                                                                    {polling.is_anonymous && <i className="ph ph-mask me-1"></i>}
                                                                    {getCreatorName(polling)}
                                                                </strong>
                                                            </span>
                                                            <div className="d-flex gap-2">
                                                                <span className="badge bg-light text-dark">
                                                                    <i className="ph ph-heart me-1"></i>
                                                                    {formatCurrencyPrefix(polling?.polling_votes_count)} Netizen
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Share Button */}
                                                    <div className="flex-shrink-0">
                                                        <button
                                                            className="btn btn-primary btn-sm px-2 py-1"
                                                            onClick={(e) => handleShare(polling, e)}
                                                            title="Bagikan quote ini dengan link khusus"
                                                            style={{ 
                                                                minWidth: '80px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            <i className="ph ph-share-network me-1"></i>
                                                            Share
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Load More Button */}
                                            {hasMoreItems() && (
                                                <div className="text-center mt-4">
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={handleLoadMore}
                                                        disabled={loadingMore}
                                                    >
                                                        {loadingMore ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Memuat...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="ph ph-plus me-2"></i>
                                                                Muat {Math.min(itemsPerPage, getRemainingCount())} Lagi
                                                                <span className="badge bg-secondary ms-2">
                                                                    {getRemainingCount()} tersisa
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            {/* End of List Message */}
                                            {!hasMoreItems() && displayedPolling.length > 0 && (
                                                <div className="text-center mt-4 py-3 border-top">
                                                    <small className="text-muted">
                                                        <i className="ph ph-check-circle me-1"></i>
                                                        Semua quote telah ditampilkan
                                                    </small>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {!showLoginForm && displayedPolling.length > 0 && (
                        <div className='m-5'>
                            <button 
                                className='btn btn-success w-100 fw-bold' 
                                onClick={handleSubmit}
                                disabled={selectedPollingIds.length === 0}
                            >
                                <i className="ph ph-paper-plane me-2"></i>
                                Submit Pilihan ({selectedPollingIds.length} dipilih)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollingPage;