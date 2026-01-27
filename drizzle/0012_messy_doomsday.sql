ALTER TABLE `match_results` ADD `matchTitle` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `schedules` ADD `meetingTime` varchar(5);--> statement-breakpoint
ALTER TABLE `match_results` DROP COLUMN `venue`;