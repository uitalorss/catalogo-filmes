import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTokenTable1703111061870 implements MigrationInterface {
    name = 'CreateUserTokenTable1703111061870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "userToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" text NOT NULL, "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_57e9636d5325549fd42e0d7a440" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "userToken"`);
    }

}
