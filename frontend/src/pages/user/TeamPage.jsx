import React, { useEffect, useState } from 'react';
import axios from '../../axios';

function LandingPage() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get('/user/teams').then(res => setTeams(res.data));
    }, []);

    return (
        <div>
            {/* section lain */}
            <section id="team" className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Tim Kami</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {teams.map(team => (
                        <div key={team.id} className="p-4 border rounded shadow text-center">
                            {team.photo && (
                                <img src={`${process.env.REACT_APP_API_URL}/storage/${team.photo}`} alt={team.name} className="w-20 h-20 mx-auto mb-2 rounded-full object-cover" />
                            )}
                            <h3 className="text-xl font-semibold">{team.name}</h3>
                            <p className="text-gray-600">{team.position}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
