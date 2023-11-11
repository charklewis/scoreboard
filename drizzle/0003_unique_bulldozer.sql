CREATE TABLE `game` (
	`game_id` serial AUTO_INCREMENT NOT NULL,
	`score_keeper` int NOT NULL,
	`date_created` datetime NOT NULL,
	`date_finished` datetime,
	`game_type` varchar(250) NOT NULL,
	CONSTRAINT `game_game_id` PRIMARY KEY(`game_id`)
);
--> statement-breakpoint
CREATE TABLE `player` (
	`player_id` serial AUTO_INCREMENT NOT NULL,
	`player_name` text NOT NULL,
	`emoji` varchar(120),
	`background_color` varchar(120),
	`created_by` int NOT NULL,
	CONSTRAINT `player_player_id` PRIMARY KEY(`player_id`)
);
--> statement-breakpoint
CREATE TABLE `round` (
	`round_id` serial AUTO_INCREMENT NOT NULL,
	`game_id` int NOT NULL,
	`round_number` int NOT NULL,
	`round_completed` boolean DEFAULT false,
	CONSTRAINT `round_round_id` PRIMARY KEY(`round_id`)
);
--> statement-breakpoint
CREATE TABLE `round_player` (
	`round_id` int NOT NULL,
	`player_id` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	CONSTRAINT `round_player_player_id_round_id` PRIMARY KEY(`player_id`,`round_id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `stytch_id` varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_stytch_id_unique` UNIQUE(`stytch_id`);