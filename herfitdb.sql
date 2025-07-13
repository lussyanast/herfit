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


-- Dumping database structure for herfit
CREATE DATABASE IF NOT EXISTS `herfit` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `herfit`;

-- Dumping structure for table herfit.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.cache: ~2 rows (approximately)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3', 'i:1;', 1750726093),
	('livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer', 'i:1750726093;', 1750726093);

-- Dumping structure for table herfit.fitness_comments
CREATE TABLE IF NOT EXISTS `fitness_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `fitness_post_id` int(10) unsigned NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fitness_comments_fitness_post_id_foreign` (`fitness_post_id`),
  KEY `fitness_comments_user_id_foreign` (`user_id`),
  CONSTRAINT `fitness_comments_fitness_post_id_foreign` FOREIGN KEY (`fitness_post_id`) REFERENCES `fitness_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fitness_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.fitness_comments: ~3 rows (approximately)
INSERT INTO `fitness_comments` (`id`, `user_id`, `fitness_post_id`, `comment`, `created_at`, `updated_at`) VALUES
	(1, 1, 3, 'hii', '2025-06-01 05:52:34', '2025-06-01 05:52:34'),
	(2, 22, 3, 'haloo', '2025-06-01 14:12:15', '2025-06-01 14:12:15'),
	(3, 22, 4, 'hhehhe', '2025-06-01 14:17:57', '2025-06-01 14:17:57');

-- Dumping structure for table herfit.fitness_likes
CREATE TABLE IF NOT EXISTS `fitness_likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `fitness_post_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fitness_likes_user_id_fitness_post_id_unique` (`user_id`,`fitness_post_id`),
  KEY `fitness_likes_fitness_post_id_foreign` (`fitness_post_id`),
  CONSTRAINT `fitness_likes_fitness_post_id_foreign` FOREIGN KEY (`fitness_post_id`) REFERENCES `fitness_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fitness_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.fitness_likes: ~3 rows (approximately)
INSERT INTO `fitness_likes` (`id`, `user_id`, `fitness_post_id`, `created_at`, `updated_at`) VALUES
	(3, 1, 3, '2025-06-01 05:47:47', '2025-06-01 05:47:47'),
	(4, 22, 3, '2025-06-01 14:12:05', '2025-06-01 14:12:05'),
	(5, 22, 4, '2025-06-01 14:17:52', '2025-06-01 14:17:52');

-- Dumping structure for table herfit.fitness_posts
CREATE TABLE IF NOT EXISTS `fitness_posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `caption` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fitness_posts_user_id_foreign` (`user_id`),
  CONSTRAINT `fitness_posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.fitness_posts: ~4 rows (approximately)
INSERT INTO `fitness_posts` (`id`, `user_id`, `caption`, `image_url`, `created_at`, `updated_at`) VALUES
	(1, 1, 'halo', 'feeds/99zTEZUd8hmRAX6atm9Ru30FmQrcu8voirfJzlxQ.png', '2025-06-01 05:14:07', '2025-06-01 05:14:07'),
	(2, 1, 'halo', 'feeds/zfWMzB47P2YGk8wkREP1FFW6KMZd4KWs33qRazda.png', '2025-06-01 05:15:07', '2025-06-01 05:15:07'),
	(3, 1, 'halo', 'feeds/lXV2YfhVn3GnQje6wEvEzmgk3nmBjq8S4HaOzZM6.png', '2025-06-01 05:22:57', '2025-06-01 05:22:57'),
	(4, 22, 'haii semuanya', NULL, '2025-06-01 14:17:22', '2025-06-01 14:17:22');

-- Dumping structure for table herfit.food_consumeds
CREATE TABLE IF NOT EXISTS `food_consumeds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `food_name` varchar(150) NOT NULL,
  `calories` int(10) NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `food_consumeds_user_id_foreign` (`user_id`),
  CONSTRAINT `food_consumeds_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.food_consumeds: ~3 rows (approximately)
