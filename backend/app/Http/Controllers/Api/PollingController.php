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
            'nominal' => 'required|integer|min:1000',
        ]);

        if ($polling->id_payment) {
            return response()->json($polling);
        }

        $payment = $this->midtrans($id, $request->nominal);

        // Simulasi request ke payment gateway (dummy)
        // $id_payment = 'PAY-' . strtoupper(Str::random(8));
        // $qris_url = 'https://dummy-qris.img/' . $id_payment . '.png';

        // $polling->update([
        //     'nominal' => $request->nominal,
        //     'id_payment' => $payment->transaction_id, // Asumsi response dari Midtrans
        //     'qris_url' => $payment->actions[0]->url, // Asumsi response dari Midtrans
        // ]);

        return response()->json($payment);
    }

    public function doku($id, $nominal){

        $method = 'POST';
        $endpointUrl = '/snap-adapter/b2b/v1.0/qr/qr-mpm-generate';
        $accessToken = 'your-access-token';
        $timestamp = date('c'); // ISO8601 format (e.g. 2025-07-03T17:00:00+07:00)
        $clientSecret = 'your-client-secret';

        // Isi sesuai payload request
        $requestBody = [
            "partnerReferenceNo" => "a98757c8dbc6434ab5dd4c55d9092d9a",
            "amount" => ["value" => "1000.00", "currency" => "IDR"],
            "feeAmount" => ["value" => "500.00", "currency" => "IDR"],
            "merchantId" => 2115,
            "terminalId" => "k45",
            "validityPeriod" => "2023-11-08T17:38:42+07:00",
            "additionalInfo" => ["postalCode" => 13120, "feeType" => 2]
        ];

        $signature = generateDokuSignature($method, $endpointUrl, $accessToken, $requestBody, $timestamp, $clientSecret);

        
        $url = 'https://api-sandbox.doku.com/snap-adapter/b2b/v1.0/qr/qr-mpm-generate';

        $headers = [
            'Host: api-sandbox.doku.com',
            'X-PARTNER-ID: MCH-0116-7101138079096',        // ← Ganti dengan Partner ID asli
            'X-EXTERNAL-ID: '.$id,       // ← Ganti dengan External ID unik
            'X-SIGNATURE: text',         // ← Ganti dengan Signature yang sesuai
            'Authorization: text',       // ← Ganti dengan token Authorization
            'Content-Type: application/json',
            'Accept: */*'
        ];

        $body = [
            "partnerReferenceNo" => "a98757c8dbc6434ab5dd4c55d9092d9a",
            "amount" => [
                "value" => "1000.00",
                "currency" => "IDR"
            ],
            "feeAmount" => [
                "value" => "500.00",
                "currency" => "IDR"
            ],
            "merchantId" => 2115,
            "terminalId" => "k45",
            "validityPeriod" => "2023-11-08T17:38:42+07:00",
            "additionalInfo" => [
                "postalCode" => 13120,
                "feeType" => 2
            ]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));

        // Eksekusi request
        $response = curl_exec($ch);

        // Cek error
        if (curl_errno($ch)) {
            echo 'Error: ' . curl_error($ch);
        } else {
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            echo "HTTP Code: $httpcode\n";
            echo "Response:\n$response";
        }

        curl_close($ch);

    }

    public function midtrans($id_transaction, $nominal)
    {
        $auth = base64_encode('SB-Mid-server-lAJbqhYva5K5H4zhaEKg-Odj:');
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.sandbox.midtrans.com/v2/charge',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
            "payment_type": "gopay",
            "transaction_details": {
                "gross_amount": ' . $nominal . ',
                "order_id": "' . $id_transaction . '"
            },
            "gopay": {
                "enable_callback": true,
                "callback_url": "someapps://callback"
            },
        ]
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
            'payment_response' => $response, // Simpan response lengkap
        ]);
        return $response;

    }
}
