import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorregirMamonasEnviarACocina1790310000000 implements MigrationInterface {
  name = 'CorregirMamonasEnviarACocina1790310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "productos" SET "enviar_a_cocina" = false WHERE "nombre" = 'Mamonas'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "productos" SET "enviar_a_cocina" = true WHERE "nombre" = 'Mamonas'`,
    );
  }
}