INSERT INTO `food_consumeds` (`id`, `user_id`, `food_name`, `calories`, `date`, `created_at`, `updated_at`) VALUES
	(2, 22, 's', 2, '2025-06-01', '2025-06-01 13:47:25', '2025-06-01 13:47:25'),
	(3, 22, 'ds', 22, '2025-06-27', '2025-06-01 13:47:38', '2025-06-01 13:47:38'),
	(5, 22, 'ds', 2, '2025-05-07', '2025-06-01 13:57:18', '2025-06-01 13:57:18'),
	(6, 24, 'Matcha', 50, '2025-06-23', '2025-06-23 12:51:48', '2025-06-23 12:51:48');

-- Dumping structure for table herfit.listings
CREATE TABLE IF NOT EXISTS `listings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `listing_name` varchar(150) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `category` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `max_person` int(5) unsigned NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `attachments` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `listings_listing_name_unique` (`listing_name`),
  UNIQUE KEY `listings_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.listings: ~11 rows (approximately)
INSERT INTO `listings` (`id`, `listing_name`, `slug`, `category`, `description`, `max_person`, `price`, `attachments`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Aut Expedita', 'aut-expedita', 'Membership', 'Ullam magni sunt mollitia voluptatem quia. Assumenda possimus et quia. Laudantium voluptatem ullam rem delectus libero perferendis consequatur porro. Laborum architecto rem occaecati voluptas dolorem. Inventore sunt placeat eligendi. Omnis corrupti molestias et ut voluptas aut.', 9, 8, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(2, 'Sunt Quod', 'sunt-quod', 'Lainnya', 'Quos pariatur quia excepturi. Necessitatibus nam labore odio pariatur. Pariatur maiores ullam ut nisi delectus aut. Natus ratione quasi quod quibusdam rerum consequuntur. Exercitationem aliquam repellat ratione quia.', 6, 2, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(3, 'Magni Quae', 'magni-quae', 'Lainnya', 'Nisi reprehenderit deleniti fugit odio vel odit eos. Id ut voluptas animi harum veritatis. Nulla dolorem itaque vero minus autem. Unde natus tempore quibusdam dolorem quidem omnis quaerat quaerat. Omnis vitae aut perspiciatis inventore.', 3, 9, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(4, 'Error Quia', 'error-quia', 'Membership', 'Consequatur similique unde quod sit animi quaerat. Magnam harum aspernatur est et odit quibusdam sunt. Laudantium vel ea est atque voluptates. Velit dolor molestiae aperiam voluptas est incidunt.', 6, 1, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(5, 'Optio Amet', 'optio-amet', 'Lainnya', 'Consectetur voluptatem magnam unde esse. Unde rerum molestiae laudantium ratione. Architecto rem est amet debitis velit. Voluptatem iure rerum aspernatur eos.', 3, 3, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(6, 'Aut Aut', 'aut-aut', 'Membership', 'Assumenda aliquam aliquam numquam sit porro autem velit. Consequatur voluptates necessitatibus nisi deserunt. Unde corporis id beatae perferendis dicta tenetur vero. Illum rerum voluptas voluptatem delectus assumenda consequatur voluptatibus. Consequatur harum et sed. Cupiditate aut ea quos cumque harum qui iure. Voluptas distinctio vel et veniam sunt aut.', 9, 4, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(7, 'Aut Iusto', 'aut-iusto', 'Membership', 'Possimus ad occaecati fugiat dolor quisquam. Eos aliquam libero quia repellendus minima ipsam. Qui praesentium minima similique explicabo animi possimus aliquid. Nulla eum et earum. Atque itaque magni at ut natus.', 7, 1, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(8, 'Non Et', 'non-et', 'Membership', 'Libero doloremque est sunt corporis qui repellendus. Inventore voluptatibus omnis culpa et. Illo voluptatibus dicta perspiciatis ad voluptatem iure. Corrupti ut quo quia numquam quisquam eum. Voluptatem voluptatem magni distinctio hic et qui.', 1, 4, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(9, 'Molestiae Architecto', 'molestiae-architecto', 'Lainnya', 'Eveniet facere officia ut fuga. Ea porro non est et est. Sequi nulla non placeat aut qui. Et voluptas voluptatem eum consequatur eum quidem hic. Fuga aut nostrum ab quo fugiat. Maiores est asperiores cum aliquid.', 10, 4, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(10, 'Eum Assumenda', 'eum-assumenda', 'Membership', 'Ex aspernatur eius tenetur quia accusamus nisi voluptas. Doloribus a consequatur consequatur doloremque hic minus. Exercitationem molestiae porro quaerat blanditiis sed recusandae. Ab quasi delectus sequi quia tenetur architecto neque expedita.', 2, 7, NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL),
	(11, 'Member 1 Tahun', 'member-1-tahun', 'Membership', 'Membership 1 tahun include card', 200, 4000000, '["listings\\/01JXM0ECFF72X45Z83081ZXWWJ.png"]', '2025-06-13 06:43:11', '2025-06-13 06:43:11', NULL);

-- Dumping structure for table herfit.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.migrations: ~12 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2025_03_15_043843_create_listings_table', 1),
	(5, '2025_03_20_011428_create_transactions_table', 1),
	(6, '2025_03_20_103318_create_personal_access_tokens_table', 1),
	(10, '2025_04_18_143847_add_qr_code_to_transactions', 2),
	(11, '2025_04_18_150128_create_transaction_scans_table', 2),
	(12, '2025_05_31_151948_create_workout_templates_table', 2),
	(13, '2025_05_31_175739_add_user_id_to_workout_templates_table', 2),
	(15, '2025_05_31_184131_food_consumed_table', 3),
	(16, '2025_06_01_111409_create_fitness_posts_table', 4),
	(17, '2025_06_01_112218_create_fitness_comments_table', 5),
	(18, '2025_06_01_112540_create_fitness_likes_table', 6);

-- Dumping structure for table herfit.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(50) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(30) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.personal_access_tokens: ~38 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 9, 'auth', 'ed6bbded9c4cabac20ef376a97ae7435cd0bc438f62abd7b910d50c3becf4ef0', '["*"]', '2025-04-16 10:49:41', NULL, '2025-04-16 10:37:20', '2025-04-16 10:49:41'),
	(2, 'App\\Models\\User', 1, 'auth', 'c4e75e064977b84245187e390105cf7d21acfcba09ebdb3791a10f1c2537ef06', '["*"]', '2025-05-31 08:46:34', NULL, '2025-05-31 08:17:02', '2025-05-31 08:46:34'),
	(3, 'App\\Models\\User', 1, 'auth', 'e224d71290d8fd2e3e2b76d26d7b3cbb74e1370ec27e84a0b9385d0bfdeab7b4', '["*"]', '2025-05-31 10:41:50', NULL, '2025-05-31 08:27:48', '2025-05-31 10:41:50'),
	(4, 'App\\Models\\User', 1, 'auth', '86fa5584a41e697433b34a7903fba56a92a90ce60346aba470e217a35be03718', '["*"]', NULL, NULL, '2025-05-31 08:58:11', '2025-05-31 08:58:11'),
	(5, 'App\\Models\\User', 1, 'auth', '40adee6118466f8ca54ad1c288cf9d295874d779eb828d108d496495767bd647', '["*"]', NULL, NULL, '2025-05-31 09:19:50', '2025-05-31 09:19:50'),
	(6, 'App\\Models\\User', 1, 'auth', 'a409dd6a58aa423c6aaf9c685a847991c850fe8e2dacb5beab7d6f62237d5799', '["*"]', NULL, NULL, '2025-05-31 09:20:12', '2025-05-31 09:20:12'),
	(7, 'App\\Models\\User', 1, 'auth', '4f7a7d0e80e5f18e59bf9266200bffa24c88884c02768336502e2683604078a9', '["*"]', NULL, NULL, '2025-05-31 09:24:29', '2025-05-31 09:24:29'),
	(8, 'App\\Models\\User', 1, 'auth', 'd0fea80064c9c8baee94e79db888fe3aa5c387f50334f480651eb76bbd761d86', '["*"]', NULL, NULL, '2025-05-31 09:25:24', '2025-05-31 09:25:24'),
	(9, 'App\\Models\\User', 1, 'auth', 'b8a44139ad2ecf3947fe31b76fa8d63b96dedacbae24aa91d91f469f82a94996', '["*"]', '2025-05-31 09:37:36', NULL, '2025-05-31 09:37:00', '2025-05-31 09:37:36'),
	(10, 'App\\Models\\User', 1, 'auth', 'ea70724f7c7f6b9fd6f750036767882b0cf9de24a1c6b455e5be9671376b9ee9', '["*"]', NULL, NULL, '2025-05-31 10:04:13', '2025-05-31 10:04:13'),
	(11, 'App\\Models\\User', 1, 'auth', '6b97cd8bdec54e2d51971b6aa2ccabf92d7b3dcf5c1ba2e7ec862f4989665194', '["*"]', NULL, NULL, '2025-05-31 10:13:39', '2025-05-31 10:13:39'),
	(12, 'App\\Models\\User', 1, 'auth', 'cd399e22b7895f2b8eb34c27a6d9cd6b4b72e1ec91297c3d5b410767da9be197', '["*"]', NULL, NULL, '2025-05-31 10:14:58', '2025-05-31 10:14:58'),
	(13, 'App\\Models\\User', 1, 'auth', 'ebb2f4a294f905d1213b3e1641790c57519d86b591706c731902feb675595a97', '["*"]', NULL, NULL, '2025-05-31 10:15:11', '2025-05-31 10:15:11'),
	(14, 'App\\Models\\User', 1, 'auth', '6061fa26d6a31f5d67436e18586841cc0940e7ebf4a0f26d67b733e5208f320d', '["*"]', NULL, NULL, '2025-05-31 10:18:49', '2025-05-31 10:18:49'),
	(15, 'App\\Models\\User', 1, 'auth', 'b76fd3800be9f28bf36aa6bd695312baa2e4666e42c8d0169a8e8fe60b9fb972', '["*"]', NULL, NULL, '2025-05-31 10:20:40', '2025-05-31 10:20:40'),
	(16, 'App\\Models\\User', 1, 'auth', 'a38b97f42bc5313d1f30414cd893b6a7fc6e4d6310ac752890dd4c7cae778231', '["*"]', NULL, NULL, '2025-05-31 10:22:40', '2025-05-31 10:22:40'),
	(17, 'App\\Models\\User', 1, 'auth', '83b48917f0d9a19e4f8da533b92f01e16ce736a16b973dcba6903b5c7cac2169', '["*"]', '2025-05-31 10:31:35', NULL, '2025-05-31 10:23:54', '2025-05-31 10:31:35'),
	(18, 'App\\Models\\User', 1, 'auth', '4045d30a18513aaf6a1cae7f11f7f0e9b5f16b56f5857abfbe121ca9a25c361e', '["*"]', '2025-05-31 11:08:17', NULL, '2025-05-31 10:46:26', '2025-05-31 11:08:17'),
	(19, 'App\\Models\\User', 2, 'auth', '71a6f08d9f114da274c87f1c8e873004b57e9345698e97f494a69bb62c151d4e', '["*"]', '2025-05-31 11:12:09', NULL, '2025-05-31 11:08:37', '2025-05-31 11:12:09'),
	(20, 'App\\Models\\User', 1, 'auth', '7f753a88599d29d995de272986c6ecb660d7d6174ba39a04572ea80ef9488f5a', '["*"]', '2025-06-01 05:52:37', NULL, '2025-05-31 11:26:08', '2025-06-01 05:52:37'),
	(21, 'App\\Models\\User', 22, 'auth', '36cad79482337215b43b05256b71aad4dc28ebfdeaa2324e6040db5d5b79df9f', '["*"]', '2025-06-01 13:40:39', NULL, '2025-06-01 13:39:32', '2025-06-01 13:40:39'),
	(22, 'App\\Models\\User', 22, 'auth', 'e439754762582b0f7ce859f323c7f4df8a3b3b675e501b90074b7b37a427feaa', '["*"]', '2025-06-01 14:19:57', NULL, '2025-06-01 13:40:45', '2025-06-01 14:19:57'),
	(23, 'App\\Models\\User', 1, 'auth', 'a0ae6e5a92a97dccb0d4133daab69852eab781e9605ff61c20d46affeebd2425', '["*"]', '2025-06-13 09:09:13', NULL, '2025-06-11 00:51:22', '2025-06-13 09:09:13'),
	(24, 'App\\Models\\User', 23, 'auth', 'efeefef7bcdd297d05778c2c6f9a08d7390cd8c33e08f68a1e3ca110a7cf5ae3', '["*"]', '2025-06-13 07:02:58', NULL, '2025-06-13 06:44:38', '2025-06-13 07:02:58'),
	(25, 'App\\Models\\User', 24, 'auth', '0122cfc49959b93f543f4827959ef0ae9650afedcfcc7546920ca79b4c883702', '["*"]', '2025-06-13 07:04:55', NULL, '2025-06-13 07:03:37', '2025-06-13 07:04:55'),
	(26, 'App\\Models\\User', 26, 'auth', '333a8482ca0ba8def1d663954762f32c06f012e9dfa4b6842d5f746b8d7250fe', '["*"]', '2025-06-13 07:37:34', NULL, '2025-06-13 07:12:58', '2025-06-13 07:37:34'),
	(27, 'App\\Models\\User', 27, 'auth', '080376c9b82b17f279a4fabc99becf93285bdf5c8f89b8ece509f97d15df8701', '["*"]', '2025-06-13 09:08:24', NULL, '2025-06-13 09:08:00', '2025-06-13 09:08:24'),
	(28, 'App\\Models\\User', 24, 'auth', 'f1ec67d6618f52a8f6942b4fa4773f6a4e595fa9bbe89019d25c4a9099579c8a', '["*"]', '2025-06-21 02:10:13', NULL, '2025-06-20 07:05:44', '2025-06-21 02:10:13'),
	(29, 'App\\Models\\User', 24, 'auth', '0a8d542626e3c64bd364ccaf9fa558dfe49ebde80c821c48cdcbbe2a8324f0e2', '["*"]', '2025-06-21 04:58:36', NULL, '2025-06-21 02:10:56', '2025-06-21 04:58:36'),
	(30, 'App\\Models\\User', 24, 'auth', '66b3819556300903a41b33e966583db7be9e0553f569801394dcfc07232924cf', '["*"]', NULL, NULL, '2025-06-21 04:59:03', '2025-06-21 04:59:03'),
	(31, 'App\\Models\\User', 24, 'auth', '89ac7fd344d43d84587d63b4c2b841189aafac0511f97ec19d44281cf7784ce9', '["*"]', NULL, NULL, '2025-06-21 04:59:51', '2025-06-21 04:59:51'),
	(32, 'App\\Models\\User', 24, 'auth', '86760dec32b1202d4c6998eecd1dec4885ff590b7dbaf72ffb9e318893823164', '["*"]', NULL, NULL, '2025-06-21 05:01:37', '2025-06-21 05:01:37'),
	(33, 'App\\Models\\User', 24, 'auth', 'fd52dc4a0fdd06703886fde47429f0ff8222ba3f3e29f9822dc86bae47824846', '["*"]', NULL, NULL, '2025-06-21 05:02:19', '2025-06-21 05:02:19'),
	(34, 'App\\Models\\User', 24, 'auth', '9dedd9886263247d38c9909272bff0af7863e9d886b8f6225f2eca1b172f124c', '["*"]', NULL, NULL, '2025-06-21 05:04:45', '2025-06-21 05:04:45'),
	(35, 'App\\Models\\User', 24, 'auth', '18b86640d821c5509120b4d466bf833eaaf7a8ca50e124812bba4fcc86bf62bf', '["*"]', '2025-06-21 05:05:39', NULL, '2025-06-21 05:05:08', '2025-06-21 05:05:39'),
	(36, 'App\\Models\\User', 24, 'auth', '6f80e14d7cfed201e5ff1823037b90ce195a9f6194d304d2510e41524e39b3ba', '["*"]', '2025-06-21 08:46:54', NULL, '2025-06-21 05:08:44', '2025-06-21 08:46:54'),
	(37, 'App\\Models\\User', 24, 'auth', '4c329fa12bce9ce5add28b8bfbec8ee06d5babe06e1f04c7128bd2f423912fae', '["*"]', '2025-06-23 12:58:49', NULL, '2025-06-23 12:41:23', '2025-06-23 12:58:49'),
	(38, 'App\\Models\\User', 24, 'auth', 'b7229b93c4a686b3e71707383833506f8489cbb3688f9d4380f7af0493074627', '["*"]', '2025-06-24 00:33:07', NULL, '2025-06-23 23:56:14', '2025-06-24 00:33:07');

