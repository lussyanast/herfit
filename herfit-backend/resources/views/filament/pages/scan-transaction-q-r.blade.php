<x-filament::page>
    <div class="flex flex-col items-center justify-center space-y-6">

        {{-- Judul --}}
        <h2 class="text-2xl font-semibold text-center">Scan QR Transaksi</h2>

        {{-- Kamera --}}
        <div id="qr-reader" class="rounded-lg border border-gray-300 p-4 shadow-md w-full max-w-md"></div>

        {{-- Form --}}
        <form wire:submit.prevent="scanQR" class="flex flex-col items-center space-y-4 w-full max-w-md mt-4">
            <input type="hidden" wire:model="qrContent">
            <x-filament::button type="submit" size="lg" color="primary">
                Proses Transaksi
            </x-filament::button>
        </form>

        {{-- Hasil transaksi --}}
        @if($transaction)
            <x-filament::card class="w-full max-w-md">
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
                (decodedText, decodedResult) => {
                    console.log("QR Scanned:", decodedText);
                    Livewire.find('{{ $this->getId() }}').set('qrContent', decodedText);
                    qrReader.stop();
                },
                (errorMessage) => {
                    // silent error
                }
            ).catch(err => {
                console.error("Kamera gagal dibuka:", err);
                alert("Gagal membuka kamera. Coba izinkan kamera di browser.");
            });
        });
    </script>
</x-filament::page>
