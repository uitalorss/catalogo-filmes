import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1702337243455 implements MigrationInterface {
  name = 'CreateUserTable1702337243455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
