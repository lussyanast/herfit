<x-filament::page>
    <div class="flex flex-col items-center justify-center space-y-6">
        <h2 class="text-2xl font-semibold text-center">Scan QR Transaksi</h2>

        <div id="qr-reader" class="rounded-lg border border-gray-300 p-4 shadow-md w-full max-w-md"></div>

        @if ($transaksi)
            <x-filament::card class="w-full max-w-md mt-6">
                <x-slot name="header">
                    <h3 class="text-lg font-bold">Detail Transaksi</h3>
                </x-slot>

                <div class="space-y-1 text-sm">
                    <p><strong>Nama User:</strong> {{ $transaksi->pengguna->nama_lengkap ?? '-' }}</p>
                    <p><strong>Produk:</strong> {{ $transaksi->produk->nama_produk ?? '-' }}</p>
                    <p><strong>Tanggal Mulai:</strong> {{ $transaksi->tanggal_mulai }}</p>
                    <p><strong>Tanggal Selesai:</strong> {{ $transaksi->tanggal_selesai }}</p>
                    <p><strong>Status:</strong> {{ $transaksi->status_transaksi }}</p>
                </div>
            </x-filament::card>
        @endif
    </div>

    {{-- Script QR --}}
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const qrReader = new Html5Qrcode("qr-reader");

            let lastScannedCode = null;
            let lastScanTime = 0;

            async function onScanSuccess(decodedText) {
                const now = Date.now();

                // Jika QR sama dan dalam 3 detik terakhir, abaikan
                if (decodedText === lastScannedCode && (now - lastScanTime < 3000)) {
                    return;
                }

                lastScannedCode = decodedText;
                lastScanTime = now;

                console.log("✅ QR Scanned:", decodedText);

                const livewire = Livewire.find('{{ $this->getId() }}');
                if (livewire) {
                    livewire.set('qrContent', decodedText);
                    await livewire.call('scanQR');
                }
            }

            qrReader.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                onScanSuccess,
                () => { } // error callback (optional)
            ).catch(err => {
                console.error("Kamera gagal dibuka:", err);
                alert("Gagal membuka kamera. Pastikan izin kamera sudah diberikan.");
            });
        });
    </script

</x-filament::page>