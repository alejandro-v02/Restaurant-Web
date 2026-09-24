import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnviarACocinaACategorias1790292484144 implements MigrationInterface {
  name = 'AddEnviarACocinaACategorias1790292484144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "enviar_a_cocina" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `UPDATE "categorias" SET "enviar_a_cocina" = false WHERE "nombre" = 'Bebidas'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "enviar_a_cocina"`);
  }
}
