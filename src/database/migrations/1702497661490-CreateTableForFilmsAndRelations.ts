import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableForFilmsAndRelations1702497661490
  implements MigrationInterface
{
  name = 'CreateTableForFilmsAndRelations1702497661490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ContentRatings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, CONSTRAINT "PK_2f211a6c1fd76757606ba79e68f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "films" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "synopsis" text NOT NULL, "year" integer NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ContentRating_id" uuid, CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "films_genres_genres" ("filmsId" uuid NOT NULL, "genresId" uuid NOT NULL, CONSTRAINT "PK_ade01ad0087c0f0241f32545642" PRIMARY KEY ("filmsId", "genresId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7c2fa2451e9875e8695de6276" ON "films_genres_genres" ("filmsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a18a28d5ad47d19bc5af48ce7b" ON "films_genres_genres" ("genresId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "films_artists_artists" ("filmsId" uuid NOT NULL, "artistsId" uuid NOT NULL, CONSTRAINT "PK_949c9443cd32eaf4fdad01e2556" PRIMARY KEY ("filmsId", "artistsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c937ec33b0a151cb62864c609a" ON "films_artists_artists" ("filmsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fcba9b44806ca4bd0fb68d43e" ON "films_artists_artists" ("artistsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "films" ADD CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f" FOREIGN KEY ("ContentRating_id") REFERENCES "ContentRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" ADD CONSTRAINT "FK_f7c2fa2451e9875e8695de6276b" FOREIGN KEY ("filmsId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" ADD CONSTRAINT "FK_a18a28d5ad47d19bc5af48ce7b5" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artists" ADD CONSTRAINT "FK_c937ec33b0a151cb62864c609a9" FOREIGN KEY ("filmsId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artists" ADD CONSTRAINT "FK_8fcba9b44806ca4bd0fb68d43e1" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films_artists_artists" DROP CONSTRAINT "FK_8fcba9b44806ca4bd0fb68d43e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artists" DROP CONSTRAINT "FK_c937ec33b0a151cb62864c609a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" DROP CONSTRAINT "FK_a18a28d5ad47d19bc5af48ce7b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" DROP CONSTRAINT "FK_f7c2fa2451e9875e8695de6276b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films" DROP CONSTRAINT "FK_5dcb8bd8a64ea90261d1a0fcc0f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8fcba9b44806ca4bd0fb68d43e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c937ec33b0a151cb62864c609a"`,
    );
    await queryRunner.query(`DROP TABLE "films_artists_artists"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a18a28d5ad47d19bc5af48ce7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7c2fa2451e9875e8695de6276"`,
    );
    await queryRunner.query(`DROP TABLE "films_genres_genres"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "films"`);
    await queryRunner.query(`DROP TABLE "ContentRatings"`);
    await queryRunner.query(`DROP TABLE "genres"`);
  }
}
