CREATE TABLE `avatars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`last_updated` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `avatars_key_unique` ON `avatars` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `key_idx` ON `avatars` (`key`);--> statement-breakpoint
CREATE TABLE `regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`handle` text NOT NULL,
	`name` text,
	`last_updated` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `regions_handle_unique` ON `regions` (`handle`);--> statement-breakpoint
CREATE UNIQUE INDEX `handle_idx` ON `regions` (`handle`);