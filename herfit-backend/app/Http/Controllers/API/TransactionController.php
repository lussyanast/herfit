<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Transaction\Store;
use App\Models\Listing;
use App\Models\Transaction;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('listing')->whereUserId(auth()->id())->paginate();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil semua transaksi.',
            'data' => $transactions
        ]);
    }
    private function _fullyBookedChecker(Store $request)
    {
        $listing = Listing::find($request->listing_id);
        $runningTransactionCount = Transaction::whereListingId($listing->id)
            ->whereNot('status', 'rejected')
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_date', [
                    $request->start_date,
                    $request->end_date,
                ])->orWhereBetween('end_date', [
                            $request->start_date,
                            $request->end_date,
                        ])->orWhere(function ($subquery) use ($request) {
                            $subquery->where('start_date', '<', $request->start_date)
                                ->where('end_date', '>', $request->end_date);
                        });
            })->count();

        if ($runningTransactionCount >= $listing->max_person) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Listing sudah penuh.',
                ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
            );
        }

        return true;
    }

    public function isAvailable(Store $request)
    {
        $this->_fullyBookedChecker($request);

        return response()->json([
            'success' => true,
            'message' => 'Listing sudah dapat dipesan.'
        ]);
    }

    public function store(Store $request)
    {
        $this->_fullyBookedChecker($request);

        $transaction = Transaction::create([
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'listing_id' => $request->listing_id,
            'user_id' => auth()->id()
        ]);

        // Buat QR Code (isi bebas, bisa ID transaksi atau info lengkap)
        $qrData = route('transaction.show', $transaction->id);
        $qrCode = new QrCode($qrData);
        $writer = new PngWriter();
        $qrImage = $writer->write($qrCode);

        $fileName = 'qr_codes/transaction_' . $transaction->id . '_' . Str::random(6) . '.png';
        Storage::disk('public')->put($fileName, $qrImage->getString());

        // Simpan path ke database
        $transaction->update(['qr_code_path' => $fileName]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi baru telah dibuat.',
            'data' => $transaction
        ]);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Pastikan relasi listing tersedia
        $transaction->loadMissing('listing');

        $data = $transaction->toArray();
        $data['qr_code_url'] = $transaction->qr_code_path
            ? asset('storage/' . $transaction->qr_code_path)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Mengambil detail transaksi.',
            'data' => $data
        ]);
    }

    public function scan(Transaction $transaction)
    {
        // Validasi tanggal
        if (Carbon::now()->gt(Carbon::parse($transaction->end_date))) {
            return response()->json([
                'success' => false,
                'message' => 'QR code sudah kadaluarsa.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'QR code masih berlaku.',
            'data' => [
                'transaction_id' => $transaction->id,
                'user' => $transaction->user->only(['id', 'name']),
                'listing' => $transaction->listing->only(['id', 'listing_name']),
                'end_date' => $transaction->end_date,
            ]
        ]);
    }
}
