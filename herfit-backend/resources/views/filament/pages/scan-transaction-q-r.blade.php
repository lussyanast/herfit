<x-filament::page>
    <script>
        window.csrfToken = '{{ csrf_token() }}';
    </script>

    <div class="flex flex-col items-center justify-center space-y-6">
        <h2 class="text-2xl font-semibold text-center">Scan QR Transaksi</h2>

        <div id="qr-reader" class="rounded-lg border border-gray-300 p-4 shadow-md w-full max-w-md"></div>

        @if($transaction)
            <x-filament::card class="w-full max-w-md mt-6">
                <x-slot name="header">
                    <h3 class="text-lg font-bold">Detail Transaksi</h3>
                </x-slot>

                <div class="space-y-1 text-sm">
                    <p><strong>Nama User:</strong> {{ $transaction->user->name }}</p>
                    <p><strong>Listing:</strong> {{ $transaction->listing->listing_name ?? '-' }}</p>
                    <p><strong>Tanggal Mulai:</strong> {{ $transaction->start_date }}</p>
                    <p><strong>Tanggal Selesai:</strong> {{ $transaction->end_date }}</p>
                    <p><strong>Status:</strong> {{ $transaction->status }}</p>
                </div>
            </x-filament::card>
        @endif
    </div>

    {{-- Script QR --}}
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const qrReader = new Html5Qrcode("qr-reader");

            qrReader.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    console.log("QR Scanned:", decodedText);

                    // Kirim ke server Laravel
                    fetch("/scan/save", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": window.csrfToken
                        },
                        body: JSON.stringify({ qr: decodedText })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                alert("✅ Scan berhasil disimpan!");
                            } else {
                                alert("❌ Gagal: " + data.message);
                            }
                        })
                        .catch(err => {
                            console.error("Error kirim:", err);
                        });

                    qrReader.stop();
                },
                (errorMessage) => {
                    // ignore
                }
            ).catch(err => {
                console.error("Kamera gagal dibuka:", err);
                alert("Gagal membuka kamera.");
            });
        });
    </script>
</x-filament::page>