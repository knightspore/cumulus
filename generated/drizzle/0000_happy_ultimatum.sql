CREATE TYPE "public"."bet_position" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."resolution_answer" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TABLE "bets" (
	"uri" text PRIMARY KEY NOT NULL,
	"did" text NOT NULL,
	"rev" text NOT NULL,
	"rkey" text NOT NULL,
	"cid" text NOT NULL,
	"record" json NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"position" "bet_position" NOT NULL,
	"marketUri" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "markets" (
	"uri" text PRIMARY KEY NOT NULL,
	"did" text NOT NULL,
	"rev" text NOT NULL,
	"rkey" text NOT NULL,
	"cid" text NOT NULL,
	"record" json NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"question" text NOT NULL,
	"liquidity" integer NOT NULL,
	"closesAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resolutions" (
	"uri" text PRIMARY KEY NOT NULL,
	"did" text NOT NULL,
	"rev" text NOT NULL,
	"rkey" text NOT NULL,
	"cid" text NOT NULL,
	"record" json NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"answer" "resolution_answer" NOT NULL,
	"marketUri" text NOT NULL
);
