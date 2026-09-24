import { MigrationInterface, QueryRunner } from 'typeorm';

export class CambiarDefaultTipoImpuestoAExcluido1790270731729
  implements MigrationInterface
{
  name = 'CambiarDefaultTipoImpuestoAExcluido1790270731729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productos" ALTER COLUMN "tipo_impuesto" SET DEFAULT 'EXCLUIDO'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productos" ALTER COLUMN "tipo_impuesto" SET DEFAULT 'IVA_19'`,
    );
  }
}
