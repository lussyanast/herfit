-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
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


-- Dumping database structure for herfit
CREATE DATABASE IF NOT EXISTS `herfit` /*!40100 DEFAULT CHARACTER SET armscii8 COLLATE armscii8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `herfit`;

-- Dumping structure for table herfit.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.cache: ~6 rows (approximately)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('17ba0791499db908433b80f37c5fbc89b870084b', 'i:1;', 1747397331),
	('17ba0791499db908433b80f37c5fbc89b870084b:timer', 'i:1747397331;', 1747397331),
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3', 'i:1;', 1747396907),
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer', 'i:1747396907;', 1747396907),
	('rkutch@example.org|127.0.0.1', 'i:1;', 1744898006),
	('rkutch@example.org|127.0.0.1:timer', 'i:1744898006;', 1744898006);

-- Dumping structure for table herfit.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.cache_locks: ~0 rows (approximately)

-- Dumping structure for table herfit.listings
CREATE TABLE IF NOT EXISTS `listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `max_person` smallint unsigned NOT NULL DEFAULT '0',
  `price` text NOT NULL,
  `attachments` longtext,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `listings_listing_name_unique` (`listing_name`),
  UNIQUE KEY `listings_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.listings: ~10 rows (approximately)
INSERT INTO `listings` (`id`, `listing_name`, `slug`, `category`, `description`, `max_person`, `price`, `attachments`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Quisquam Dolores', 'quisquam-dolores', 'Lainnya', 'Eius qui voluptatem quas commodi aliquid. Neque eos expedita fugit ipsum mollitia rerum. Voluptatem sit expedita voluptatum sequi fugiat sed. A qui et autem. Facere quas ut dicta et.', 9, '10', NULL, '2025-04-17 13:24:28', '2025-05-16 12:22:43', '2025-05-16 12:22:43'),
	(2, 'Aut Voluptatum', 'aut-voluptatum', 'Lainnya', 'Libero et accusantium soluta autem autem qui. Voluptatem quos ullam laudantium molestiae ratione. Et inventore impedit minima blanditiis qui iusto inventore. Rerum aut provident tempore. Delectus alias natus quod. Accusantium corrupti commodi ut est aut et.', 3, '1', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(3, 'Velit Minima', 'velit-minima', 'Membership', 'Enim vitae fugiat facilis. Saepe recusandae est ut aut. Debitis omnis ducimus ea quo ratione. Iusto possimus neque nisi quas. Necessitatibus voluptatem repellat molestias minus dolor magni. Modi molestiae aperiam a aut quasi praesentium.', 10, '3', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(4, 'Dolores Iusto', 'dolores-iusto', 'Membership', 'Rem quis aut reprehenderit eaque dolorum rerum quas. Voluptates consequatur repellendus reprehenderit sed. Quo et quia recusandae sit consectetur hic sunt. Omnis amet qui voluptates tempora odit provident veniam. Veritatis totam mollitia doloribus quo. Nemo ipsum nemo recusandae porro qui aut. Voluptates veniam illo laboriosam porro quo qui ut. Officia non provident labore nesciunt officia veniam.', 9, '8', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(5, 'Eaque Minus', 'eaque-minus', 'Membership', 'Quae harum vero sint amet quod nobis. Id dolor at placeat sequi illum. Sit excepturi ea corrupti doloremque. Voluptatem et ab suscipit nihil hic cupiditate officiis.', 7, '9', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(6, 'Perferendis Qui', 'perferendis-qui', 'Lainnya', 'Id recusandae ipsum libero earum saepe totam consequatur. Ut et ea recusandae voluptate nulla et. Est est tenetur et quos iste. Sunt at nemo eos mollitia iste.', 2, '10', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(7, 'Itaque Voluptatem', 'itaque-voluptatem', 'Membership', 'Omnis officiis quia autem veritatis. Ipsa repudiandae accusantium porro omnis rem impedit officia eum. Sed et commodi ea ratione blanditiis vero nulla laborum. Perspiciatis quasi voluptatem quis minus esse.', 1, '3', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(8, 'Repellat Voluptatem', 'repellat-voluptatem', 'Membership', 'Ullam harum laborum in ea. Enim qui voluptas veritatis ad assumenda. Ut dignissimos consectetur nihil explicabo quos unde et. Dolor harum dolor ea. Repudiandae eveniet laborum illum corporis architecto alias porro. Reiciendis dolores nobis voluptas beatae itaque. Vel eveniet dolor deserunt et.', 4, '6', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(9, 'Cum Perspiciatis', 'cum-perspiciatis', 'Membership', 'Ratione id rem ratione ut ut expedita. Non aut qui quibusdam asperiores fugit sequi totam vel. Aut dolorum id animi ratione aut eligendi. Tempora et qui molestiae corporis ipsum voluptate. Ut excepturi natus qui praesentium sequi.', 3, '2', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(10, 'Labore Reprehenderit', 'labore-reprehenderit', 'Lainnya', 'Quia molestiae accusantium aspernatur qui velit accusantium. Non fuga sed cupiditate consequatur doloremque iste. Omnis a et vel dolores sit cupiditate sunt. Necessitatibus ut incidunt aspernatur porro magni voluptate. Quae molestiae nemo rerum odio et a consequuntur.', 7, '6', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28', NULL),
	(11, 'Member 1 Bulan', 'member-1-bulan', 'Membership', 'Keanggotaan selama 1 bulan, tidak ada batas kunjungan.', 200, '235000', '["listings\\/01JVCFWWXTS67Z50FZ4GGKGC3G.png"]', '2025-05-16 12:07:56', '2025-05-16 12:07:56', NULL);

-- Dumping structure for table herfit.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.migrations: ~8 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2025_03_15_043843_create_listings_table', 1),
	(5, '2025_03_20_011428_create_transactions_table', 1),
	(6, '2025_03_20_103318_create_personal_access_tokens_table', 1),
	(7, '2025_04_18_131316_add_qr_code_to_transactions_table', 2),
	(8, '2025_04_18_132314_create_attendances_table', 3),
	(9, '2025_04_18_143847_add_qr_code_to_transactions', 4),
	(10, '2025_04_18_150128_create_transaction_scans_table', 5);

-- Dumping structure for table herfit.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table herfit.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.personal_access_tokens: ~13 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 22, 'auth', '15d63167fe4bf3cc855768d6871280e4de3738a52d9c5ea9d82ce4b3b06f7aeb', '["*"]', '2025-04-18 03:34:04', NULL, '2025-04-17 13:25:08', '2025-04-18 03:34:04'),
	(2, 'App\\Models\\User', 23, 'auth', 'ccf368c7cd1924facfb9956cf5937bc5ed4db514a11be96ad6f9eecc9c81f0d7', '["*"]', NULL, NULL, '2025-04-17 13:52:40', '2025-04-17 13:52:40'),
	(3, 'App\\Models\\User', 22, 'auth', '1f9f1616a196b80f0a4d17c0c70f276a0ef6da54db3948024b8dc1a12edb8927', '["*"]', '2025-04-18 03:55:16', NULL, '2025-04-18 03:36:13', '2025-04-18 03:55:16'),
	(4, 'App\\Models\\User', 22, 'auth', 'de6f01c01c4af04ab57d79e1fde6abd6b909706bd61f76c07efcf18f90aa88c2', '["*"]', NULL, NULL, '2025-04-18 04:07:55', '2025-04-18 04:07:55'),
	(5, 'App\\Models\\User', 22, 'auth', 'db2a48e57f95a6d194d4348d516ee10af35ae547d0d2771910c96045bc3bc3ce', '["*"]', NULL, NULL, '2025-04-18 04:20:44', '2025-04-18 04:20:44'),
	(6, 'App\\Models\\User', 22, 'auth', '7a01a2a7637afe82ffa8a48c95fb5320e31f7ed848a53b5a032c7f993ae8295d', '["*"]', NULL, NULL, '2025-04-18 04:22:20', '2025-04-18 04:22:20'),
	(7, 'App\\Models\\User', 22, 'auth', '6b7f3a9e114dab5c8c450eaaa0eaef95384b8cd3357ff9fb4d34ab336248265e', '["*"]', NULL, NULL, '2025-04-18 04:26:47', '2025-04-18 04:26:47'),
	(8, 'App\\Models\\User', 22, 'auth', '08e4033eb738f736aff064f37db120e1df814766df28abf3fea5a9e82ecb4e42', '["*"]', '2025-04-18 05:20:19', NULL, '2025-04-18 04:37:56', '2025-04-18 05:20:19'),
	(9, 'App\\Models\\User', 22, 'auth', '430b74d06f9396179a7821acb24be8f50b57aa31ac3a3d459f46a77123d6e4ff', '["*"]', '2025-04-18 05:22:53', NULL, '2025-04-18 05:22:05', '2025-04-18 05:22:53'),
	(10, 'App\\Models\\User', 22, 'auth', 'a432ebcaa8ae1a2ad41db4bdc70a4c6ac195511d798dca3388895bad0bc90f79', '["*"]', '2025-04-18 11:54:28', NULL, '2025-04-18 05:23:11', '2025-04-18 11:54:28'),
	(11, 'App\\Models\\User', 22, 'auth', '955796624cad5460dd37d295bca603a245c2775aec16a18d7de729095ca56129', '["*"]', NULL, NULL, '2025-04-18 12:09:24', '2025-04-18 12:09:24'),
	(12, 'App\\Models\\User', 22, 'auth', 'eb0ea1a875770918f25e6b3ff83df5cc0a93ae488487ffe2e06f7412ce9ac10b', '["*"]', NULL, NULL, '2025-04-18 12:26:17', '2025-04-18 12:26:17'),
	(13, 'App\\Models\\User', 22, 'auth', 'dd22fee221ff018c1c1cc7e6855f7f1ea7f18d20ef0d145b44c32a568723e8d6', '["*"]', '2025-04-18 12:46:09', NULL, '2025-04-18 12:28:28', '2025-04-18 12:46:09'),
	(14, 'App\\Models\\User', 22, 'auth', 'a42ea1a2a056f5345f10d45b1c832e4b609b24b34e475792ecf0a1e595d5a08c', '["*"]', '2025-04-18 15:02:48', NULL, '2025-04-18 12:48:20', '2025-04-18 15:02:48'),
	(15, 'App\\Models\\User', 22, 'auth', '21b712faf2758df4a7ef19a73a145f7f034699aed9c72fe0ddd78a472e4114f9', '["*"]', '2025-04-18 15:24:27', NULL, '2025-04-18 15:14:12', '2025-04-18 15:24:27'),
	(16, 'App\\Models\\User', 23, 'auth', '05fb119d5d20ea2907afe05f292ff911b1c3a7f85ffdecd86f8dd2b11fe6611d', '["*"]', '2025-04-19 13:53:49', NULL, '2025-04-19 13:30:23', '2025-04-19 13:53:49'),
	(17, 'App\\Models\\User', 22, 'auth', '6ac2f199915f30ac92db6d46c75936feee9692398cbed5c93941ca82df73a27a', '["*"]', '2025-04-24 04:49:57', NULL, '2025-04-24 04:48:52', '2025-04-24 04:49:57'),
	(18, 'App\\Models\\User', 22, 'auth', 'd3ce82de8a44dbb8154a571cb90ba8a95df34b2f01e1b56bc468c4293a393bb5', '["*"]', NULL, NULL, '2025-05-02 01:24:33', '2025-05-02 01:24:33'),
	(19, 'App\\Models\\User', 22, 'auth', 'edd0fe8ac93535e9351219add0df9f652f94fc1b3f2af7800ee1f747cb0f2074', '["*"]', '2025-05-02 02:03:43', NULL, '2025-05-02 01:24:37', '2025-05-02 02:03:43');

-- Dumping structure for table herfit.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_days` int unsigned NOT NULL DEFAULT '0',
  `price` int unsigned NOT NULL DEFAULT '0',
  `status` enum('waiting','approved','canceled') NOT NULL DEFAULT 'waiting',
  `qr_code_path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_user_id_foreign` (`user_id`),
  KEY `transactions_listing_id_foreign` (`listing_id`),
  CONSTRAINT `transactions_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.transactions: ~32 rows (approximately)
INSERT INTO `transactions` (`id`, `user_id`, `listing_id`, `start_date`, `end_date`, `total_days`, `price`, `status`, `qr_code_path`, `created_at`, `updated_at`) VALUES
	(1, 15, 9, NULL, NULL, 0, 0, 'waiting', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(2, 21, 6, NULL, NULL, 0, 0, 'waiting', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(3, 20, 4, NULL, NULL, 0, 0, 'canceled', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(4, 21, 9, NULL, NULL, 0, 0, 'approved', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(5, 16, 3, NULL, NULL, 0, 0, 'approved', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(6, 14, 4, NULL, NULL, 0, 0, 'canceled', NULL, '2025-04-17 13:24:28', '2025-05-16 12:28:18'),
	(7, 20, 10, NULL, NULL, 0, 0, 'waiting', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(8, 19, 6, NULL, NULL, 0, 0, 'approved', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(9, 20, 7, NULL, NULL, 0, 0, 'approved', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(10, 17, 10, NULL, NULL, 0, 0, 'waiting', NULL, '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(11, 22, 9, '2025-04-01', '2025-04-30', 30, 0, 'waiting', NULL, '2025-04-18 06:50:52', '2025-04-18 06:50:52'),
	(12, 22, 4, '2025-04-01', '2025-04-30', 30, 0, 'waiting', NULL, '2025-04-18 07:17:32', '2025-04-18 07:17:32'),
	(13, 22, 4, '2025-04-01', '2025-04-30', 30, 0, 'waiting', NULL, '2025-04-18 07:17:37', '2025-04-18 07:17:37'),
	(14, 22, 4, '2025-04-01', '2025-04-30', 30, 0, 'waiting', NULL, '2025-04-18 07:27:32', '2025-04-18 07:27:32'),
	(15, 22, 7, '2025-04-09', '2025-04-30', 22, 0, 'waiting', NULL, '2025-04-18 07:27:55', '2025-04-18 07:27:55'),
	(16, 22, 4, '2025-04-01', '2025-04-30', 30, 0, 'waiting', NULL, '2025-04-18 08:16:54', '2025-04-18 08:16:54'),
	(17, 22, 4, '2025-04-01', '2025-04-18', 18, 0, 'waiting', 'qr_codes/transaction_17_TWUv2R.png', '2025-04-18 08:19:01', '2025-04-18 08:19:02'),
	(18, 22, 4, '2025-04-01', '2025-04-17', 17, 0, 'waiting', 'qr_codes/transaction_18_dF95oa.png', '2025-04-18 08:28:12', '2025-04-18 08:28:12'),
	(19, 22, 4, '2025-04-01', '2025-04-19', 19, 0, 'waiting', 'qr_codes/transaction_19_L2hXMk.png', '2025-04-18 08:29:29', '2025-04-18 08:29:29'),
	(20, 22, 4, '2025-04-01', '2025-04-19', 19, 0, 'waiting', 'qr_codes/transaction_20_Rmtykr.png', '2025-04-18 08:30:49', '2025-04-18 08:30:49'),
	(21, 22, 3, '2025-04-01', '2025-04-18', 18, 0, 'waiting', 'qr_codes/transaction_21_dhOOxQ.png', '2025-04-18 08:42:37', '2025-04-18 08:42:37'),
	(22, 22, 1, '2025-04-01', '2025-04-18', 18, 0, 'waiting', 'qr_codes/transaction_22_sQxBs3.png', '2025-04-18 09:41:19', '2025-04-18 09:41:19'),
	(23, 22, 1, '2025-04-09', '2025-04-18', 10, 0, 'waiting', 'qr_codes/transaction_23_x1jaKQ.png', '2025-04-18 09:56:37', '2025-04-18 09:56:38'),
	(24, 22, 1, '2025-04-09', '2025-04-18', 10, 0, 'waiting', 'qr_codes/transaction_24_3sThoP.png', '2025-04-18 11:44:49', '2025-04-18 11:44:49'),
	(25, 22, 9, '2025-04-01', '2025-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:28:55', '2025-04-18 12:28:55'),
	(26, 22, 9, '2025-04-01', '2025-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:32:34', '2025-04-18 12:32:34'),
	(27, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:37:55', '2025-04-18 12:37:55'),
	(28, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:40:18', '2025-04-18 12:40:18'),
	(29, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:40:34', '2025-04-18 12:40:34'),
	(30, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:46:10', '2025-04-18 12:46:10'),
	(31, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:48:31', '2025-04-18 12:48:31'),
	(32, 22, 3, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:51:53', '2025-04-18 12:51:53'),
	(33, 22, 10, '2020-04-01', '2020-04-18', 18, 0, 'waiting', NULL, '2025-04-18 12:52:22', '2025-04-18 12:52:22'),
	(34, 22, 10, '2025-04-01', '2025-04-17', 17, 0, 'waiting', NULL, '2025-04-18 12:55:51', '2025-04-18 12:55:51'),
	(35, 22, 10, '2025-04-01', '2025-04-17', 17, 0, 'waiting', NULL, '2025-04-18 12:58:35', '2025-04-18 12:58:35'),
	(36, 22, 10, '2025-04-01', '2025-04-17', 17, 0, 'approved', 'qr_codes/transaction_36_uE58YN.png', '2025-04-18 12:59:36', '2025-04-18 13:25:45'),
	(37, 23, 1, '2025-04-01', '2025-04-17', 17, 0, 'waiting', 'qr_codes/transaction_37_kH6UD7.png', '2025-04-19 13:38:55', '2025-04-19 13:38:56'),
	(38, 22, 3, '2025-04-01', '2025-05-01', 31, 0, 'approved', 'qr_codes/transaction_38_regXHf.png', '2025-04-24 04:49:51', '2025-04-24 04:49:53');

-- Dumping structure for table herfit.transaction_scans
CREATE TABLE IF NOT EXISTS `transaction_scans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint unsigned NOT NULL,
  `scanned_by` bigint unsigned NOT NULL,
  `scanned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_scans_transaction_id_foreign` (`transaction_id`),
  KEY `transaction_scans_scanned_by_foreign` (`scanned_by`),
  CONSTRAINT `transaction_scans_scanned_by_foreign` FOREIGN KEY (`scanned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `transaction_scans_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.transaction_scans: ~4 rows (approximately)
INSERT INTO `transaction_scans` (`id`, `transaction_id`, `scanned_by`, `scanned_at`) VALUES
	(1, 36, 11, '2025-04-18 13:36:04'),
	(2, 36, 11, '2025-04-18 14:42:18'),
	(3, 37, 11, '2025-04-19 13:39:24'),
	(4, 37, 11, '2025-04-19 13:45:08'),
	(5, 38, 11, '2025-04-24 04:52:56');

-- Dumping structure for table herfit.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `no_identitas` varchar(255) DEFAULT NULL,
  `photo_profile` varchar(255) DEFAULT NULL,
  `no_telp` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table herfit.users: ~21 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `no_identitas`, `photo_profile`, `no_telp`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Palma Bashirian', 'qhartmann@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '9114789888541692', NULL, '+1-845-376-2260', 'TdeP6EhwXx', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(2, 'Mrs. Nicolette Harvey IV', 'ernestine.harris@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '9536062550570728', NULL, '+1-458-546-7888', 'Z9WlLv4Ppt', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(3, 'Mr. Grady Johns', 'flangworth@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '9061130236044327', NULL, '+1 (423) 240-3442', 'YzArQ0p9wJ', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(4, 'Jacky O\'Conner', 'dante.ward@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '7491204701240530', NULL, '+1-248-808-1792', 'Vc6TUN34ow', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(5, 'Keagan Kling', 'bwintheiser@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '1735703142461792', NULL, '+1 (520) 946-6206', '1c79dbFhaP', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(6, 'Grayce Crist', 'maybelle09@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '4330412311010042', NULL, '1-424-510-1239', 'oPOqKbSOGj', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(7, 'Prof. Eldred Ortiz DDS', 'keara.rohan@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '3280380639737333', NULL, '480-647-5132', 'XuQcyutBYT', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(8, 'Ms. Lois Goyette DVM', 'bturner@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '7308201898949625', NULL, '+12693127414', 'erdHECozx3', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(9, 'Rosalind Goyette', 'istrosin@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '9135799667005588', NULL, '541-967-3075', 'qwJwm1cp8A', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(10, 'Ms. Martine Murray', 'alena61@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '0046091967319323', NULL, '838.846.0774', 'k3CPQo1oZ9', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(11, 'Admin Lussy', 'lussyanast@gmail.com', '2025-04-17 13:24:28', '$2y$12$k9XU2gKxuDsOSEyCDeD74uelEOzpSGgB33rCVoaKnSzsrLQ59AZ.S', 'admin', '2864269370575384', NULL, '248.621.9252', 'haExXbX8PYTtpFICv5w7iWYTFDsyl4cQgrIrafFYfi8wTNrCetW9Go646cLA', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(12, 'Sophie Denesik III', 'erdman.lorena@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '8186765745755961', NULL, '+1 (661) 766-3115', 'hvvsHcZnPM', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(13, 'Caleigh Reichert', 'mdenesik@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '5730011594167432', NULL, '+1-763-999-0703', 'UY3dfcxJL1', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(14, 'Isabella Lubowitz', 'nicola.labadie@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '4284409315743702', NULL, '551.425.5579', 'Gyl36aggkz', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(15, 'Heaven Abernathy', 'lkessler@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '9214054463741876', NULL, '+1-702-283-4229', 'm41xnyaOJy', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(16, 'Alia Crist', 'aracely68@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '6626074749004159', NULL, '640-964-6399', 'Vni0QZNL24', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(17, 'Elisabeth Torp', 'umonahan@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '6520088338589505', NULL, '(269) 237-8996', 'svJfOuOQhr', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(18, 'Prof. Leonora Rau II', 'billy33@example.org', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '2722351049322238', NULL, '+1.952.782.6522', 'zAueTRd3MR', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(19, 'Miss Marisol Howell', 'tony.morar@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '4129630022333013', NULL, '+1 (862) 203-8748', 'DPcWhSvFuF', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(20, 'Mr. Devonte Hoppe MD', 'elmore.renner@example.com', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '3345641311666638', NULL, '+19282553556', 'NKQX48d9OH', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(21, 'Lizzie Eichmann', 'keenan85@example.net', '2025-04-17 13:24:28', '$2y$12$Nkv6sJh3Pc87PrTLesvbm.99gG3d8R9pJHzq4aAoflpZ14ckpOUh6', 'customer', '7628159696555194', NULL, '+1-380-313-4887', 'aLwvXrEPgo', '2025-04-17 13:24:28', '2025-04-17 13:24:28'),
	(22, 'test aja sih ya', 'abbie67@example.net', NULL, '$2y$12$XjD2sZu159WiUlJyIz1Pmez.dTYqva53l7Tu9GLDeWU6nmMCVPfNW', 'customer', '1234567890123456', 'profile/i3TfUPfnCyxKyLMljyFWF2AAesDb24BvKMR5iwgo.jpg', '542345678974', NULL, '2025-04-17 13:25:08', '2025-04-18 15:23:26'),
	(23, 'Lussy Triana', 'lussyanast03@gmail.com', NULL, '$2y$12$jC6Bj/dF2XuwyP5GKh01d.KQRT3pPXT2FSn7Phab599Vi5Mr1BEK2', 'customer', '5432123456789123', 'profile/uoCHSKdVRgiNkg4gjjPux9IvgBewWOVJFcnaWikR.jpg', '085772492505', NULL, '2025-04-17 13:52:40', '2025-04-19 13:31:32');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
