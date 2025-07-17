-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.27-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for herfit_db
CREATE DATABASE IF NOT EXISTS `herfit_db` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `herfit_db`;

-- Dumping structure for table herfit_db.absensi
CREATE TABLE IF NOT EXISTS `absensi` (
  `id_absensi` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode_absensi` varchar(20) NOT NULL,
  `id_transaksi` int(10) unsigned NOT NULL,
  `id_pengguna` int(10) unsigned NOT NULL,
  `waktu_scan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_absensi`),
  KEY `absensi_id_transaksi_foreign` (`id_transaksi`),
  KEY `absensi_id_pengguna_foreign` (`id_pengguna`),
  CONSTRAINT `absensi_id_pengguna_foreign` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`),
  CONSTRAINT `absensi_id_transaksi_foreign` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.absensi: ~0 rows (approximately)

-- Dumping structure for table herfit_db.aktivitas
CREATE TABLE IF NOT EXISTS `aktivitas` (
  `id_aktivitas` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_pengguna` int(10) unsigned NOT NULL,
  `jenis_aktivitas` enum('latihan','makanan') NOT NULL,
  `nama_aktivitas` varchar(30) NOT NULL,
  `kalori` smallint(5) unsigned DEFAULT NULL,
  `durasi` tinyint(3) unsigned DEFAULT NULL,
  `jadwal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`jadwal`)),
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_aktivitas`),
  KEY `aktivitas_id_pengguna_foreign` (`id_pengguna`),
  CONSTRAINT `aktivitas_id_pengguna_foreign` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.aktivitas: ~0 rows (approximately)

-- Dumping structure for table herfit_db.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(100) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.cache: ~4 rows (approximately)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', 1752740526),
	('356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1752740526;', 1752740526),
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3', 'i:1;', 1752737764),
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer', 'i:1752737764;', 1752737764);

-- Dumping structure for table herfit_db.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.cache_locks: ~0 rows (approximately)

-- Dumping structure for table herfit_db.interaksi
CREATE TABLE IF NOT EXISTS `interaksi` (
  `id_interaksi` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_pengguna` int(10) unsigned NOT NULL,
  `id_postingan` int(10) unsigned NOT NULL,
  `jenis_interaksi` enum('like','komentar') NOT NULL,
  `isi_komentar` text DEFAULT NULL,
  `waktu_interaksi` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_interaksi`),
  KEY `interaksi_id_pengguna_foreign` (`id_pengguna`),
  KEY `interaksi_id_postingan_foreign` (`id_postingan`),
  CONSTRAINT `interaksi_id_pengguna_foreign` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`),
  CONSTRAINT `interaksi_id_postingan_foreign` FOREIGN KEY (`id_postingan`) REFERENCES `postingan` (`id_postingan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.interaksi: ~0 rows (approximately)

-- Dumping structure for table herfit_db.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.migrations: ~11 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000001_create_cache_table', 1),
	(2, '2025_03_20_103318_create_personal_access_tokens_table', 1),
	(3, '2025_07_14_100000_create_pengguna_table', 1),
	(4, '2025_07_14_100000_create_produk_table', 1),
	(5, '2025_07_14_100100_create_transaksi_table', 1),
	(6, '2025_07_14_100200_create_absen_table', 1),
	(7, '2025_07_14_100300_create_aktivitas_table', 1),
	(8, '2025_07_14_100400_create_postingan_table', 1),
	(9, '2025_07_14_100500_create_interaksi_table', 1),
	(10, '2025_07_14_131927_add_deleted_at_to_produk_table', 2),
	(11, '2025_07_17_171453_drop_unique_kode_absensi_on_absensi_table', 3);

-- Dumping structure for table herfit_db.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(30) NOT NULL,
  `token` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table herfit_db.pengguna
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id_pengguna` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `peran_pengguna` enum('admin','member') NOT NULL DEFAULT 'member',
  `nama_lengkap` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `kata_sandi` varchar(60) NOT NULL,
  `no_identitas` varchar(16) DEFAULT NULL,
  `no_telp` varchar(15) DEFAULT NULL,
  `foto_profil` varchar(150) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_pengguna`),
  UNIQUE KEY `pengguna_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.pengguna: ~1 rows (approximately)
INSERT INTO `pengguna` (`id_pengguna`, `peran_pengguna`, `nama_lengkap`, `email`, `email_verified_at`, `kata_sandi`, `no_identitas`, `no_telp`, `foto_profil`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'Admin Lussy', 'adminlussy@gmail.com', NULL, '$2y$12$z7TlzbElG//H1Zt2kkJEQelokVTZANWmhwDAtZLlm2esfFdmzjEoS', '1234567890123456', '085772492505', NULL, NULL, '2025-07-14 05:24:34', '2025-07-14 05:24:34');

-- Dumping structure for table herfit_db.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.personal_access_tokens: ~12 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\Pengguna', 12, 'auth', '3d457e76bccd2823478763db170cc66d8ea92c089d114dca8f5e86ff548b57d6', '["*"]', NULL, NULL, '2025-07-15 00:52:40', '2025-07-15 00:52:40'),
	(2, 'App\\Models\\Pengguna', 12, 'auth', 'aa6db157d6b159c5cdb563d728f98427390ee9b69193b4b304753516108b55e6', '["*"]', NULL, NULL, '2025-07-15 00:53:58', '2025-07-15 00:53:58'),
	(3, 'App\\Models\\Pengguna', 12, 'auth', '5f728ad12a4f3c9cd363ce359c733ad6507abfb4f791280fccda258bbb4900a1', '["*"]', NULL, NULL, '2025-07-15 01:02:14', '2025-07-15 01:02:14'),
	(4, 'App\\Models\\Pengguna', 12, 'auth', '0e1d4d87ec3786e55fc8ac589d4d7b4ac8cd107be7d1abd1ff028752cb56c1e2', '["*"]', '2025-07-15 01:11:51', NULL, '2025-07-15 01:07:24', '2025-07-15 01:11:51'),
	(5, 'App\\Models\\Pengguna', 12, 'auth', '3611be47500d94cd81cbe5a732a8913dd01f865c66a3bcc3de499d6d16ae80dc', '["*"]', '2025-07-15 01:16:40', NULL, '2025-07-15 01:11:57', '2025-07-15 01:16:40'),
	(6, 'App\\Models\\Pengguna', 12, 'auth', '0c2d190bfc6cc00945b089fa91dba13b7c11718d441fe124049e2958c3820a8d', '["*"]', '2025-07-15 01:57:09', NULL, '2025-07-15 01:16:47', '2025-07-15 01:57:09'),
	(7, 'App\\Models\\Pengguna', 12, 'auth', '0a6fb45910ee076b3ee19356af1a7aad15cd430a45267d68a9fac9507ded3d8c', '["*"]', '2025-07-15 11:56:57', NULL, '2025-07-15 01:57:45', '2025-07-15 11:56:57'),
	(8, 'App\\Models\\Pengguna', 12, 'auth', '8cc234e33abc3d5e9ab3ace4acc642ba536c423e7076e424cd470c64b44a89cf', '["*"]', '2025-07-17 02:43:38', NULL, '2025-07-15 12:04:55', '2025-07-17 02:43:38'),
	(9, 'App\\Models\\Pengguna', 13, 'auth', '30eee6f2c8062206fa1abc0859aae3895cbf1ddd07206dd0ae0157c2e4cf7e98', '["*"]', '2025-07-17 02:19:22', NULL, '2025-07-17 02:05:39', '2025-07-17 02:19:22'),
	(10, 'App\\Models\\Pengguna', 12, 'auth', '8e6039f62f05029820adb47512941b0d9a3c2f9499f618c7699c335089332840', '["*"]', '2025-07-17 03:10:08', NULL, '2025-07-17 03:09:58', '2025-07-17 03:10:08'),
	(11, 'App\\Models\\Pengguna', 12, 'auth', 'df4e37a65bac49686660d8c2ca93ea45218648bcdffe6c0c96289346cf750bfe', '["*"]', '2025-07-17 03:13:37', NULL, '2025-07-17 03:10:27', '2025-07-17 03:13:37'),
	(12, 'App\\Models\\Pengguna', 12, 'auth', '47d7b612e8c3a42232771fecefd77e35de9f10ce126965ea13d44e88f6db2e69', '["*"]', '2025-07-17 08:35:39', NULL, '2025-07-17 03:13:58', '2025-07-17 08:35:39');

-- Dumping structure for table herfit_db.postingan
CREATE TABLE IF NOT EXISTS `postingan` (
  `id_postingan` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_pengguna` int(10) unsigned NOT NULL,
  `caption` text NOT NULL,
  `foto_postingan` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_postingan`),
  KEY `postingan_id_pengguna_foreign` (`id_pengguna`),
  CONSTRAINT `postingan_id_pengguna_foreign` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.postingan: ~0 rows (approximately)

-- Dumping structure for table herfit_db.produk
CREATE TABLE IF NOT EXISTS `produk` (
  `id_produk` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode_produk` varchar(6) NOT NULL,
  `nama_produk` varchar(30) NOT NULL,
  `kategori_produk` varchar(15) NOT NULL,
  `deskripsi_produk` text DEFAULT NULL,
  `maksimum_peserta` int(11) DEFAULT 3,
  `harga_produk` int(10) unsigned NOT NULL,
  `foto_produk` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_produk`),
  UNIQUE KEY `produk_kode_produk_unique` (`kode_produk`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.produk: ~0 rows (approximately)

-- Dumping structure for table herfit_db.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id_session` varchar(255) NOT NULL,
  `id_pengguna` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `agent_pengguna` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `aktivitas_terakhir` int(11) NOT NULL,
  PRIMARY KEY (`id_session`),
  KEY `sessions_id_pengguna_index` (`id_pengguna`),
  KEY `sessions_aktivitas_terakhir_index` (`aktivitas_terakhir`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.sessions: ~0 rows (approximately)

-- Dumping structure for table herfit_db.transaksi
CREATE TABLE IF NOT EXISTS `transaksi` (
  `id_transaksi` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode_transaksi` varchar(20) NOT NULL,
  `id_pengguna` int(10) unsigned NOT NULL,
  `id_produk` int(10) unsigned NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `jumlah_hari` tinyint(3) unsigned NOT NULL,
  `jumlah_bayar` int(10) unsigned NOT NULL,
  `status_transaksi` enum('waiting','approved','rejected') NOT NULL,
  `bukti_pembayaran` varchar(150) DEFAULT NULL,
  `kode_qr` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_transaksi`),
  UNIQUE KEY `transaksi_kode_transaksi_unique` (`kode_transaksi`),
  KEY `transaksi_id_pengguna_foreign` (`id_pengguna`),
  KEY `transaksi_id_produk_foreign` (`id_produk`),
  CONSTRAINT `transaksi_id_pengguna_foreign` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id_pengguna`),
  CONSTRAINT `transaksi_id_produk_foreign` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit_db.transaksi: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