-- Dumping structure for table herfit.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `listing_id` int(10) unsigned NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_days` int(10) unsigned NOT NULL DEFAULT 0,
  `price` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('waiting','approved','rejected') NOT NULL DEFAULT 'waiting',
  `bukti_bayar` varchar(255) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_listing_id_foreign` (`listing_id`),
  KEY `transactions_user_id_foreign` (`user_id`),
  CONSTRAINT `transactions_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.transactions: ~20 rows (approximately)
INSERT INTO `transactions` (`id`, `user_id`, `listing_id`, `start_date`, `end_date`, `total_days`, `price`, `status`, `bukti_bayar`, `qr_code_path`, `created_at`, `updated_at`) VALUES
	(1, 13, 9, NULL, NULL, 0, 0, 'approved', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(2, 20, 1, NULL, NULL, 0, 0, 'waiting', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(3, 18, 1, NULL, NULL, 0, 0, 'waiting', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(4, 20, 10, NULL, NULL, 0, 0, 'waiting', '', NULL, '2025-04-06 13:25:20', '2025-06-13 06:41:13'),
	(5, 20, 2, NULL, NULL, 0, 0, 'approved', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(6, 20, 7, NULL, NULL, 0, 0, 'waiting', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(7, 20, 7, NULL, NULL, 0, 0, 'waiting', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(8, 18, 5, NULL, NULL, 0, 0, 'approved', '', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20'),
	(9, 16, 1, NULL, NULL, 0, 0, 'rejected', '', NULL, '2025-04-06 13:25:20', '2025-06-21 02:29:46'),
	(10, 12, 7, NULL, NULL, 0, 0, 'approved', '', NULL, '2025-04-06 13:25:20', '2025-06-13 06:34:21'),
	(11, 9, 1, '2025-04-01', '2025-05-01', 31, 0, 'waiting', '', NULL, '2025-04-16 10:46:13', '2025-04-16 10:46:13'),
	(12, 26, 11, '2025-06-01', '2025-06-30', 30, 0, 'approved', '', 'qr_codes/transaction_12_BFgTcH.png', '2025-06-13 07:21:24', '2025-06-13 07:23:42'),
	(13, 24, 11, '2025-06-01', '2025-06-30', 30, 0, 'approved', '', 'qr_codes/transaction_13_0lyU94.png', '2025-06-20 07:16:59', '2025-06-21 02:37:31'),
	(14, 24, 11, '2025-06-01', '2025-06-30', 30, 0, 'waiting', NULL, NULL, '2025-06-21 02:48:57', '2025-06-21 02:48:57'),
	(15, 24, 11, '2025-06-01', '2025-06-30', 30, 0, 'rejected', NULL, 'qr_codes/transaction_15_S5MLVE.png', '2025-06-21 02:49:39', '2025-06-21 02:49:41'),
	(16, 24, 11, '2025-06-01', '2025-06-21', 21, 0, 'waiting', NULL, 'qr_codes/transaction_16_mZLhjf.png', '2025-06-21 05:26:36', '2025-06-21 05:26:36'),
	(17, 24, 11, '2025-06-23', '2025-06-30', 7, 0, 'approved', 'bukti-bayar/KrSiCclpntizJ8ayLhnv0U4XcSg7dGo6FUZjEZQM.jpg', 'qr_codes/transaction_17_HfHew8.png', '2025-06-21 05:28:53', '2025-06-21 06:25:09'),
	(18, 24, 11, '2025-06-01', '2025-06-15', 15, 0, 'approved', 'bukti-bayar/tURp9GOX8ZfDZ0OTB07SvFrVL6d6CH51KUlCOOlB.jpg', 'qr_codes/transaction_18_LJryDU.png', '2025-06-21 06:34:33', '2025-06-21 06:35:01'),
	(19, 24, 11, '2025-07-01', '2025-07-31', 31, 0, 'approved', 'bukti-bayar/YiV3kc5botEjTmzxI6jToznY2l5yR10jVZIlJvQk.jpg', 'qr_codes/transaction_19_2IruXz.png', '2025-06-21 06:37:07', '2025-06-21 06:38:37'),
	(20, 24, 1, '2025-07-01', '2025-07-31', 31, 0, 'approved', 'bukti-bayar/IyfwXemdDvxjFBl6b8R113Rga4rEKf7ALwQY4lzl.jpg', 'qr_codes/transaction_20_9V0Vee.png', '2025-06-21 08:46:04', '2025-06-21 08:46:50');

-- Dumping structure for table herfit.transaction_scans
CREATE TABLE IF NOT EXISTS `transaction_scans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` int(10) unsigned NOT NULL,
  `scanned_by` int(10) unsigned NOT NULL,
  `scanned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `transaction_scans_transaction_id_foreign` (`transaction_id`),
  KEY `transaction_scans_scanned_by_foreign` (`scanned_by`),
  CONSTRAINT `transaction_scans_scanned_by_foreign` FOREIGN KEY (`scanned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `transaction_scans_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.transaction_scans: ~25 rows (approximately)
INSERT INTO `transaction_scans` (`id`, `transaction_id`, `scanned_by`, `scanned_at`) VALUES
	(1, 12, 11, '2025-06-13 07:24:35'),
	(2, 12, 11, '2025-06-13 07:24:59'),
	(3, 17, 11, '2025-06-21 06:32:12'),
	(4, 17, 11, '2025-06-21 06:33:14'),
	(5, 17, 11, '2025-06-21 06:33:41'),
	(6, 19, 11, '2025-06-21 06:38:55'),
	(7, 19, 11, '2025-06-21 06:46:17'),
	(8, 19, 11, '2025-06-21 06:47:14'),
	(9, 19, 11, '2025-06-21 07:12:25'),
	(10, 19, 11, '2025-06-21 07:13:50'),
	(11, 19, 11, '2025-06-21 07:18:56'),
	(12, 19, 11, '2025-06-21 07:20:41'),
	(13, 19, 11, '2025-06-21 07:39:10'),
	(14, 19, 11, '2025-06-21 07:49:11'),
	(15, 19, 11, '2025-06-21 07:53:32'),
	(16, 17, 11, '2025-06-21 07:55:45'),
	(17, 19, 11, '2025-06-21 08:06:56'),
	(18, 19, 11, '2025-06-21 08:08:40'),
	(19, 19, 11, '2025-06-21 08:11:00'),
	(20, 19, 11, '2025-06-21 08:26:11'),
	(21, 19, 11, '2025-06-21 08:27:46'),
	(22, 20, 11, '2025-06-21 08:47:11'),
	(23, 20, 11, '2025-06-21 08:48:31'),
	(24, 20, 11, '2025-06-21 08:51:42'),
	(25, 20, 11, '2025-06-21 08:52:07');

-- Dumping structure for table herfit.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `email` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `no_identitas` varchar(20) DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `photo_profile` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(50) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.users: ~27 rows (approximately)
INSERT INTO `users` (`id`, `role`, `email`, `name`, `no_identitas`, `no_telp`, `password`, `photo_profile`, `created_at`, `updated_at`, `remember_token`, `email_verified_at`) VALUES
	(1, 'customer', 'yjacobi@example.com', 'Amalia Gusikowski', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(2, 'customer', 'buster.strosin@example.com', 'Mr. Hyman Daniel', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(3, 'customer', 'jast.hailee@example.net', 'Ruth Hettinger', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(4, 'customer', 'ignacio53@example.net', 'Bennie Cummerata', '8273823', '0888', '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-06-20 05:57:12', NULL, NULL),
	(5, 'customer', 'stokes.tyra@example.com', 'Mrs. Antonietta Schowalter', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(6, 'customer', 'muller.ruthie@example.com', 'May Doyle', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(7, 'customer', 'astamm@example.net', 'Elda Tromp', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(8, 'customer', 'ashley89@example.org', 'Shayna Bode', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(9, 'customer', 'tkutch@example.com', 'Erwin Stanton', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(10, 'customer', 'helmer.cormier@example.org', 'Gerda Gusikowski', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(11, 'admin', 'lussyanast@gmail.com', 'Admin Lussy', NULL, NULL, '$2y$12$vmsM0aYhiJ/2FXoA/.042Opu9EOFH6BO2Sw2jdEdOOPYRzKlZ.tD6', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(12, 'customer', 'pjenkins@example.com', 'Ms. Era Feeney Jr.', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(13, 'customer', 'qgutkowski@example.com', 'Isai Heller', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(14, 'customer', 'fay04@example.org', 'Jeff Pfeffer PhD', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(15, 'customer', 'windler.alfonzo@example.net', 'Dr. Dean Eichmann DVM', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(16, 'customer', 'awilliamson@example.net', 'Thurman Kling I', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(17, 'customer', 'dean.kreiger@example.net', 'Prof. Wilfrid Lind PhD', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(18, 'customer', 'wyman.trudie@example.com', 'Cleta Kub', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(19, 'customer', 'mabel97@example.org', 'Prof. Denis Schulist I', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(20, 'customer', 'khalid97@example.net', 'Dr. Furman Runolfsson IV', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(21, 'customer', 'aiden62@example.com', 'Jeffry Howell', NULL, NULL, '$2y$12$N704guQ9k056WIixNuALmOjo4CAX03Wmma.z5YoiISv1Orer3QYhS', NULL, '2025-04-06 13:25:20', '2025-04-06 13:25:20', NULL, NULL),
	(22, 'customer', 'enengk247@gmail.com', 'Eneng Komalasari', NULL, NULL, '$2y$12$FvPzyfRuoAkaT6qAoVBSq.VDOSnGUFsCrU8dESP8Sic/eTpcfy2tS', NULL, '2025-06-01 13:39:31', '2025-06-01 13:39:31', NULL, NULL),
	(23, 'customer', 'lightpewter@gmail.com', 'Lussy Triana', '1234567890123456', '085772492505', '$2y$12$vqoCr/wEloV1LDiSOMbTCeGW7vHu5czB.PE2E/qXruzoPm03dvq9C', NULL, '2025-06-13 06:44:37', '2025-06-13 06:50:50', NULL, NULL),
	(24, 'customer', 'athaa@gmail.com', 'Athallah', '9876578902387645', '085772492502', '$2y$12$Rj5VWf.yoxhzOloZczHxSevfDQYzCYUSkVUfBRti12NeGK74GgD5O', 'profile/A3Geb8Nh3keJcrbaPgu6lgtI6aknDZJOpnJovc6w.jpg', '2025-06-13 07:03:37', '2025-06-20 08:14:13', NULL, NULL),
	(25, 'customer', 'annedwi@gmail.com', 'Anne Dwi Aryani', '1876437895234567', '085772492505', '$2y$12$mbhshZeTCE5iLUATZOxj0e0iNaDEKbRhFONOSuUrKV/wZBmKX/HHO', NULL, '2025-06-13 07:08:52', '2025-06-13 07:08:52', NULL, NULL),
	(26, 'customer', 'lilyaan@gmail.com', 'Lilyaanaa', '4534567834567345', '085772492505', '$2y$12$NYv6Dg.5pwwg.u/gjKQTM./TbcWYu1aoYaJQJJQ6NXotgRRCkr9GG', NULL, '2025-06-13 07:12:58', '2025-06-13 07:14:05', NULL, NULL),
	(27, 'customer', 'atharriz@gmail.com', 'Atharriz', '3678909876789346', '123456784567', '$2y$12$rTRYNKvV/cpIvsLGlMidnuHuD/v1e5fPKf/9wIAbN/RuQLiky09ta', NULL, '2025-06-13 09:08:00', '2025-06-13 09:08:00', NULL, NULL);

-- Dumping structure for table herfit.workout_templates
CREATE TABLE IF NOT EXISTS `workout_templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `template_name` varchar(150) NOT NULL,
  `type` enum('harian','mingguan') NOT NULL,
  `days` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`days`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workout_templates_user_id_foreign` (`user_id`),
  CONSTRAINT `workout_templates_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Dumping data for table herfit.workout_templates: ~2 rows (approximately)
INSERT INTO `workout_templates` (`id`, `user_id`, `template_name`, `type`, `days`, `created_at`, `updated_at`) VALUES
	(1, 1, 'ss', 'harian', '[{"day":"Senin","workouts":[{"name":"d","reps":"2"}]}]', '2025-05-31 11:07:52', '2025-05-31 11:07:52'),
	(2, 1, 's', 'mingguan', '[{"day":"Senin","workouts":[{"name":"dd","reps":"222"},{"name":"333","reps":"44"},{"name":"2","reps":"3"}]},{"day":"Selasa","workouts":[{"name":"dsd","reps":"2"}]}]', '2025-05-31 11:08:17', '2025-05-31 11:08:17'),
	(3, 24, 'Lower', 'harian', '[{"day":"Senin","workouts":[{"name":"Back","reps":"2"},{"name":"Test","reps":"3"}]}]', '2025-06-23 12:43:06', '2025-06-23 12:43:06');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
