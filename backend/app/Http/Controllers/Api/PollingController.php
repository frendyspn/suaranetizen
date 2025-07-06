<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Donasi;
use App\Models\Polling;

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
        return Polling::with('kategori')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kalimat' => 'required|string',
            'kategori_id' => 'required|exists:kategoris,id', // jika kamu punya kategori
        ]);

        $donasi = Donasi::where('is_active', true)->where('status', 'onprogress')->first();
        if (!$donasi) {
            return response()->json(['message' => 'Tidak ada donasi aktif'], 404);
        }

        $polling = Polling::create([
            'kalimat' => $request->kalimat,
            'kategori_id' => $request->kategori_id,
            'user_id' => $request->user()->id,
            'donasi_id' => $donasi->id,
        ]);

        return response()->json([
            'message' => 'Polling berhasil dikirim. Silakan lakukan donasi.',
            'polling' => $polling,
            'donasi' => $donasi
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
}
