import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilmsTable1702491358513 implements MigrationInterface {
  name = 'CreateFilmsTable1702491358513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "films" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "year" integer NOT NULL, "duration" integer NOT NULL, "genres" json NOT NULL, "mainActors" json NOT NULL, "contentRating" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2023-12-11 23:27:57.465687+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2023-12-11 23:27:57.465687+00'`,
    );
    await queryRunner.query(`DROP TABLE "films"`);
  }
}
