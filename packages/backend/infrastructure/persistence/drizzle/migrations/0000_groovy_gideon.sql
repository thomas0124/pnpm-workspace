CREATE TABLE `exhibition` (
	`id` text PRIMARY KEY NOT NULL,
	`exhibitor_id` text NOT NULL,
	`exhibition_information_id` text,
	`is_draft` integer DEFAULT 1 NOT NULL,
	`is_published` integer DEFAULT 0 NOT NULL,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`exhibitor_id`) REFERENCES `exhibitor`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exhibition_information_id`) REFERENCES `exhibition_information`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "is_draft" CHECK("exhibition"."is_draft" IN (0, 1)),
	CONSTRAINT "is_published" CHECK("exhibition"."is_published" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `exhibition_information` (
	`id` text PRIMARY KEY NOT NULL,
	`exhibitor_id` text NOT NULL,
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
	FOREIGN KEY (`exhibitor_id`) REFERENCES `exhibitor`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exhibition_information_exhibitor_id_unique` ON `exhibition_information` (`exhibitor_id`);--> statement-breakpoint
CREATE TABLE `exhibitor` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exhibitor_name_unique` ON `exhibitor` (`name`);