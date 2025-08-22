<?php

namespace App\Http\Controllers\Api; // Pastikan namespace benar (bukan 'api')

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Donasi;
use App\Models\Polling;
use App\Models\PollingVote;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;

class PollingController extends Controller
{
    public function donasiAktif()
    {
        $donasi = Donasi::where('is_active', true)->where('status', 'onprogress')->first();
        if (!$donasi) {
            return response()->json(['message' => 'Tidak ada donasi aktif'], 404);
        }
        return response()->json($donasi);
    }

    public function show(string $id)
    {
        $polling = Polling::with(['user', 'kategoris'])
            ->findOrFail($id);

        // If anonymous, hide user details
        if ($polling->is_anonymous) {
            $polling->makeHidden(['user']);
            $polling->display_name = 'Anonim';
        } else {
            $polling->display_name = $polling->user->name;
        }

        return response()->json($polling);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kalimat' => 'required|string|max:210',
            'kategori_ids' => 'required|array|min:1',
            'kategori_ids.*' => 'exists:kategoris,id',
            'custom_name' => 'required|string|max:100'
        ], [
            'kalimat.required' => 'Kata-kata tidak boleh kosong',
            'kalimat.max' => 'Kata-kata maksimal 210 karakter',
            'kategori_ids.required' => 'Pilih minimal satu kategori',
            'kategori_ids.min' => 'Pilih minimal satu kategori',
            'kategori_ids.*.exists' => 'Kategori yang dipilih tidak valid',
            'custom_name.required' => 'Nama Anda Harus Diisi'
        ]);

        $donasi = Donasi::where('is_active', true)->where('status', 'onprogress')->first();
        if (!$donasi) {
            return response()->json(['message' => 'Tidak ada donasi aktif'], 404);
        }

        $polling = Polling::create([
            'kalimat' => $request->kalimat,
            'kategori_id' => $request->kategori_ids[0], // Keep first category for backward compatibility
            'kategori_ids' => $request->kategori_ids,
            'custom_name' => $request->custom_name,
            'user_id' => $request->user()->id,
            'donasi_id' => $donasi->id,
            'status' => 'pending',
        ]);

        $polling->kategoris()->sync($request->kategori_ids);

        return response()->json([
            'message' => 'Polling berhasil dikirim. Silakan lakukan donasi.',
            'polling' => $polling,
            'donasi' => $donasi
        ]);
    }

    public function storeFree(Request $request)
    {
        $request->validate([
            'kalimat' => 'required|string|max:210',
            'kategori_ids' => 'required|array|min:1',
            'kategori_ids.*' => 'exists:kategoris,id',
            'custom_name' => 'required|string|max:100'
        ], [
            'kalimat.required' => 'Kata-kata tidak boleh kosong',
            'kalimat.max' => 'Kata-kata maksimal 210 karakter',
            'kategori_ids.required' => 'Pilih minimal satu kategori',
            'kategori_ids.min' => 'Pilih minimal satu kategori',
            'kategori_ids.*.exists' => 'Kategori yang dipilih tidak valid',
            'custom_name.required' => 'Nama Anda Harus Diisi'
        ]);

        // Create polling
        $polling = Polling::create([
            'kalimat' => $request->kalimat,
            'kategori_id' => $request->kategori_ids[0],
            'kategori_ids' => $request->kategori_ids,
            'custom_name' => $request->custom_name,
            'user_id' => $request->user()->id,
            'donasi_id' => null,
            'status' => 'paid', // Status langsung paid
            'nominal' => 0
        ]);

        // Sync categories - INI YANG MENYEBABKAN ERROR jika method kategoris() tidak ada
        $polling->kategoris()->sync($request->kategori_ids);

        // Load relationships untuk response
        $polling->load(['user', 'kategoris']);

        return response()->json([
            'message' => 'Polling berhasil dikirim tanpa donasi.',
            'polling' => $polling,
            'donasi' => null
        ]);
    }

    public function generateQris(Request $request, $id)
    {
        $polling = Polling::findOrFail($id);

        if ($polling->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nominal' => 'required|integer|min:1',
        ]);

        if ($polling->id_payment) {
            return response()->json($polling);
        }

        $payment = json_decode($this->midtrans($id, $request->nominal), true);

        // Simulasi request ke payment gateway (dummy)
        // $id_payment = 'PAY-' . strtoupper(Str::random(8));
        // $qris_url = 'https://dummy-qris.img/' . $id_payment . '.png';

        Polling::where('id', $id)->update([
            'nominal' => (int)$request->nominal,
            'id_payment' => $payment['token'], // Asumsi response dari Midtrans
            'qris_url' => $payment['redirect_url'], // Asumsi response dari Midtrans
        ]);

        return response()->json($polling->refresh());
    }

    
    public function midtrans($id_transaction, $nominal)
    {
        $auth = base64_encode(env('MIDTRANS_KEY') . ':'); // Ganti dengan MIDTRANS_KEY yang sesuai
        
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://app.midtrans.com/snap/v1/transactions',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
        "transaction_details": {
            "order_id": "' . $id_transaction . '",
            "gross_amount": ' . $nominal . '
        }, 
        "credit_card": {
            "secure": false
        },
        "enabled_payments": ["gopay"],
        "callbacks": {
            "finish": "http://localhost:3000/polling/' . $id_transaction . '"
        }
        }',
        CURLOPT_HTTPHEADER => array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: Basic ' . $auth,
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        
        $polling = Polling::findOrFail($id_transaction);
        $polling->update([
            'payment_response' => json_encode($response), // Simpan response lengkap
        ]);
        return $response;

    }

    public function updateStatusPayment(Request $request, $id)
    {
        
        $polling = Polling::findOrFail($id);

        if ($polling->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($id !== $request->orderId) {
            return response()->json($polling->refresh());
        }

        $request->validate([
            'orderId' => 'required|string',
            'statusCode' => 'required|string',
            'transactionStatus' => 'required|string',
        ]);

        // Simulasi update status pembayaran
        // Di sini kamu bisa melakukan pengecekan status pembayaran dari Midtrans atau payment gateway lainnya

        if ($request->statusCode == '200') {
            if ($request->transactionStatus == 'settlement') {
                Polling::where('id', $id)->update([
                    'status' => 'paid',
                ]);
            }
        }

        return response()->json($polling->refresh());
    }

    public function showPollings(Request $request)
    {
        $authHeader = $request->header('Authorization');
        $user = null;

        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $accessToken = $matches[1];
            $token = PersonalAccessToken::findToken($accessToken);
            if ($token) {
                $user = $token->tokenable;
            }
        }
        
        // PERBAIKI: gunakan 'kategoris' bukan 'kategori'
        $dataPolling = Polling::with(['kategoris', 'user'])
            ->withCount('pollingVotes')
            ->where('status', 'paid');

        if ($user) {
            $votedIds = PollingVote::where('user_id', $user->id)->pluck('id_polling')->toArray();
            $pollings = $dataPolling->whereNotIn('id', $votedIds)->whereNot('user_id', $user->id)->get();
        } else {
            $pollings = $dataPolling->get();
        }

        // Transform untuk handle anonymous
        $pollings->transform(function ($polling) {
            // Handle anonymous
            if ($polling->is_anonymous) {
                $polling->makeHidden(['user']);
                $polling->display_name = 'Anonim';
            } else {
                if ($polling->user && $polling->user->name) {
                    $polling->user->name = $this->maskName($polling->user->name);
                }
                $polling->display_name = $polling->user ? $polling->user->name : 'Unknown';
            }
            
            $polling->polling_votes = 1;
            return $polling;
        });

        return response()->json($pollings);
    }


    public function resultPollings(Request $request)
    {
        // PERBAIKI: gunakan 'kategoris' bukan 'kategori'
        $pollings = Polling::with(['kategoris', 'user'])
            ->withCount('pollingVotes')
            ->where('status', 'paid')
            ->orderBy('polling_votes_count', 'desc')
            ->limit(3)
            ->get();
        
        // Transform untuk handle anonymous
        $pollings->transform(function ($polling) {
            if ($polling->is_anonymous) {
                $polling->makeHidden(['user']);
                $polling->display_name = 'Anonim';
            } else {
                if ($polling->user && $polling->user->name) {
                    $polling->user->name = $this->maskName($polling->user->name);
                }
                $polling->display_name = $polling->user ? $polling->user->name : 'Unknown';
            }
            
            $polling->polling_votes = 1;
            return $polling;
        });

        return response()->json($pollings);
    }

    private function maskName($name)
    {
        return $name;
        // Pisahkan nama berdasarkan spasi
        $parts = explode(' ', $name);
        $masked = array_map(function($part) {
            $len = mb_strlen($part);
            if ($len <= 2) return $part; // Tidak perlu masking
            return mb_substr($part, 0, 1)
                . str_repeat('*', $len - 2)
                . mb_substr($part, -1, 1);
        }, $parts);
        return implode(' ', $masked);
    }

    public function vote(Request $request)
    {
        $user = $request->user();

        $data = $request->all();

        // Validasi: pastikan data array dan setiap item punya id_polling & nilai
        $request->validate([
            '*.id_polling' => 'required|exists:pollings,id',
            '*.nilai'      => 'required|boolean',
        ]);

        foreach ($data as $item) {
            PollingVote::updateOrCreate(
                [
                    'id_polling' => $item['id_polling'],
                    'user_id'    => $user->id,
                ],
                [
                    'nilai'      => $item['nilai'],
                ]
            );
        }

        return response()->json(['message' => 'Vote berhasil disimpan']);
    }
}
