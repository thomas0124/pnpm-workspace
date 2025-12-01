PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exhibition_information` (
	`id` text PRIMARY KEY NOT NULL,
	`exhibitor_id` text NOT NULL,
	`exhibition_ar_design_id` text,
	`exhibitor_name` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`location` text NOT NULL,
	`price` integer,
	`required_time` integer,
	`comment` text,
	`image` blob,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`exhibitor_id`) REFERENCES `exhibitor`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exhibition_ar_design_id`) REFERENCES `exhibition_ar_design`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exhibition_information`("id", "exhibitor_id", "exhibition_ar_design_id", "exhibitor_name", "title", "category", "location", "price", "required_time", "comment", "image", "created_at", "updated_at") SELECT "id", "exhibitor_id", "exhibition_ar_design_id", "exhibitor_name", "title", "category", "location", "price", "required_time", "comment", "image", "created_at", "updated_at" FROM `exhibition_information`;--> statement-breakpoint
DROP TABLE `exhibition_information`;--> statement-breakpoint
ALTER TABLE `__new_exhibition_information` RENAME TO `exhibition_information`;--> statement-breakpoint
PRAGMA foreign_keys=ON;