import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

export default function TeamListPage() {
    const [teams, setTeams] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [form, setForm] = useState({ name: '', position: '', id: null });

    const fetchTeams = async () => {
        const res = await axios.get('/admin/teams');
        setTeams(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('position', form.position);
        if (photo) formData.append('photo', photo);

        if (form.id) {
            await axios.post(`/admin/teams/${form.id}?_method=PUT`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            await axios.post('/admin/teams', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }

        setForm({ name: '', position: '', id: null });
        setPhoto(null);
        fetchTeams();
    };

    const handleEdit = (team) => {
        setForm(team);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete?')) {
            await axios.delete(`/admin/teams/${id}`);
            fetchTeams();
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className='card p-4'>
            <div className='card-header d-flex justify-content-between align-items-center'>
            <h2 className="text-xl font-bold mb-4">Team Management</h2>
            </div>
            <div className='card-body'>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    className="form-control"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="form-control"
                    placeholder="Position"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
                <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="form-control mb-2" />

                <button className="btn btn-primary" type="submit">
                    {form.id ? 'Update' : 'Add'}
                </button>
            </form>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Position</th>
                        <th className="border p-2">Photo</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((t) => (
                        <tr key={t.id}>
                            <td className="border p-2">{t.name}</td>
                            <td className="border p-2">{t.position}</td>
                            <td>
                                {t.photo && (
                                    <img src={`${API_BASE_URL}uploads/${t.photo}`} alt="" className="w-12 h-12 object-cover rounded-full" />
                                )}
                            </td>
                            <td className="border p-2">
                                <button onClick={() => handleEdit(t)} className="text-blue-500 mr-2">Edit</button>
                                <button onClick={() => handleDelete(t.id)} className="text-red-500">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}
