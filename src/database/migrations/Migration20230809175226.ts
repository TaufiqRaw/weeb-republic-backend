import { Migration } from '@mikro-orm/migrations';

export class Migration20230809175226 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "is_admin" boolean not null, "profile_picture" varchar(255) null, "phone" varchar(13) null, "refresh_token" varchar(255) null);');
    this.addSql('create index "user_name_index" on "user" ("name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "media" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "original_name" varchar(255) not null, "file_name" varchar(255) not null, "mime_type" varchar(255) not null, "thumbnail_generated" boolean not null, "submitted_by_id" int null);');
    this.addSql('create index "media_original_name_index" on "media" ("original_name");');
    this.addSql('alter table "media" add constraint "media_file_name_unique" unique ("file_name");');

    this.addSql('alter table "media" add constraint "media_submitted_by_id_foreign" foreign key ("submitted_by_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "media" drop constraint "media_submitted_by_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "media" cascade;');
  }

}
