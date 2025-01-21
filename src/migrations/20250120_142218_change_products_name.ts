import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "product" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" numeric,
  	"price" numeric,
  	"description" varchar,
  	"image_id" integer NOT NULL,
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "product_id" integer;
  DO $$ BEGIN
   ALTER TABLE "product" ADD CONSTRAINT "product_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "product_image_idx" ON "product" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "product_updated_at_idx" ON "product" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_created_at_idx" ON "product" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_email_idx" ON "product" USING btree ("email");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_product_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_id_idx" ON "payload_locked_documents_rels" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_product_id_idx" ON "payload_preferences_rels" USING btree ("product_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_product_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_product_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "product_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "product_id";`)
}
