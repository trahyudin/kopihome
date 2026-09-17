-- ============================================================
-- KOPIWEB FULLSTACK DATABASE SCHEMA & SEED DATA
-- Kompatibel dengan MySQL 5.7+ / MySQL 8.x / MariaDB 10.x
-- Siap diimpor langsung via phpMyAdmin di cPanel
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. Tabel: settings
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key` varchar(64) NOT NULL,
  `value` text NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`key`, `value`) VALUES
('wa_number', '6281234567890'),
('wa_msg_id', 'Halo KopiWeb! Saya ingin konsultasi gratis tentang pembuatan website untuk coffee shop saya.'),
('wa_msg_en', 'Hi KopiWeb! I would like a free consultation about building a website for my coffee shop.'),
('contact_email', 'hello@optibis.id'),
('contact_instagram', 'optibis.id'),
('site_title', 'KopiWeb — Spesialis Website Coffee Shop');

-- ------------------------------------------------------------
-- 2. Tabel: users (Admin authentication)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Akun Default: Username 'admin', Password 'admin123'
INSERT INTO `users` (`username`, `password`, `email`) VALUES
('admin', '$2y$12$M1qdl/V1IkQprWimni5WPuP0f24C8u4cz4posbJxKDgnJ9lkX7Wtu', 'admin@kopiweb.id');

-- ------------------------------------------------------------
-- 3. Tabel: inquiries (Leads konsultasi & pesanan prospek)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `coffee_shop` varchar(128) DEFAULT NULL,
  `whatsapp` varchar(32) NOT NULL,
  `package` varchar(64) DEFAULT 'Visibility Landing Page',
  `template_interest` varchar(128) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('baru','dihubungi','deal','batal') DEFAULT 'baru',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Initial Inquiries
INSERT INTO `inquiries` (`name`, `coffee_shop`, `whatsapp`, `package`, `template_interest`, `notes`, `status`) VALUES
('Budi Santoso', 'Kopi Senja Utama', '081234567891', 'Visibility Landing Page', 'Kape RPG', 'Ingin buat landing page cepat untuk promo grand opening.', 'dihubungi'),
('Rina Wijaya', 'Artisan Brew Bar', '081987654321', 'Business Company Website', 'KRØMA Coffee Roasters', 'Butuh showcase menu single origin dan lokasi peta.', 'baru');

-- ------------------------------------------------------------
-- 4. Tabel: templates (45 Katalog Template Showcase)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_id` varchar(128) NOT NULL,
  `name_en` varchar(128) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `shot` varchar(255) DEFAULT NULL,
  `tags` text NOT NULL,
  `desc_id` text NOT NULL,
  `desc_en` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `clicks` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kape RPG', 'Kape RPG', 'https://perchance.org/kape-rpg#/', 'https://user.uploads.dev/file/bc068409fdb96cfd83e4486cc31f9d4d.jpg', '["RPG", "Game", "Kreatif"]', 'Website kopi bergaya RPG/interaktif.', 'RPG-style interactive coffee website.', 0);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Djawa Kape', 'Djawa Kape', 'https://perchance.org/djawa-kape#/home', 'https://user.uploads.dev/file/595b02e8166438b19bfcec388f0a430e.jpg', '["Company Profile", "Jawa", "Tradisional"]', 'Profil coffee shop bernuansa Jawa.', 'Javanese-themed coffee shop profile.', 1);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Neon Kape', 'Neon Kape', 'https://perchance.org/neon-kape#/', 'https://user.uploads.dev/file/b2a4cdae318da236dbcec0ca521c6051.jpg', '["Neon", "Modern", "Nightlife"]', 'Tampilan neon energik untuk coffee shop.', 'Energetic neon look for a coffee shop.', 2);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Pixel Cafe', 'Pixel Cafe', 'https://perchance.org/pixel-cafe#/', 'https://user.uploads.dev/file/b365c8d19a9f4d67aaa8465427da52f2.jpg', '["Pixel Art", "Retro", "Unik"]', 'Gaya pixel art yang playful dan retro.', 'Playful retro pixel-art style.', 3);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Nusantara Kape', 'Nusantara Kape', 'https://perchance.org/nusantara-kape#/', 'https://user.uploads.dev/file/ebe5d03ebde6f3a4ae0c564daf18879e.jpg', '["Nusantara", "Branding"]', 'Identitas Nusantara di tiap halaman.', 'Nusantara identity on every page.', 4);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Luma Kape', 'Luma Kape', 'https://perchance.org/luma-kape#/home', 'https://user.uploads.dev/file/4fbf9df0e363dbea412ecc1641a323de.jpg', '["Cerah", "Minimalis"]', 'Desain cerah dan bersih, fokus ke menu.', 'Bright, clean design focused on the menu.', 5);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kuro Kape', 'Kuro Kape', 'https://perchance.org/kuro-kape#/', 'https://user.uploads.dev/file/518c7e22a4ed81175d093cd8cf9c392c.jpg', '["Dark", "Minimalis", "Elegant"]', 'Tema gelap elegan untuk brand premium.', 'Elegant dark theme for a premium brand.', 6);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Roastry Kape', 'Roastry Kape', 'https://perchance.org/roastry-kape#/', 'https://user.uploads.dev/file/729eee7e6054be454164e8bf68d41551.jpg', '["Roastery", "Company Profile"]', 'Website untuk roastery dan kafe.', 'Website for a roastery and cafe.', 7);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Mareblu Kape', 'Mareblu Kape', 'https://perchance.org/mareblu-kape#/', 'https://user.uploads.dev/file/21038faedddd625d5d38bcb4f4b2b419.jpg', '["Pantai", "Segar", "Santai"]', 'Nuansa pesisir yang segar dan santai.', 'Fresh, relaxed coastal vibes.', 8);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Noir Kape', 'Noir Kape', 'https://perchance.org/noir-kape#/story', 'https://user.uploads.dev/file/544e2f98ac2faf835980dd484b348b51.jpg', '["Dark", "Story", "Cinematic"]', 'Tema noir sinematik untuk brand unik.', 'Cinematic noir theme for a unique brand.', 9);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Pure Brew Co.', 'Pure Brew Co.', 'https://pure-brew-co.vercel.app/', NULL, '["Premium", "Company Profile"]', 'Kesan premium untuk specialty coffee.', 'Premium look for specialty coffee.', 10);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aroma Co.', 'Aroma Co.', 'https://aroma-co-nine.vercel.app/', NULL, '["Modern", "Warm"]', 'Modern dan hangat, menonjolkan aroma.', 'Warm modern design highlighting aroma.', 11);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Terracotta ID', 'Terracotta ID', 'https://terracotta-id.vercel.app/', NULL, '["Terracotta", "Warm", "Warna Tanah"]', 'Palet terracotta yang hangat dan natural.', 'Warm, natural terracotta palette.', 12);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Brew Pilot', 'Brew Pilot', 'https://brew-pilot.vercel.app/', NULL, '["Brewing", "Guide"]', 'Situs panduan & menu bernuansa pilot.', 'Brewing guide & menu with a pilot twist.', 13);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Slowpour', 'Slowpour', 'https://fadhlurr01.github.io/Slowpour/', NULL, '["Slow Bar", "Minimalis"]', 'Slow bar minimalis, fokus pada ritual seduh.', 'Minimalist slow bar focused on the brewing ritual.', 14);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Maison Seruni', 'Maison Seruni', 'https://fadhlurr01.github.io/Maison-Seruni/', NULL, '["Elegant", "Homey"]', 'Elegant dan hangat seperti rumah.', 'Elegant and as warm as home.', 15);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Ambara Coffee', 'Ambara Coffee', 'https://perchance.org/ambara-coffe#/', 'https://user.uploads.dev/file/202ceb6b4e1f64cc73a54741bab73cf7.jpg', '["Company Profile"]', 'Profil coffee shop yang profesional.', 'A professional coffee shop profile.', 16);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kopi Arsa', 'Kopi Arsa', 'https://perchance.org/kopi-arsa#/home', 'https://user.uploads.dev/file/3e171c3bbe85b27fc8648a274613d60f.jpg', '["Nusantara", "Branding"]', 'Branding kopi lokal yang berkarakter.', 'Characterful local coffee branding.', 17);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kopi Kenangan', 'Kopi Kenangan', 'https://perchance.org/kopi-kenangan#/', 'https://user.uploads.dev/file/b802b30a5623c9331b5a3854dd9403ea.jpg', '["Branding", "Story"]', 'Cerita brand dengan sentuhan nostalgia.', 'Brand story with a nostalgic touch.', 18);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Larik', 'Larik', 'https://perchance.org/larik#/', 'https://user.uploads.dev/file/881eda5b2b226c39c32f6872fcae6a12.jpg', '["Minimalis", "Typography"]', 'Tipografi berani dengan layout bersih.', 'Bold typography with a clean layout.', 19);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 1', 'Coffee Shop Template 1', 'https://tugas-template-coffee-shop.vercel.app/', NULL, '["Landing Page"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 20);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 2', 'Coffee Shop Template 2', 'https://tugas-template-coffee-shop-5lgq.vercel.app/', NULL, '["Company Profile"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 21);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 3', 'Coffee Shop Template 3', 'https://tugas-template-coffee-shop-rfa2.vercel.app/', NULL, '["Menu Digital"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 22);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 4', 'Coffee Shop Template 4', 'https://tugas-template-coffee-shop-wlca.vercel.app/', NULL, '["Promo"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 23);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 5', 'Coffee Shop Template 5', 'https://tugas-template-coffee-shop-6luf.vercel.app/', NULL, '["Event"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 24);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 6', 'Coffee Shop Template 6', 'https://tugas-template-coffee-shop-ekwj.vercel.app/', NULL, '["Branding"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 25);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 7', 'Coffee Shop Template 7', 'https://tugas-template-coffee-shop-jwvg.vercel.app/', NULL, '["Order Online"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 26);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 8', 'Coffee Shop Template 8', 'https://tugas-template-coffee-shop-lqcd.vercel.app/', NULL, '["Gallery"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 27);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 9', 'Coffee Shop Template 9', 'https://tugas-template-coffee-shop-4fig.vercel.app/', NULL, '["Seasonal"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 28);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Coffee Shop Template 10', 'Coffee Shop Template 10', 'https://tugas-template-coffee-shop-kqpu.vercel.app/', NULL, '["Custom"]', 'Template website coffee shop siap pakai.', 'Ready-to-use coffee shop website template.', 29);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('NØRVA Coffee', 'NØRVA Coffee', 'https://norva-coffe.vercel.app/', NULL, '["Premium", "Editorial", "Specialty"]', 'Quiet luxury untuk specialty coffee, nuansa tenang dan mewah.', 'Quiet-luxury take on specialty coffee — calm and refined.', 30);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('KRØMA Coffee Roasters', 'KRØMA Coffee Roasters', 'https://kroma-xt8r.vercel.app/', NULL, '["Roastery", "Modern", "Single Origin"]', 'Roastery modern yang presisi, fokus single-origin.', 'Precision modern roastery focused on single-origin.', 31);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aether Coffee Lab', 'Aether Coffee Lab', 'https://cofffu.vercel.app/', NULL, '["Dark", "Futuristik", "Roastery"]', 'Sensory roastery avant-garde bergaya gelap futuristik.', 'Avant-garde sensory roastery in a futuristic dark style.', 32);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aethel', 'Aethel', 'https://authall.vercel.app/', NULL, '["Luxury", "Dark", "Gold"]', 'Atelier kopi mewah dengan aksen emas celestial.', 'Luxury coffee atelier with celestial gold accents.', 33);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aether Coffee Architecture', 'Aether Coffee Architecture', 'https://kofai.vercel.app/', NULL, '["Architecture", "Dark", "Eksperimental"]', 'Arsitektur kopi eksperimental dengan nuansa gelap.', 'Experimental coffee architecture in a dark palette.', 34);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kairos Coffee', 'Kairos Coffee', 'https://cofffx1.vercel.app/', NULL, '["Luxury", "Dark", "Rare Origin"]', 'Dark luxury dengan kesan rare origin yang eksklusif.', 'Dark luxury look with an exclusive rare-origin feel.', 35);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aether Grain', 'Aether Grain', 'https://coffx2.vercel.app/', NULL, '["Premium", "Eksperimental", "Haute"]', 'Atelier eksperimental ultra-premium ala haute gastronomy.', 'Ultra-premium experimental atelier with a haute-gastronomy feel.', 36);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aether Noir', 'Aether Noir', 'https://coffx3.vercel.app/', NULL, '["Noir", "Dark", "Architecture"]', 'Arsitektur kopi noir yang dramatis dan elegan.', 'Dramatic, elegant noir coffee architecture.', 37);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aethera', 'Aethera', 'https://coffx4.vercel.app/', NULL, '["Futuristik", "Minimalis", "Warm"]', 'Atelier futuristik minimalis dengan palet hangat.', 'Minimalist futuristic atelier in a warm palette.', 38);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aetheria', 'Aetheria', 'https://coffx5.vercel.app/', NULL, '["Modern", "Architecture", "Premium"]', 'Specialty coffee modern berarsitektur, terasa mewah.', 'Modern architectural specialty coffee with a luxe feel.', 39);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Aurelia Coffee', 'Aurelia Coffee', 'https://cofffx6.vercel.app/', NULL, '["Roastery", "Warm", "Guide"]', 'Roastery hangat dengan panduan seduh interaktif.', 'Warm roastery site with interactive brewing guides.', 40);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Valence', 'Valence', 'https://coffx7.vercel.app/', NULL, '["Bold", "Dark", "Yellow"]', 'Identitas berani hitam dengan aksen kuning listrik.', 'Bold black identity with electric-yellow accents.', 41);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('VØID Coffee Maison', 'VØID Coffee Maison', 'https://cofffx8.vercel.app/', NULL, '["Editorial", "Luxury", "Maison"]', 'Maison editorial kelas atas, nuansa high-fashion.', 'High-fashion editorial maison with pure-extraction flair.', 42);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Kyber', 'Kyber', 'https://cofffx9.vercel.app/', NULL, '["Futuristik", "Dark", "Electric Blue"]', 'Tampilan futuristik hitam dengan aksen biru listrik.', 'Futuristic black look with electric-blue accents.', 43);
INSERT INTO `templates` (`name_id`, `name_en`, `url`, `shot`, `tags`, `desc_id`, `desc_en`, `sort_order`) VALUES ('Atelier VØID', 'Atelier VØID', 'https://cofffx10.vercel.app/', NULL, '["Editorial", "Monokrom", "Minimalis"]', 'Estetika editorial hitam-putih yang bersih.', 'Clean black-and-white editorial aesthetic.', 44);

SET FOREIGN_KEY_CHECKS = 1;
