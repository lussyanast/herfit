import { Produk } from "./produk";

export interface Transaction {
    id: number;
    user_id: number;
    listing_id: number;
    start_date: Date;
    end_date: Date;
    total_days: number;
    price: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    produk: Produk;
    kode_transaksi?: string;
    qr_code_url?: string;
    jumlah_hari?: number;
    jumlah_bayar?: number;
    status_transaksi?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
}