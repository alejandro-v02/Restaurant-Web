import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { UsuarioOrmEntity } from '../../modules/usuarios/infrastructure/persistence/usuario.orm-entity';
import { RolUsuario } from '../../modules/usuarios/domain/entities/usuario.entity';
import { CategoriaOrmEntity } from '../../modules/catalogo/infrastructure/persistence/categoria.orm-entity';
import { ProductoOrmEntity } from '../../modules/catalogo/infrastructure/persistence/producto.orm-entity';
import { TipoImpuesto } from '../../modules/catalogo/domain/entities/producto.entity';
import { MesaOrmEntity } from '../../modules/mesas/infrastructure/persistence/mesa.orm-entity';

async function seed() {
  await AppDataSource.initialize();

  const usuarioRepo = AppDataSource.getRepository(UsuarioOrmEntity);
  const categoriaRepo = AppDataSource.getRepository(CategoriaOrmEntity);
  const productoRepo = AppDataSource.getRepository(ProductoOrmEntity);
  const mesaRepo = AppDataSource.getRepository(MesaOrmEntity);

  const usuarios: Array<{
    nombre: string;
    email?: string;
    codigo?: string;
    passwordHash?: string;
    pinHash?: string;
    rol: RolUsuario;
  }> = [
    {
      nombre: 'Administrador',
      email: 'admin@fogonpos.dev',
      passwordHash: await bcrypt.hash('Admin123*', 10),
      rol: RolUsuario.ADMIN,
    },
    {
      nombre: 'Cajero Principal',
      email: 'caja@fogonpos.dev',
      passwordHash: await bcrypt.hash('Caja123*', 10),
      rol: RolUsuario.CAJERO,
    },
    {
      nombre: 'Cocina',
      email: 'cocina@fogonpos.dev',
      passwordHash: await bcrypt.hash('Cocina123*', 10),
      rol: RolUsuario.COCINA,
    },
    {
      nombre: 'Mesero 1',
      codigo: 'mesero1',
      pinHash: await bcrypt.hash('1234', 10),
      rol: RolUsuario.MESERO,
    },
  ];

  for (const data of usuarios) {
    const existente = data.email
      ? await usuarioRepo.findOneBy({ email: data.email })
      : await usuarioRepo.findOneBy({ codigo: data.codigo });
    if (!existente) {
      await usuarioRepo.save(usuarioRepo.create(data));
      console.log(`Usuario creado: ${data.nombre}`);
    }
  }

  let categoriaEntradas = await categoriaRepo.findOneBy({ nombre: 'Entradas' });
  if (!categoriaEntradas) {
    categoriaEntradas = await categoriaRepo.save(
      categoriaRepo.create({ nombre: 'Entradas', orden: 1 }),
    );
    console.log('Categoria creada: Entradas');
  }

  let categoriaPlatos = await categoriaRepo.findOneBy({ nombre: 'Platos fuertes' });
  if (!categoriaPlatos) {
    categoriaPlatos = await categoriaRepo.save(
      categoriaRepo.create({ nombre: 'Platos fuertes', orden: 2 }),
    );
    console.log('Categoria creada: Platos fuertes');
  }

  let categoriaBebidas = await categoriaRepo.findOneBy({ nombre: 'Bebidas' });
  if (!categoriaBebidas) {
    categoriaBebidas = await categoriaRepo.save(
      categoriaRepo.create({ nombre: 'Bebidas', orden: 3 }),
    );
    console.log('Categoria creada: Bebidas');
  }

  const productos = [
    {
      categoriaId: categoriaEntradas.id,
      nombre: 'Patacones con hogao',
      precio: 14000,
      tipoImpuesto: TipoImpuesto.INC_8,
    },
    {
      categoriaId: categoriaPlatos.id,
      nombre: 'Bandeja paisa',
      precio: 32000,
      tipoImpuesto: TipoImpuesto.INC_8,
    },
    {
      categoriaId: categoriaPlatos.id,
      nombre: 'Sancocho de gallina',
      precio: 28000,
      tipoImpuesto: TipoImpuesto.INC_8,
    },
    {
      categoriaId: categoriaBebidas.id,
      nombre: 'Limonada de coco',
      precio: 9000,
      tipoImpuesto: TipoImpuesto.IVA_19,
    },
  ];

  for (const data of productos) {
    const existente = await productoRepo.findOneBy({ nombre: data.nombre });
    if (!existente) {
      await productoRepo.save(productoRepo.create(data));
      console.log(`Producto creado: ${data.nombre}`);
    }
  }

  for (let numero = 1; numero <= 8; numero++) {
    const existente = await mesaRepo.findOneBy({ numero });
    if (!existente) {
      await mesaRepo.save(mesaRepo.create({ numero, capacidad: 4 }));
      console.log(`Mesa creada: ${numero}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seed completado.');
}

seed().catch((error) => {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
});
