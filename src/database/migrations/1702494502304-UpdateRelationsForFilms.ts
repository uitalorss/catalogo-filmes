import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationsForFilms1702494502304
  implements MigrationInterface
{
  name = 'UpdateRelationsForFilms1702494502304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ContentRatings" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "acronym" character varying NOT NULL, CONSTRAINT "PK_2f211a6c1fd76757606ba79e68f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "PK_7c07e38dd0d817a103966c5876e" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "films_artists_artist" ("filmsId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_8ec236a4476e8d5b85dd30dc769" PRIMARY KEY ("filmsId", "artistId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63593b6e0eabb4e9864226028a" ON "films_artists_artist" ("filmsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b82a2d5f144310a0a8420b680" ON "films_artists_artist" ("artistId") `,
    );
    await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "genres"`);
    await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "mainActors"`);
    await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "contentRating"`);
    await queryRunner.query(`ALTER TABLE "films" ADD "acronym" integer`);
    await queryRunner.query(
      `ALTER TABLE "films" ADD CONSTRAINT "FK_a959a9a5dcf6ee52fe5bcbbaa11" FOREIGN KEY ("acronym") REFERENCES "ContentRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" ADD CONSTRAINT "FK_f7c2fa2451e9875e8695de6276b" FOREIGN KEY ("filmsId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" ADD CONSTRAINT "FK_a18a28d5ad47d19bc5af48ce7b5" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artist" ADD CONSTRAINT "FK_63593b6e0eabb4e9864226028ab" FOREIGN KEY ("filmsId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artist" ADD CONSTRAINT "FK_4b82a2d5f144310a0a8420b6807" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "films_artists_artist" DROP CONSTRAINT "FK_4b82a2d5f144310a0a8420b6807"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_artists_artist" DROP CONSTRAINT "FK_63593b6e0eabb4e9864226028ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" DROP CONSTRAINT "FK_a18a28d5ad47d19bc5af48ce7b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films_genres_genres" DROP CONSTRAINT "FK_f7c2fa2451e9875e8695de6276b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "films" DROP CONSTRAINT "FK_a959a9a5dcf6ee52fe5bcbbaa11"`,
    );
    await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "acronym"`);
    await queryRunner.query(
      `ALTER TABLE "films" ADD "contentRating" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "films" ADD "mainActors" json NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "films" ADD "genres" json NOT NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b82a2d5f144310a0a8420b680"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_63593b6e0eabb4e9864226028a"`,
    );
    await queryRunner.query(`DROP TABLE "films_artists_artist"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a18a28d5ad47d19bc5af48ce7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7c2fa2451e9875e8695de6276"`,
    );
    await queryRunner.query(`DROP TABLE "films_genres_genres"`);
    await queryRunner.query(`DROP TABLE "Artist"`);
    await queryRunner.query(`DROP TABLE "ContentRatings"`);
    await queryRunner.query(`DROP TABLE "genres"`);
  }
}
