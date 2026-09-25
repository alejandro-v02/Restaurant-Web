import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoverEnviarACocinaAProductos1790300000000 implements MigrationInterface {
  name = 'MoverEnviarACocinaAProductos1790300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productos" ADD "enviar_a_cocina" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `UPDATE "productos" p SET "enviar_a_cocina" = false FROM "categorias" c WHERE p."categoria_id" = c."id" AND c."nombre" = 'Bebidas'`,
    );
    await queryRunner.query(
      `UPDATE "productos" SET "enviar_a_cocina" = false WHERE "nombre" IN ('Llanera', 'Mamona', 'Chiguiro', 'Mixta', 'Lomo de cerdo', 'Churrasco', 'Churrasco Gratinado')`,
    );
    await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "enviar_a_cocina"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "enviar_a_cocina" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `UPDATE "categorias" SET "enviar_a_cocina" = false WHERE "nombre" = 'Bebidas'`,
    );
    await queryRunner.query(`ALTER TABLE "productos" DROP COLUMN "enviar_a_cocina"`);
  }
}
