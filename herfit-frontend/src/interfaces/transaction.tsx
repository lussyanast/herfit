import { Produk } from "./produk";

export interface Transaction {
    id_transaksi: number;
    kode_transaksi: string;
    id_pengguna: number;
    id_produk: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jumlah_hari: number;
    jumlah_bayar: number;
    status_transaksi: "waiting" | "approved" | "rejected";
    kode_qr?: string;
    qr_code_url?: string;
    produk: Produk;
}