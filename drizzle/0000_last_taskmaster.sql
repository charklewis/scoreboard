CREATE TABLE IF NOT EXISTS "game" (
	"id" serial PRIMARY KEY NOT NULL,
	"score_keeper" integer NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_finished" timestamp,
	"game_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_name" text NOT NULL,
	"emoji" text,
	"background_color" text,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "round" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"round_number" integer NOT NULL,
	"round_completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "round_player" (
	"roundId" integer,
	"player_id" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "round_player_roundId_player_id_pk" PRIMARY KEY("roundId","player_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"stytch_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_stytch_id_unique" UNIQUE("stytch_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game" ADD CONSTRAINT "game_score_keeper_user_id_fk" FOREIGN KEY ("score_keeper") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player" ADD CONSTRAINT "player_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round" ADD CONSTRAINT "round_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_player" ADD CONSTRAINT "round_player_roundId_round_id_fk" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_player" ADD CONSTRAINT "round_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
