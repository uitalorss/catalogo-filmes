import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEvaluationTable1704813344909 implements MigrationInterface {
    name = 'CreateEvaluationTable1704813344909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "evaluations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "film_id" uuid, CONSTRAINT "PK_f683b433eba0e6dae7e19b29e29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "evaluations" ADD CONSTRAINT "FK_3d371b1ebe55ca4c60cbf66fa0e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluations" ADD CONSTRAINT "FK_b9f75179277222f7d59acf8b36b" FOREIGN KEY ("film_id") REFERENCES "films"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "evaluations" DROP CONSTRAINT "FK_b9f75179277222f7d59acf8b36b"`);
        await queryRunner.query(`ALTER TABLE "evaluations" DROP CONSTRAINT "FK_3d371b1ebe55ca4c60cbf66fa0e"`);
        await queryRunner.query(`DROP TABLE "evaluations"`);
    }

}
