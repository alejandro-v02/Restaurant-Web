import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790184922201 implements MigrationInterface {
  name = 'InitialSchema1790184922201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_rol_enum" AS ENUM ('ADMIN', 'CAJERO', 'COCINA', 'MESERO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "nombre" varchar(150) NOT NULL,
        "email" varchar(150),
        "password_hash" varchar,
        "pin_hash" varchar,
        "rol" "public"."usuarios_rol_enum" NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_usuarios_email" UNIQUE ("email"),
        CONSTRAINT "PK_usuarios" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categorias" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "nombre" varchar(100) NOT NULL,
        "orden" int NOT NULL DEFAULT 0,
        "activo" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categorias" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."clientes_tipo_documento_enum" AS ENUM ('CC', 'CE', 'NIT', 'PASAPORTE')`,
    );
    await queryRunner.query(`
      CREATE TABLE "clientes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tipo_documento" "public"."clientes_tipo_documento_enum" NOT NULL,
        "numero_documento" varchar(30) NOT NULL,
        "nombre" varchar(150) NOT NULL,
        "email" varchar(150),
        "telefono" varchar(30),
        "direccion" varchar(250),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_clientes_numero_documento" UNIQUE ("numero_documento"),
        CONSTRAINT "PK_clientes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."productos_tipo_impuesto_enum" AS ENUM ('IVA_19', 'INC_8', 'EXCLUIDO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "productos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "categoria_id" uuid NOT NULL,
        "nombre" varchar(150) NOT NULL,
        "descripcion" varchar(500),
        "precio" numeric(12,2) NOT NULL,
        "tipo_impuesto" "public"."productos_tipo_impuesto_enum" NOT NULL DEFAULT 'IVA_19',
        "disponible" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_productos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_productos_categoria" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_producto_categoria" ON "productos" ("categoria_id")`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."mesas_estado_enum" AS ENUM ('LIBRE', 'OCUPADA', 'RESERVADA', 'INACTIVA')`,
    );
    await queryRunner.query(`
      CREATE TABLE "mesas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "numero" int NOT NULL,
        "capacidad" int NOT NULL,
        "estado" "public"."mesas_estado_enum" NOT NULL DEFAULT 'LIBRE',
        "mesero_id" uuid,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_mesas_numero" UNIQUE ("numero"),
        CONSTRAINT "PK_mesas" PRIMARY KEY ("id"),
        CONSTRAINT "FK_mesas_mesero" FOREIGN KEY ("mesero_id") REFERENCES "usuarios"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."pedidos_estado_enum" AS ENUM ('ABIERTO', 'ENVIADO_COCINA', 'SERVIDO', 'CERRADO', 'CANCELADO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "pedidos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "mesa_id" uuid NOT NULL,
        "mesero_id" uuid NOT NULL,
        "cliente_id" uuid,
        "estado" "public"."pedidos_estado_enum" NOT NULL DEFAULT 'ABIERTO',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_pedidos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pedidos_mesa" FOREIGN KEY ("mesa_id") REFERENCES "mesas"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_pedidos_mesero" FOREIGN KEY ("mesero_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_pedidos_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_pedido_mesa" ON "pedidos" ("mesa_id")`);

    await queryRunner.query(
      `CREATE TYPE "public"."pedido_items_estado_enum" AS ENUM ('PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "pedido_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "pedido_id" uuid NOT NULL,
        "producto_id" uuid NOT NULL,
        "cantidad" int NOT NULL,
        "precio_unitario" numeric(12,2) NOT NULL,
        "notas" varchar(300),
        "estado" "public"."pedido_items_estado_enum" NOT NULL DEFAULT 'PENDIENTE',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_pedido_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pedido_items_pedido" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pedido_items_producto" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_pedido_item_pedido" ON "pedido_items" ("pedido_id")`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."turnos_estado_enum" AS ENUM ('ABIERTO', 'CERRADO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "turnos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "cajero_id" uuid NOT NULL,
        "fecha_apertura" timestamptz NOT NULL,
        "fecha_cierre" timestamptz,
        "monto_apertura" numeric(12,2) NOT NULL,
        "monto_cierre" numeric(12,2),
        "estado" "public"."turnos_estado_enum" NOT NULL DEFAULT 'ABIERTO',
        CONSTRAINT "PK_turnos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_turnos_cajero" FOREIGN KEY ("cajero_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."pagos_metodo_enum" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "pagos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "pedido_id" uuid NOT NULL,
        "turno_id" uuid NOT NULL,
        "metodo" "public"."pagos_metodo_enum" NOT NULL,
        "monto" numeric(12,2) NOT NULL,
        "propina" numeric(12,2) NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_pagos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pagos_pedido" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_pagos_turno" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_pago_turno" ON "pagos" ("turno_id")`);

    await queryRunner.query(
      `CREATE TYPE "public"."documentos_tipo_enum" AS ENUM ('TIQUETE_POS', 'FACTURA_VENTA', 'NOTA_CREDITO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documentos_estado_enum" AS ENUM ('PENDIENTE', 'ENVIADO', 'ACEPTADO', 'RECHAZADO')`,
    );
    await queryRunner.query(`
      CREATE TABLE "resoluciones_numeracion" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tipo_documento" "public"."documentos_tipo_enum" NOT NULL,
        "prefijo" varchar(10) NOT NULL,
        "rango_desde" bigint NOT NULL,
        "rango_hasta" bigint NOT NULL,
        "consecutivo_actual" bigint NOT NULL,
        "fecha_vencimiento" date NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_resoluciones_numeracion" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "documentos_electronicos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tipo" "public"."documentos_tipo_enum" NOT NULL,
        "pedido_id" uuid NOT NULL,
        "cliente_id" uuid,
        "documento_origen_id" uuid,
        "prefijo" varchar(10) NOT NULL,
        "consecutivo" bigint NOT NULL,
        "cufe_cude" varchar(96),
        "estado" "public"."documentos_estado_enum" NOT NULL DEFAULT 'PENDIENTE',
        "xml_path" varchar,
        "pdf_path" varchar,
        "json_enviado" jsonb,
        "respuesta_proveedor" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_documentos_electronicos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_documentos_pedido" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_documentos_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_documentos_origen" FOREIGN KEY ("documento_origen_id") REFERENCES "documentos_electronicos"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_documento_pedido" ON "documentos_electronicos" ("pedido_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_documento_prefijo_consecutivo" ON "documentos_electronicos" ("prefijo", "consecutivo")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "documentos_electronicos"`);
    await queryRunner.query(`DROP TABLE "resoluciones_numeracion"`);
    await queryRunner.query(`DROP TYPE "public"."documentos_estado_enum"`);
    await queryRunner.query(`DROP TYPE "public"."documentos_tipo_enum"`);
    await queryRunner.query(`DROP TABLE "pagos"`);
    await queryRunner.query(`DROP TYPE "public"."pagos_metodo_enum"`);
    await queryRunner.query(`DROP TABLE "turnos"`);
    await queryRunner.query(`DROP TYPE "public"."turnos_estado_enum"`);
    await queryRunner.query(`DROP TABLE "pedido_items"`);
    await queryRunner.query(`DROP TYPE "public"."pedido_items_estado_enum"`);
    await queryRunner.query(`DROP TABLE "pedidos"`);
    await queryRunner.query(`DROP TYPE "public"."pedidos_estado_enum"`);
    await queryRunner.query(`DROP TABLE "mesas"`);
    await queryRunner.query(`DROP TYPE "public"."mesas_estado_enum"`);
    await queryRunner.query(`DROP TABLE "productos"`);
    await queryRunner.query(`DROP TYPE "public"."productos_tipo_impuesto_enum"`);
    await queryRunner.query(`DROP TABLE "clientes"`);
    await queryRunner.query(`DROP TYPE "public"."clientes_tipo_documento_enum"`);
    await queryRunner.query(`DROP TABLE "categorias"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
  }
}
