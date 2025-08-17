import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../axios';
import { WEB_NAME } from '../../constants';
import LoginForm from '../../pages/user/LoginForm';
import ErrorModal from '../../components/ErrorModal';
import SuccessModal from '../../components/SuccessModal';
import formatCurrencyPrefix from '../../utils/formatCurrency';
import { useLocation, useNavigate } from 'react-router-dom'; // Add this import
import Sponsor from '../../components/Sponsor';

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

    const handleLogin = async (userData) => {
        setError('');
        try {
            const token = userData.token;
            localStorage.setItem('token', token);
            handleGetPolling();
            setShowLoginForm(false);
        } catch (err) {
            console.log('Login error:', err);
            setError('Gagal memproses login');
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
        <>
            <div className="content" style={{
                display: 'flex',
                flexWrap: 'wrap',
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <Sponsor />

                {error && (
                    <ErrorModal error={error} onClose={() => setError('')} />
                )}
                {success && (
                    <SuccessModal message={success} onClose={() => setSuccess('')} />
                )}

                {/* Right Column - About Content */}
                <div className="right-column" style={{
                    flex: 1,
                    minWidth: '300px',
                    padding: '20px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    {showLoginForm ? (
                                <div className="modal-login p-3">
                                    <h5 className="mb-3">Silakan Login untuk Melanjutkan</h5>
                                    <LoginForm onLogin={handleLogin} />
                                </div>
                            ) : (
                                <>
                    <h3 style={{
                        color: '#0066cc',
                        marginTop: 0,
                        borderBottom: '2px solid #0066cc',
                        paddingBottom: '10px'
                    }}>
                        Pilihan Kata-kata Hari ini
                    </h3>

                    <div className="filter-section" >
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                        }}>
                            <div className="category-filter" style={{
                                flex: '2',
                                minWidth: '300px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '15px',
                                    alignItems: 'center'
                                }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value=""
                                            checked={selectedKategori === ''}
                                            onChange={(e) => setSelectedKategori('')}
                                        />
                                        Semua
                                    </label>
                                    {kategoris.map((kategori) => (
                                        <label key={kategori.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={kategori.id}
                                                checked={selectedKategori === kategori.id}
                                                onChange={() => setSelectedKategori(kategori.id)}
                                            />
                                            {kategori.nama}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="search-box" style={{
                                flex: '1',
                                minWidth: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'stretch'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Cari kata-kata..."
                                        value={searchCreator}
                                        onChange={(e) => setSearchCreator(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px 0 0 4px',
                                            fontSize: '14px',
                                            borderRight: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            // Trigger search - in this case search is automatic via onChange
                                            console.log('Search triggered for:', searchCreator);
                                        }}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#0066cc',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0 4px 4px 0',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Cari
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <table class="polling-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Pilih</th>
                                <th>Kata-kata/Quote</th>
                                <th>Pembuat</th>
                                <th>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedPolling.map((polling, index) => (
                                <tr key={polling.id} onClick={() => handleSelect(polling.id)} >
                                    <td>{index + 1}</td>
                                    <td><div className={`flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center border ${selectedPollingIds.includes(polling.id) ? 'border-primary' : 'border-light'}`}
                                        style={{ width: '20px', height: '20px' }}>
                                            <i className={`ph ph-circle rounded-circle ${selectedPollingIds.includes(polling.id) ? 'bg-primary' : 'bg-light'}`}></i>
                                        </div>
                                    </td>
                                    <td>{polling?.kalimat}</td>
                                    <td>{getCreatorName(polling)}</td>
                                    <td>
                                        <div className="share-buttons">
                                            <button 
                                                className="share-button whatsapp" 
                                                onClick={(e) => handleShare(polling, e)} 
                                                title="Share ke WhatsApp"
                                            >
                                                <i className="fab fa-whatsapp"></i>
                                            </button>
                                            <button 
                                                className="share-button facebook" 
                                                onClick={(e) => handleShare(polling, e)} 
                                                title="Share ke Facebook"
                                            >
                                                <i className="fab fa-facebook-f"></i>
                                            </button>
                                            <button 
                                                className="share-button copy-link" 
                                                onClick={(e) => handleShare(polling, e)} 
                                                title="Copy Link"
                                            >
                                                <i className="fas fa-link"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
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

                        </>
                            )}

                    {/* Custom CSS for radio buttons and polling table */}
                    <style jsx>{`
                        input[type="radio"] {
                            width: 16px;
                            height: 16px;
                            accent-color: #0066cc;
                            cursor: pointer;
                        }
                        
                        input[type="radio"]:checked {
                            background-color: #0066cc;
                        }
                        
                        .category-filter label:hover {
                            background-color: rgba(0, 102, 204, 0.1);
                            padding: 4px 8px;
                            border-radius: 4px;
                        }
                        
                        .category-filter label {
                            transition: background-color 0.2s ease;
                            padding: 4px 8px;
                            border-radius: 4px;
                        }

                        /* Polling Table Styles */
                        .polling-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        
                        .polling-table th {
                            background-color: #0066cc;
                            color: white;
                            padding: 10px;
                            text-align: left;
                        }
                        
                        .polling-table td {
                            padding: 10px;
                            border-bottom: 1px solid #ddd;
                            vertical-align: middle;
                        }
                        
                        .polling-table tr:hover {
                            background-color: #f5f9ff;
                        }
                        
                        /* Column widths */
                        .polling-table th:nth-child(1),
                        .polling-table td:nth-child(1) {
                            width: 5%;
                        }
                        
                        .polling-table th:nth-child(2),
                        .polling-table td:nth-child(2) {
                            width: 10%;
                        }
                        
                        .polling-table th:nth-child(3),
                        .polling-table td:nth-child(3) {
                            width: 55%;
                        }
                        
                        .polling-table th:nth-child(4),
                        .polling-table td:nth-child(4) {
                            width: 15%;
                        }
                        
                        .polling-table th:nth-child(5),
                        .polling-table td:nth-child(5) {
                            width: 15%;
                        }
                        
                        /* Share buttons */
                        .share-buttons {
                            display: flex;
                            gap: 8px;
                        }
                        
                        .share-button {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            color: white;
                            font-size: 14px;
                            transition: all 0.3s;
                            border: none;
                        }
                        
                        .share-button:hover {
                            transform: scale(1.1);
                        }
                        
                        .whatsapp {
                            background-color: #25D366;
                        }
                        
                        .facebook {
                            background-color: #3b5998;
                        }
                        
                        .copy-link {
                            background-color: #0066cc;
                        }

                        /* Responsive behavior for filter section */
                        @media (max-width: 768px) {
                            .filter-section > div {
                                flex-direction: column !important;
                                align-items: stretch !important;
                            }
                            
                            .category-filter {
                                min-width: 100% !important;
                                margin-bottom: 15px;
                            }
                            
                            .search-box {
                                min-width: 100% !important;
                            }
                        }

                        @media (max-width: 650px) {
                            .category-filter > div {
                                flex-direction: column !important;
                                align-items: flex-start !important;
                                gap: 10px !important;
                            }
                        }

                        /* Search box button hover effect */
                        .search-box button:hover {
                            background-color: #0055aa !important;
                            transform: none;
                        }

                        /* Search input focus effect */
                        .search-box input:focus {
                            outline: none;
                            border-color: #0066cc;
                            box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
                        }
                    `}</style>



                    {/* Display dynamic content if available */}

                </div>
            </div>


            
        </>
    );
};

export default PollingPage;