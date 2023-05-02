import { Migration } from '@mikro-orm/migrations';

export class Migration20230502023356 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "the_sender_id" int not null, "the_recipient_id" int not null, "message" varchar(255) not null);');

    this.addSql('alter table "message" add constraint "message_the_sender_id_foreign" foreign key ("the_sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_the_recipient_id_foreign" foreign key ("the_recipient_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');
  }

}
