<div class="flex items-center justify-center">
    @isset($url)
        <img src="{{ $url }}" alt="Bukti Bayar" class="max-w-full max-h-[80vh] rounded-lg shadow-md">
    @else
        <p class="text-gray-500 italic">Bukti pembayaran tidak ditemukan.</p>
    @endisset
</div>
