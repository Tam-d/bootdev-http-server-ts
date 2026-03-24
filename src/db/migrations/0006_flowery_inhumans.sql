ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET NOT NULL;