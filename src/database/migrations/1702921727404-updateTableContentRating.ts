import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableContentRating1702921727404
  implements MigrationInterface
{
  name = 'UpdateTableContentRating1702921727404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films" DROP CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f"`,
    );
    await queryRunner.query(
      `CREATE TABLE "contentRatings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, CONSTRAINT "PK_fa350e4751f64f90bb74e01bb28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "films" ADD CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f" FOREIGN KEY ("ContentRating_id") REFERENCES "contentRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films" DROP CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "contentRatings"`);
    await queryRunner.query(
      `ALTER TABLE "films" ADD CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f" FOREIGN KEY ("ContentRating_id") REFERENCES "ContentRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
