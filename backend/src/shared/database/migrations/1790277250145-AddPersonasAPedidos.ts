import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPersonasAPedidos1790277250145 implements MigrationInterface {
  name = 'AddPersonasAPedidos1790277250145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pedidos" ADD "personas" int NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "personas"`);
  }
}
