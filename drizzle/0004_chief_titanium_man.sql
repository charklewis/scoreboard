ALTER TABLE `round_player` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `round_player` ADD PRIMARY KEY(`round_id`,`player_id`);