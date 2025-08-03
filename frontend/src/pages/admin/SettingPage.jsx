import { useEffect, useState } from "react";
import axios from "../../axios"; // Adjust the import path as necessary
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import { API_BASE_URL } from "../../constants";

export default function SettingPage() {
    const [settings, setSettings] = useState({
        site_title: "",
        phone: "",
    });
    const [files, setFiles] = useState({});

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        axios.get("/user/settings").then(res => {
            setSettings(prev => ({ ...prev, ...res.data }));
        });
    }, []);

    const handleChange = e => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in settings) formData.append(key, settings[key]);
        for (const key in files) formData.append(key, files[key]);

        try {
            await axios.post("/admin/settings", formData);
            setSuccess("Settings updated");
        } catch (err) {
            setError("Update failed");
        }
    };

    return (
        <div className="card p-20">
            <div className="card-header">
                <h2 className="text-xl font-bold mb-4">Website Settings</h2>
            </div>
            <div className="card-body">
                {error && <ErrorModal error={error} onClose={() => setError(null)} />}
                {success && <SuccessModal message={success} onClose={() => setSuccess(null)} />}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Site Title</label>
                        <input name="site_title" value={settings.site_title || ""} onChange={handleChange} className="input form-control" placeholder="Site Title" />
                    </div>

                    <div>
                        <label>No. Telp</label>
                        <input name="phone" value={settings.phone || ""} onChange={handleChange} className="input form-control" placeholder="NO Telp" />
                    </div>

                    <div>
                        <label>Alamat</label>
                        <textarea name="address" id="" value={settings.address || ""} onChange={handleChange} className="input form-control" placeholder="Alamat"></textarea>
                    </div>

                    <div>
                        <label>Logo</label>
                        {
                            settings.site_logo && (
                                <img src={`${API_BASE_URL}uploads/${settings.site_logo}`} alt="Logo" className="h-50 mb-2" />
                            )
                        }
                        <input name="site_logo" type="file" onChange={handleFileChange} className="input form-control" />
                    </div>

                    <div>
                        <label>Favicon</label>
                        {
                            settings.site_favicon && (
                                <img src={`${API_BASE_URL}uploads/${settings.site_favicon}`} alt="Favicon" className="h-50 mb-2" />
                            )
                        }
                        <input name="site_favicon" type="file" onChange={handleFileChange} className="input form-control" />
                    </div>

                    <div>
                        <label>Thumbnail</label>
                        {
                            settings.site_thumbnail && (
                                <img src={`${API_BASE_URL}uploads/${settings.site_thumbnail}`} alt="Thumbnail" className="h-50 mb-2" />
                            )
                        }
                        <input name="site_thumbnail" type="file" onChange={handleFileChange} className="input form-control" />
                    </div>

                    <button className="btn btn-primary mt-4">Simpan</button>
                </form>
            </div>
        </div>
    );
}
