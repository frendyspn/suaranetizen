<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sponsor;

class SponsorSeeder extends Seeder
{
    public function run()
    {
        $sponsors = [
            [
                'title' => 'Sponsor 1',
                'image' => 'sponsor1.jpg',
            ],
            [
                'title' => 'Sponsor 2', 
                'image' => 'sponsor2.jpg',
            ],
            [
                'title' => 'Sponsor 3',
                'image' => 'sponsor3.jpg',
            ],
            [
                'title' => 'Partner Media',
                'image' => 'partner-media.jpg',
            ],
            [
                'title' => 'Corporate Sponsor',
                'image' => 'corporate-sponsor.jpg',
            ]
        ];

        foreach ($sponsors as $sponsor) {
            Sponsor::create($sponsor);
        }
    }
}
