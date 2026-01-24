ALTER TABLE `news` ADD `mainCategory` enum('練習','試合','連絡事項','その他') NOT NULL;--> statement-breakpoint
ALTER TABLE `news` ADD `subCategory` enum('U7','U8','U9','U10','U11','U12','全体','その他') NOT NULL;--> statement-breakpoint
ALTER TABLE `news` DROP COLUMN `category`;