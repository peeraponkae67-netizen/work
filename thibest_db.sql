-- ========================================================
-- ฐานข้อมูลระบบร้านขายเสื้อผ้า Thibest Clothes
-- สำหรับ Import ใน phpMyAdmin (MySQL / MariaDB)
-- รหัสภาษา: UTF-8 Unicode (utf8mb4) รองรับภาษาไทย 100%
-- ========================================================

-- 1. สร้างฐานข้อมูล (หากยังไม่มี)
CREATE DATABASE IF NOT EXISTS `thibest_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `thibest_db`;

-- --------------------------------------------------------

-- 2. สร้างตารางหมวดหมู่สินค้า (categories)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `icon` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 3. สร้างตารางสินค้า (products)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `size` VARCHAR(20) DEFAULT 'M',
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 4. สร้างตารางผู้ใช้งาน / ลูกค้า (users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) DEFAULT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 5. สร้างตารางคำสั่งซื้อ (orders)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending', 'paid', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- 6. สร้างตารางรายการสินค้าในคำสั่งซื้อ (order_items)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- ข้อมูลเริ่มต้น (Seed Data)
-- ========================================================

-- เพิ่มหมวดหมู่เบื้องต้น
INSERT INTO `categories` (`name`, `icon`) VALUES
('เสื้อยืด', '👕'),
('เสื้อเชิ้ต', '👔'),
('กางเกง', '👖'),
('เสื้อกันหนาว/ฮู้ด', '🧥'),
('อุปกรณ์เสริม', '🧢')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- เพิ่มผู้ใช้งานตัวอย่าง (รหัสผ่านผ่านการ Hash ด้วย bcrypt ป้องกัน Plaintext 100%)
INSERT INTO `users` (`username`, `email`, `password`, `full_name`, `role`) VALUES
('admin', 'admin@thibest.com', '$2b$10$GY8F6O.OXl82TiwZiGrR/OMdACTIDOAXf2SJzidr/B5g.68d5jJsi', 'ผู้ดูแลระบบ Thibest', 'admin'),
('userdemo', 'customer@gmail.com', '$2b$10$ikgITvhM6Z.nfjNSyRYNnezN.Qp85JafXVxhMQC8gp5Iwi55tHxM6', 'คุณสมชาย ใจดี', 'customer')
ON DUPLICATE KEY UPDATE `password`=VALUES(`password`), `full_name`=VALUES(`full_name`);

-- เพิ่มสินค้าเสื้อผ้าตัวอย่าง 6 รายการ
INSERT INTO `products` (`id`, `name`, `category`, `price`, `size`, `stock`, `image_url`, `description`) VALUES
(1, 'เสื้อยืด Oversize สไตล์ Minimal', 'เสื้อยืด', 390.00, 'L', 25, 'https://www.top10.in.th/wp-content/uploads/2025/11/%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD-Oversize-Yuedpao-Signature-Oversize-Summer.jpg', 'เสื้อยืดผ้าคอตตอนแท้ 100% สัมผัสนุ่ม ทรงหลวมใส่สบาย ระบายอากาศได้ดีเยี่ยม'),
(2, 'เสื้อฮู้ด Streetwear สีดำด้าน', 'เสื้อกันหนาว/ฮู้ด', 890.00, 'XL', 12, 'https://down-th.img.susercontent.com/file/cn-11134207-7ras8-mdbjpf67yicpb0', 'เสื้อฮู้ดผ้าหนากำลังดี ซับในนุ่ม ปลายแขนและเอวจั๊มอย่างดี ดีไซน์สตรีทคลาสสิก'),
(3, 'กางเกงยีนส์ขากระบอกตรง Vintage Wash', 'กางเกง', 990.00, '32', 18, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', 'กางเกงยีนส์ผ้าเดนิมฟอกอย่างดี ทรงกระบอกคลาสสิก เข้ากับทุกลุค'),
(4, 'เสื้อเชิ้ตแขนยาว ผ้าลินินทรงสบาย', 'เสื้อเชิ้ต', 550.00, 'M', 30, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', 'เสื้อเชิ้ตผ้าลินินผสมคอตตอน สไตล์มินิมอล ใส่เที่ยวหรือใส่ทำงานก็ดูดี'),
(5, 'เสื้อแจ็คเก็ตยีนส์ Trucker Classic', 'เสื้อกันหนาว/ฮู้ด', 1290.00, 'L', 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu5p3FA0Fq4Ou5C9wvaKk39aLcxeNMV6Tsrfla8BuPyw&s=10', 'แจ็คเก็ตยีนส์พรีเมียม สไตล์เรโทร ยีนส์แน่น อยู่ทรงสวย กระเป๋าอก 2 ช่อง'),
(6, 'กางเกงสแล็ค Cargo ขาสั้น', 'กางเกง', 490.00, '30', 15, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=80', 'กางเกงคาร์โก้ขาสั้น ช่องกระเป๋าจุของได้เยอะ ทนทาน แมทช์ง่ายกับเสื้อยืด')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`);
