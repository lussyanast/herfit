export interface Produk {
  id_produk: number;
  kode_produk: string;
  nama_produk: string;
  kategori_produk: string;
  deskripsi_produk: string;
  maksimum_peserta: number;
  harga_produk: number;
  foto_produk: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
