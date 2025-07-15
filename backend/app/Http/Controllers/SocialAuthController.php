<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SocialAuthController extends Controller
{
    public function googleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();
        $user = User::firstOrCreate(
            ['email'=>$googleUser->getEmail()],
            ['name'=>$googleUser->getName(), 'password'=>bcrypt(Str::random(16))]
        );

        $token = $user->createToken('web')->plainTextToken;

        // kirim ke window opener (popup) lalu tutup
        return view('social-close', ['token'=>$token]);
    }
}
