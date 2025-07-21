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
    public function index(): JsonResponse
    {
        $transaksi = Transaksi::with('produk')
            ->where('id_pengguna', auth()->id())
            ->latest()
            ->paginate();

        return response()->json([
            'success' => true,
            'message' => 'Mengambil semua transaksi.',
            'data' => $transaksi
        ]);
    }

    private function _fullyBookedChecker(Store $request)
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

        $jumlahHari = Carbon::parse($request->tanggal_mulai)
            ->diffInDays(Carbon::parse($request->tanggal_selesai)) + 1;

        $produk = Produk::findOrFail($request->id_produk);
        $totalHarga = $produk->harga_produk * $jumlahHari;

        // Penentuan kode_transaksi: TRX + tanggal + nomor urut hari itu
        $tanggalSekarang = now()->format('Ymd');
        $jumlahHariIni = Transaksi::whereDate('created_at', now())->count() + 1;
        $kodeTransaksi = 'TRX' . $tanggalSekarang . str_pad($jumlahHariIni, 3, '0', STR_PAD_LEFT);

        $transaksi = Transaksi::create([
            'kode_transaksi' => $kodeTransaksi,
            'id_pengguna' => auth()->id(),
            'id_produk' => $produk->id_produk,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'jumlah_hari' => $jumlahHari,
            'jumlah_bayar' => $totalHarga,
            'status_transaksi' => 'waiting',
        ]);

        // Generate QR Code
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
            'data' => $transaksi
        ]);
    }

    public function show(Transaksi $transaksi): JsonResponse
    {
        if ($transaksi->id_pengguna !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak diizinkan.',
            ], 403);
        }

        $transaksi->loadMissing('produk');

        $data = $transaksi->toArray();
        $data['qr_code_url'] = $transaksi->kode_qr
            ? asset('storage/' . $transaksi->kode_qr)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil.',
            'data' => $data
        ]);
    }

    public function scan(Transaksi $transaksi): JsonResponse
    {
        $now = Carbon::now();
        $start = Carbon::parse($transaksi->tanggal_mulai);
        $end = Carbon::parse($transaksi->tanggal_selesai);

        if ($now->lt($start)) {
            return response()->json([
                'success' => false,
                'message' => 'QR belum aktif. Berlaku mulai ' . $start->format('d M Y'),
            ], 403);
        }

        if ($now->gt($end)) {
            return response()->json([
                'success' => false,
                'message' => 'QR sudah kedaluwarsa.',
            ], 403);
        }

        Absensi::create([
            'kode_absensi' => 'ABS' . now()->format('YmdHis'),
            'id_transaksi' => $transaksi->id_transaksi,
            'id_pengguna' => auth()->id(),
            'waktu_scan' => $now,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'QR valid.',
            'data' => [
                'transaksi_id' => $transaksi->id_transaksi,
                'produk' => $transaksi->produk->only(['id_produk', 'nama_produk']),
                'tanggal_mulai' => $transaksi->tanggal_mulai,
                'tanggal_selesai' => $transaksi->tanggal_selesai,
            ]
        ]);
    }

    public function uploadBukti(Request $request, $id): JsonResponse
    {
        $transaksi = Transaksi::findOrFail($id);

        // if ($transaksi->id_pengguna !== auth()->id()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Tidak diizinkan.',
        //     ], 403);
        // }

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
                'bukti_bayar_url' => asset('storage/' . $path),
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

        // if ($transaksi->id_pengguna !== auth()->id()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Tidak diizinkan.',
        //     ], 403);
        // }

        $transaksi->loadMissing('produk');

        $data = $transaksi->toArray();
        $data['qr_code_url'] = $transaksi->kode_qr
            ? asset('storage/' . $transaksi->kode_qr)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil diambil.',
            'data' => $data
        ]);
    }
}