import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { UsuarioOrmEntity } from '../../modules/usuarios/infrastructure/persistence/usuario.orm-entity';
import { RolUsuario } from '../../modules/usuarios/domain/entities/usuario.entity';
import { CategoriaOrmEntity } from '../../modules/catalogo/infrastructure/persistence/categoria.orm-entity';
import { ProductoOrmEntity } from '../../modules/catalogo/infrastructure/persistence/producto.orm-entity';
import { TipoImpuesto } from '../../modules/catalogo/domain/entities/producto.entity';
import { MesaOrmEntity } from '../../modules/mesas/infrastructure/persistence/mesa.orm-entity';

const MENU: Array<{
  categoria: string;
  productos: Array<{ nombre: string; precio: number; enviarACocina?: boolean }>;
}> = [
  {
    categoria: 'Res-cerdo',
    productos: [
      { nombre: 'Llanera', precio: 35000, enviarACocina: false },
      { nombre: 'Mamona', precio: 35000, enviarACocina: false },
      { nombre: 'Chiguiro', precio: 35000, enviarACocina: false },
      { nombre: 'Mixta', precio: 38000, enviarACocina: false },
      { nombre: 'Churrasco', precio: 40000, enviarACocina: false },
      { nombre: 'Lomo de cerdo', precio: 38000, enviarACocina: false },
      { nombre: 'Milanesa de Cerdo', precio: 38000 },
      { nombre: 'Costillo Ahumadas', precio: 35000 },
      { nombre: 'Costillas BBQ', precio: 37000 },
    ],
  },
  {
    categoria: 'Pollo',
    productos: [
      { nombre: 'Pechuga a la Brasa', precio: 28000 },
      { nombre: 'Pechuga Gratinada', precio: 30000 },
      { nombre: 'Pechuga en Champiñones', precio: 32000 },
      { nombre: 'Pechuga Hawaiana', precio: 32000 },
      { nombre: 'Milanesa de Pollo', precio: 30000 },
    ],
  },
  {
    categoria: 'Especiales',
    productos: [
      { nombre: 'Casanare', precio: 38000 },
      { nombre: 'Frijolada', precio: 28000 },
      { nombre: 'Arroz Frutos del Mar', precio: 47000 },
      { nombre: 'Ajiaco', precio: 25000 },
      { nombre: 'Arroz con Pollo', precio: 25000 },
      { nombre: 'Sancocho', precio: 45000 },
    ],
  },
  {
    categoria: 'Pescados',
    productos: [
      { nombre: 'Mojarra Frita', precio: 33000 },
      { nombre: 'Trucha Frita', precio: 33000 },
      { nombre: 'Trucha al Ajillo', precio: 38000 },
      { nombre: 'Trucha Marinera', precio: 48000 },
      { nombre: 'Viudo de Capaz', precio: 38000 },
      { nombre: 'Viudo de Bocachico', precio: 38000 },
      { nombre: 'Cazuela de Mariscos', precio: 48000 },
      { nombre: 'Bagre Salsa', precio: 38000 },
      { nombre: 'Bagre Dorado', precio: 38000 },
      { nombre: 'Bagre Marinero', precio: 48000 },
    ],
  },
  {
    categoria: 'Entradas',
    productos: [
      { nombre: 'Chicharrón', precio: 10000 },
      { nombre: 'Chorizo', precio: 10000 },
      { nombre: 'Patacón con Ahogado', precio: 10000 },
      { nombre: 'Sopa sencilla', precio: 8000 },
    ],
  },
  {
    categoria: 'Bebidas',
    productos: [
      { nombre: 'Gaseosa Personal', precio: 3000, enviarACocina: false },
      { nombre: 'Gaseosa 1.5L', precio: 8000, enviarACocina: false },
      { nombre: 'Gaseosa 3L', precio: 12000, enviarACocina: false },
      { nombre: 'Jarra de Limonada de Panela', precio: 15000, enviarACocina: false },
      { nombre: 'Media Jarra de Limonada de Panela', precio: 8000, enviarACocina: false },
      { nombre: 'Vaso de Limonada de Panela', precio: 4000, enviarACocina: false },
      { nombre: 'Jarra de Limonada Natural', precio: 15000, enviarACocina: false },
      { nombre: 'Media Jarra de Limonada Natural', precio: 10000, enviarACocina: false },
      { nombre: 'Vaso de Limonada Natural', precio: 6000, enviarACocina: false },
      { nombre: 'Jarra de Jugo Natural en Agua', precio: 15000, enviarACocina: false },
      { nombre: 'Media Jarra de Jugo en Agua', precio: 10000, enviarACocina: false },
      { nombre: 'Jarra de Jugo en Leche', precio: 20000, enviarACocina: false },
      { nombre: 'Media Jarra de Jugo en Leche', precio: 15000, enviarACocina: false },
      { nombre: 'Vaso de Jugo en Leche', precio: 10000, enviarACocina: false },
      { nombre: 'Jarra de Limonada de Coco', precio: 30000, enviarACocina: false },
      { nombre: 'Media Jarra de Limonada de Coco', precio: 20000, enviarACocina: false },
      { nombre: 'Limonada de Coco Personal', precio: 15000, enviarACocina: false },
      { nombre: 'Jarra de Limonada Cerezada', precio: 28000, enviarACocina: false },
      { nombre: 'Media Jarra de Limonada Cerezada', precio: 20000, enviarACocina: false },
      { nombre: 'Limonada de Vino Personal', precio: 15000, enviarACocina: false },
      { nombre: 'Agua Personal', precio: 3000, enviarACocina: false },
    ],
  },
];

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
      email: 'admin@emberrestaurant.dev',
      passwordHash: await bcrypt.hash('Admin123*', 10),
      rol: RolUsuario.ADMIN,
    },
    {
      nombre: 'Cajero Principal',
      email: 'caja@emberrestaurant.dev',
      passwordHash: await bcrypt.hash('Caja123*', 10),
      rol: RolUsuario.CAJERO,
    },
    {
      nombre: 'Cocina',
      email: 'cocina@emberrestaurant.dev',
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

  for (const [indice, seccion] of MENU.entries()) {
    let categoria = await categoriaRepo.findOneBy({ nombre: seccion.categoria });
    if (!categoria) {
      categoria = await categoriaRepo.save(
        categoriaRepo.create({ nombre: seccion.categoria, orden: indice + 1 }),
      );
      console.log(`Categoria creada: ${seccion.categoria}`);
    }

    for (const producto of seccion.productos) {
      const existente = await productoRepo.findOneBy({ nombre: producto.nombre });
      if (!existente) {
        await productoRepo.save(
          productoRepo.create({
            categoriaId: categoria.id,
            nombre: producto.nombre,
            precio: producto.precio,
            tipoImpuesto: TipoImpuesto.EXCLUIDO,
            enviarACocina: producto.enviarACocina ?? true,
          }),
        );
        console.log(`Producto creado: ${producto.nombre}`);
      }
    }
  }

  for (let numero = 1; numero <= 100; numero++) {
    const existente = await mesaRepo.findOneBy({ numero });
    if (!existente) {
      await mesaRepo.save(mesaRepo.create({ numero, capacidad: 4 }));
    }
  }
  console.log('Mesas creadas: 1 a 100');

  await AppDataSource.destroy();
  console.log('Seed completado.');
}

seed().catch((error) => {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
});
