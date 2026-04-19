-- 使用这个数据库
USE ruishenghe_db;

-- 验证当前数据库
SELECT DATABASE();
USE ruishenghe_db;

-- 创建材料表
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '材料ID',
  `name` varchar(100) NOT NULL COMMENT '材料名称',
  `category` varchar(50) NOT NULL COMMENT '类别代码',
  `category_name` varchar(50) NOT NULL COMMENT '类别名称',
  `brand` varchar(50) DEFAULT NULL COMMENT '品牌代码',
  `brand_name` varchar(100) DEFAULT NULL COMMENT '品牌名称',
  `style` varchar(50) DEFAULT NULL COMMENT '风格代码',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int(11) DEFAULT 0 COMMENT '库存数量',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位',
  `spec` varchar(200) DEFAULT NULL COMMENT '规格',
  `image` varchar(500) DEFAULT NULL COMMENT '图片路径',
  `description` text COMMENT '材料描述',
  `tags` varchar(500) DEFAULT NULL COMMENT '标签',
  `is_featured` tinyint(1) DEFAULT 0 COMMENT '是否推荐',
  `is_new` tinyint(1) DEFAULT 0 COMMENT '是否新品',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序序号',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建作品集表
CREATE TABLE IF NOT EXISTS `portfolios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `style` varchar(50) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `vr_link` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `description` text,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建管理员表
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `real_name` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `last_login` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建品牌表
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE ruishenghe_db;

-- 跳过已存在的记录
INSERT IGNORE INTO `categories` (`code`, `name`, `icon`, `sort_order`) VALUES
('floor', '地板', 'fas fa-th-large', 1),
('tile', '瓷砖', 'fas fa-square', 2),
('paint', '涂料', 'fas fa-paint-roller', 3),
('door', '门窗', 'fas fa-door-open', 4),
('hardware', '五金', 'fas fa-tools', 5),
('bathroom', '卫浴', 'fas fa-bath', 6);

INSERT IGNORE INTO `brands` (`code`, `name`, `sort_order`) VALUES
('nature', '大自然', 1),
('marco', '马可波罗', 2),
('nippon', '立邦', 3),
('dulux', '多乐士', 4),
('kohler', '科勒', 5),
('ikea', '宜家', 6),
('philips', '飞利浦', 7);

USE ruishenghe_db;

-- 查看所有表
SHOW TABLES;

-- 查看数据
SELECT * FROM materials;
SELECT * FROM admins;