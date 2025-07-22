import { useEffect, useState } from "react";
import axios from "../../axios";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import { API_BASE_URL } from "../../constants";

const GalleryAdminPage = () => {
    const [galleries, setGalleries] = useState([]);
    const [form, setForm] = useState({ title: "", image: null, id: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        try {
            const res = await axios.get("/admin/galleries");
            setGalleries(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data");
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const formData = new FormData();
        formData.append("title", form.title);
        if (form.image) formData.append("image", form.image);

        try {
            if (form.id) {
                await axios.post(`/admin/galleries/${form.id}?_method=PUT`, formData);
                setSuccess("Gallery berhasil diupdate!");
            } else {
                await axios.post("/admin/galleries", formData);
                setSuccess("Gallery berhasil ditambahkan!");
            }
            setForm({ title: "", image: null, id: null });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data");
        }
    };

    const handleEdit = g => setForm({ ...g, image: null, id: g.id });

    const handleDelete = async id => {
        if (window.confirm("Hapus gambar ini?")) {
            setError('');
            setSuccess('');
            try {
                await axios.delete(`/admin/galleries/${id}`);
                setSuccess("Gallery berhasil dihapus!");
                fetchData();
            } catch (err) {
                setError(err.response?.data?.message || "Gagal menghapus data");
            }
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="card p-4">
            <div className="card-header">
                <h2 className="text-2xl font-bold mb-4">Gallery Admin</h2>
            </div>
            <div className="card-body">
                {error && <ErrorModal message={error} onClose={() => setError('')} />}
                {success && <SuccessModal message={success} onClose={() => setSuccess('')} />}
                <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Judul" className="border p-2 w-full" />
                    <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                    <button className="btn btn-primary text-white rounded" type="submit">
                        {form.id ? "Update" : "Tambah"}
                    </button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleries.map(g => (
                        <div key={g.id} className="border p-2 relative">
                            {g.image && (
                                <img src={`${API_BASE_URL}uploads/${g.image}`} alt={g.title} className="w-full h-32 object-cover rounded" />
                            )}
                            <p className="text-center mt-1">{g.title}</p>
                            <div className="flex justify-between mt-2 text-sm">
                                <button onClick={() => handleEdit(g)} className="text-blue-500 btn btn-warning">Edit</button>
                                <button onClick={() => handleDelete(g.id)} className="text-red-500 btn btn-danger">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryAdminPage;
