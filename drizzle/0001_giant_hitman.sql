CREATE TABLE `kit_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kitProductId` int NOT NULL,
	`itemProductId` int NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `kit_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`altText` varchar(220),
	`position` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`category` enum('tags','dtf','cartao_visita','kits') NOT NULL,
	`type` enum('product','kit') NOT NULL DEFAULT 'product',
	`price` decimal(10,2) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(140) NOT NULL DEFAULT 'Criativa Express',
	`whatsappNumber` varchar(24),
	`whatsappGreeting` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `kit_items` ADD CONSTRAINT `kit_items_kitProductId_products_id_fk` FOREIGN KEY (`kitProductId`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kit_items` ADD CONSTRAINT `kit_items_itemProductId_products_id_fk` FOREIGN KEY (`itemProductId`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `kit_items_kit_idx` ON `kit_items` (`kitProductId`);--> statement-breakpoint
CREATE INDEX `product_images_product_position_idx` ON `product_images` (`productId`,`position`);--> statement-breakpoint
CREATE INDEX `products_category_active_idx` ON `products` (`category`,`isActive`);--> statement-breakpoint
CREATE INDEX `products_sort_idx` ON `products` (`sortOrder`);