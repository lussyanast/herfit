<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class Store extends FormRequest
{
    /**
     * Hanya mengizinkan user dengan role 'member' untuk melakukan request ini
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->peran_pengguna === 'member';
    }

    /**
     * Validasi input dari form transaksi
     */
    public function rules(): array
    {
        return [
            'id_produk' => 'required|exists:produk,id_produk',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ];
    }

    /**
     * Override bawaan Laravel agar validasi error dikembalikan sebagai JSON API
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = (new ValidationException($validator))->errors();

        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'data' => $errors,
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }
}