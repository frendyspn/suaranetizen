import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { API_BASE_URL } from '../../constants';

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
                    <div class="row g-20">
                        {teams.map(team => (
                            <div class="col-xl-3 col-md-4 col-sm-6">
                                <div class="mentor-card rounded-8 overflow-hidden">
                                    <div class="mentor-card__content text-center">
                                        <div class="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                                            <div class="">
                                                <img src={`${API_BASE_URL}uploads/${team.photo}`} alt="" class="mentor-card__img cover-img" />
                                            </div>
                                        </div>
                                        <h5 class="mb-0">
                                            <a href="setting.html">{team.name}</a>
                                        </h5>
                                        <span class="text-13 text-gray-500">{team.position}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
