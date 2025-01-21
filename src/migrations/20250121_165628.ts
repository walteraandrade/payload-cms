import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_finish" AS ENUM('matte', 'glossy');
  CREATE TYPE "public"."enum_template_mood" AS ENUM('very somber', 'somber', 'neutral', 'happy', 'very happy');
  CREATE TABLE IF NOT EXISTS "template" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"image_id" integer NOT NULL,
  	"mood" "enum_template_mood",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "product" ADD COLUMN "finish" "enum_product_finish";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "template_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "template_id" integer;
  DO $$ BEGIN
   ALTER TABLE "template" ADD CONSTRAINT "template_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "template_image_idx" ON "template" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "template_updated_at_idx" ON "template" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "template_created_at_idx" ON "template" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "template_email_idx" ON "template" USING btree ("email");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_template_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_template_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_template_id_idx" ON "payload_locked_documents_rels" USING btree ("template_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_template_id_idx" ON "payload_preferences_rels" USING btree ("template_id");
  ALTER TABLE "product" DROP COLUMN IF EXISTS "price";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "template" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "template" CASCADE;
  ALTER TABLE "product" RENAME COLUMN "finish" TO "price";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_template_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_template_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_template_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_template_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "template_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "template_id";
  DROP TYPE "public"."enum_product_finish";
  DROP TYPE "public"."enum_template_mood";`)
}
