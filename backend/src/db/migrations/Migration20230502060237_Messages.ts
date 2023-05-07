import { Migration } from "@mikro-orm/migrations";

export class Migration20230502060237 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "message" add column "deleted" boolean not null;');
	}

	async down(): Promise<void> {
		this.addSql('alter table "message" drop column "deleted";');
	}
}
