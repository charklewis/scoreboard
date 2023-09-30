CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`stytch_id` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
