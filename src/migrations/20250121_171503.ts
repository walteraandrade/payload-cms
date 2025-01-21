import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_product_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_template_fk";
  
  DROP INDEX IF EXISTS "product_email_idx";
  DROP INDEX IF EXISTS "template_email_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_product_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_template_id_idx";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "email";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "reset_password_token";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "reset_password_expiration";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "salt";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "hash";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "login_attempts";
  ALTER TABLE "product" DROP COLUMN IF EXISTS "lock_until";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "email";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "reset_password_token";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "reset_password_expiration";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "salt";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "hash";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "login_attempts";
  ALTER TABLE "template" DROP COLUMN IF EXISTS "lock_until";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "product_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "template_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "product" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "product" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "product" ADD COLUMN "salt" varchar;
  ALTER TABLE "product" ADD COLUMN "hash" varchar;
  ALTER TABLE "product" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "product" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "template" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "template" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "template" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "template" ADD COLUMN "salt" varchar;
  ALTER TABLE "template" ADD COLUMN "hash" varchar;
  ALTER TABLE "template" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "template" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "product_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "template_id" integer;
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_product_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_template_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "product_email_idx" ON "product" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "template_email_idx" ON "template" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_product_id_idx" ON "payload_preferences_rels" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_template_id_idx" ON "payload_preferences_rels" USING btree ("template_id");`)
}
