<div class="flex items-center justify-center min-h-[300px]">
    @isset($url)
        <img src="{{ $url }}" alt="Bukti Pembayaran" class="max-w-full max-h-[80vh] rounded-md shadow-md border"
            onerror="this.src='/images/not-found.png';">
    @else
        <p class="text-gray-400 italic">Bukti pembayaran tidak ditemukan.</p>
    @endisset
</div>