ｃCREATE TABLE `exhibition_ar_design` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exhibitor` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exhibitor`("id", "name", "password_hash", "created_at", "updated_at") SELECT "id", "name", "password_hash", "created_at", "updated_at" FROM `exhibitor`;--> statement-breakpoint
DROP TABLE `exhibitor`;--> statement-breakpoint
ALTER TABLE `__new_exhibitor` RENAME TO `exhibitor`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `exhibitor_name_unique` ON `exhibitor` (`name`);--> statement-breakpoint
ALTER TABLE `exhibition_information` ADD `exhibition_ar_design_id` text REFERENCES exhibition_ar_design(id);--> statement-breakpoint
ALTER TABLE `exhibition_information` ADD `exhibitor_name` text NOT NULL;