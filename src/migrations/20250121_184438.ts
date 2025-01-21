import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_album_finish" AS ENUM('matte', 'glossy');
  CREATE TABLE IF NOT EXISTS "album" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"image_id" integer NOT NULL,
  	"finish" "enum_album_finish",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "album_id" integer;
  DO $$ BEGIN
   ALTER TABLE "album" ADD CONSTRAINT "album_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "album_image_idx" ON "album" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "album_updated_at_idx" ON "album" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "album_created_at_idx" ON "album" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_album_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_album_id_idx" ON "payload_locked_documents_rels" USING btree ("album_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "album" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "album" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_album_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_album_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "album_id";
  DROP TYPE "public"."enum_album_finish";`)
}
