<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Transaction\Store;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\Absensi;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransaksiController extends Controller
{
    /**
     * Helper: selalu ambil ID dari guard Sanctum (bukan sesi web)
     */
    private function authUserId(Request $request): int
    {
        // $request->user() sudah di-resolve oleh middleware auth:sanctum
        return (int) $request->user()->getAuthIdentifier();
    }

    public function index(Request $request): JsonResponse
    {
        $transaksi = Transaksi::with('produk')
            ->where('id_pengguna', $this->authUserId($request))
            ->latest()
            ->paginate();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil semua transaksi.',
            'data' => $transaksi
        ]);
    }

    private function _fullyBookedChecker(Store $request): void
    {
        $produk = Produk::findOrFail($request->id_produk);

        $count = Transaksi::where('id_produk', $produk->id_produk)
            ->where('status_transaksi', '!=', 'rejected')
            ->where(function ($query) use ($request) {
                $query->whereBetween('tanggal_mulai', [$request->tanggal_mulai, $request->tanggal_selesai])
                    ->orWhereBetween('tanggal_selesai', [$request->tanggal_mulai, $request->tanggal_selesai])
                    ->orWhere(function ($sub) use ($request) {
                        $sub->where('tanggal_mulai', '<', $request->tanggal_mulai)
                            ->where('tanggal_selesai', '>', $request->tanggal_selesai);
                    });
            })->count();

        if ($count >= $produk->maksimum_peserta) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Produk sudah penuh pada tanggal tersebut.',
                ], 422)
            );
        }
    }

    public function isAvailable(Store $request): JsonResponse
    {
        $this->_fullyBookedChecker($request);

        return response()->json([
            'success' => true,
            'message' => 'Produk tersedia untuk dipesan.'
        ]);
    }

    public function store(Store $request): JsonResponse
    {
        $this->_fullyBookedChecker($request);

        $startDate  = Carbon::parse($request->tanggal_mulai)->startOfDay();
        $endDate    = Carbon::parse($request->tanggal_selesai)->endOfDay();
        $jumlahHari = $startDate->diffInDays($endDate) + 1;

        $produk     = Produk::findOrFail($request->id_produk);
        $totalHarga = $produk->harga_produk; // sesuaikan jika perlu dikali jumlah hari

        // Kode transaksi harian incremental
        $tanggalSekarang = now()->format('Ymd');
        $jumlahHariIni   = Transaksi::whereDate('created_at', now())->count() + 1;
        $kodeTransaksi   = 'TRX' . $tanggalSekarang . str_pad($jumlahHariIni, 3, '0', STR_PAD_LEFT);

        $transaksi = Transaksi::create([
            'kode_transaksi'    => $kodeTransaksi,
            'id_pengguna'       => $this->authUserId($request), // << fix utama: pakai sanctum user
            'id_produk'         => $produk->id_produk,
            'tanggal_mulai'     => $startDate,
            'tanggal_selesai'   => $endDate,
            'jumlah_hari'       => $jumlahHari,
            'jumlah_bayar'      => $totalHarga,
            'status_transaksi'  => 'waiting',
        ]);

        // Generate QR yang menunjuk ke route show transaksi
        $qrData = route('transaction.show', $transaksi->id_transaksi);
        $qrCode = new QrCode($qrData);
        $writer = new PngWriter();
        $qrImage = $writer->write($qrCode);

        $fileName = 'qr_codes/transaksi_' . $transaksi->id_transaksi . '_' . Str::random(6) . '.png';
        Storage::disk('public')->put($fileName, $qrImage->getString());

        $transaksi->update(['kode_qr' => $fileName]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat.',
            'data'    => $transaksi
        ]);
    }

    public function show(Request $request, Transaksi $transaksi): JsonResponse
    {
        if ((int)$transaksi->id_pengguna !== $this->authUserId($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak diizinkan.',
            ], 403);
        }

        $transaksi->loadMissing('produk');

        $data = $transaksi->toArray();
        $data['qr_code_url'] = $transaksi->kode_qr
            ? Storage::url($transaksi->kode_qr)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil.',
            'data'    => $data
        ]);
    }

    public function scan(Transaksi $transaksi): JsonResponse
    {
        // Batasi hanya owner jika diperlukan:
        // if ($transaksi->id_pengguna !== auth('sanctum')->id()) { ... }

        if ($transaksi->status_transaksi !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'QR tidak valid atau transaksi belum disetujui.',
            ], 403);
        }

        $result = app(\App\Services\TransaksiFsm::class)->handle($transaksi, 'scan');

        if ($result === 'not_active') {
            return response()->json([
                'success' => false,
                'message' => 'QR belum aktif. Berlaku mulai ' . \Carbon\Carbon::parse($transaksi->tanggal_mulai)->format('d M Y H:i'),
            ], 403);
        }

        if ($result === 'expired') {
            return response()->json([
                'success' => false,
                'message' => 'QR sudah kedaluwarsa.',
            ], 403);
        }

        if ($result === 'active') {
            $transaksi->loadMissing('produk');

            return response()->json([
                'success' => true,
                'message' => 'QR valid.',
                'data' => [
                    'transaksi_id'   => $transaksi->id_transaksi,
                    'produk'         => $transaksi->produk->only(['id_produk', 'nama_produk']),
                    'tanggal_mulai'  => $transaksi->tanggal_mulai,
                    'tanggal_selesai'=> $transaksi->tanggal_selesai,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Transisi tidak valid.',
        ], 422);
    }

    public function uploadBukti(Request $request, $id): JsonResponse
    {
        $transaksi = Transaksi::findOrFail($id);

        // Pastikan hanya pemilik yang boleh upload bukti
        if ((int)$transaksi->id_pengguna !== (int)$this->authUserId($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak diizinkan.',
            ], 403);
        }

        if ($transaksi->status_transaksi !== 'waiting') {
            return response()->json([
                'success' => false,
                'message' => 'Status transaksi harus waiting.',
            ], 422);
        }

        $request->validate([
            'bukti_bayar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $path = $request->file('bukti_bayar')->store('bukti-bayar', 'public');

        $transaksi->update(['bukti_pembayaran' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil diunggah.',
            'data' => [
                'bukti_bayar_url' => Storage::url($path),
            ],
        ]);
    }

    public function showByKode($kode): JsonResponse
    {
        $transaksi = Transaksi::where('kode_transaksi', $kode)->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        $transaksi->loadMissing('produk');

        $data = $transaksi->toArray();
        $data['qr_code_url'] = $transaksi->kode_qr
            ? Storage::url($transaksi->kode_qr)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil.',
            'data'    => $data
        ]);
    }

    /**
     * Tambahan untuk route GET /transaksi/scan/{kode}
     */
    public function scanByKode($kode): JsonResponse
    {
        $transaksi = Transaksi::where('kode_transaksi', $kode)->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        return $this->scan($transaksi);
    }
}