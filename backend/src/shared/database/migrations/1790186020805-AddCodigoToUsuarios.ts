import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodigoToUsuarios1790186020805 implements MigrationInterface {
  name = 'AddCodigoToUsuarios1790186020805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "codigo" varchar(30)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_usuarios_codigo" UNIQUE ("codigo")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_usuarios_codigo"`,
    );
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "codigo"`);
  }
}
