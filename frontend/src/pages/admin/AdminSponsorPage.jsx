import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

const AdminSponsorPage = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/sponsors');
            setSponsors(response.data);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitData = new FormData();
        submitData.append('title', formData.title);
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            if (editingSponsor) {
                // Add _method for PUT request in shared hosting
                submitData.append('_method', 'PUT');
                await axios.post(`/admin/sponsors/${editingSponsor.id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Sponsor updated successfully!');
            } else {
                await axios.post('/admin/sponsors', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Sponsor created successfully!');
            }
            
            resetForm();
            fetchSponsors();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving sponsor:', error);
            alert('Error saving sponsor: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            title: sponsor.title,
            image: null
        });
        // Use the correct URL structure for shared hosting
        setPreviewImage(sponsor.image_url || `${API_BASE_URL}uploads/sponsors/${sponsor.image}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sponsor?')) {
            try {
                await axios.delete(`/admin/sponsors/${id}`);
                fetchSponsors();
                alert('Sponsor deleted successfully!');
            } catch (error) {
                console.error('Error deleting sponsor:', error);
                alert('Error deleting sponsor: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', image: null });
        setPreviewImage('');
        setEditingSponsor(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Sponsor Management</h4>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add Sponsor
                            </button>
                        </div>
                        <div className="card-body">
                            {sponsors.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted">No sponsors found</h5>
                                    <p className="text-muted">Click "Add Sponsor" to create your first sponsor.</p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {sponsors.map((sponsor) => (
                                        <div key={sponsor.id} className="col-md-6 col-lg-4">
                                            <div className="card h-100 shadow-sm">
                                                <div className="position-relative">
                                                    <img
                                                        src={sponsor.image_url || `${API_BASE_URL}uploads/sponsors/${sponsor.image}`}
                                                        className="card-img-top"
                                                        alt={sponsor.title}
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = '/api/placeholder/300x200?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="position-absolute top-0 end-0 m-2">
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-sm btn-outline-light"
                                                                onClick={() => handleEdit(sponsor)}
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-light text-danger"
                                                                onClick={() => handleDelete(sponsor.id)}
                                                                title="Delete"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <h6 className="card-title">{sponsor.title}</h6>
                                                    <small className="text-muted">
                                                        Created: {new Date(sponsor.created_at).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            Title <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">
                                            Image {!editingSponsor && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required={!editingSponsor}
                                        />
                                        <div className="form-text">
                                            Supported formats: JPG, PNG, GIF. Max size: 2MB
                                        </div>
                                    </div>

                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="mb-3">
                                            <label className="form-label">Preview:</label>
                                            <div className="border rounded p-2">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="img-fluid"
                                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingSponsor ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default AdminSponsorPage;
