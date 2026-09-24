import { Component, computed, inject, signal } from '@angular/core';
import {
  ActualizarProductoInput,
  CatalogoService,
  CrearCategoriaInput,
  CrearProductoInput,
} from '../../core/catalogo/catalogo.service';
import { Categoria, Producto } from '../../core/catalogo/catalogo.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { CategoriaFormOrganism } from '../../ui/organisms/categoria-form/categoria-form';
import { ProductoFormOrganism } from '../../ui/organisms/producto-form/producto-form';
import { ProductoEditarFormOrganism } from '../../ui/organisms/producto-editar-form/producto-editar-form';
import { ModalOrganism } from '../../ui/organisms/modal/modal';
import { ButtonAtom } from '../../ui/atoms/button/button';

export interface GrupoCatalogo {
  categoria: Categoria;
  productos: Producto[];
}

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [CategoriaFormOrganism, ProductoFormOrganism, ProductoEditarFormOrganism, ModalOrganism, ButtonAtom],
  templateUrl: './catalogo-page.html',
})
export class CatalogoPage {
  private readonly catalogoService = inject(CatalogoService);
  private readonly notificacionService = inject(NotificacionService);

  readonly categorias = signal<Categoria[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly creandoCategoria = signal(false);
  readonly creandoProducto = signal(false);
  readonly guardandoProducto = signal(false);
  readonly productoSeleccionado = signal<Producto | null>(null);

  readonly grupos = computed<GrupoCatalogo[]>(() =>
    this.categorias().map((categoria) => ({
      categoria,
      productos: this.productos().filter((producto) => producto.categoriaId === categoria.id),
    })),
  );

  constructor() {
    this.cargarCategorias();
    this.cargarProductos();
  }

  onCrearCategoria(input: CrearCategoriaInput): void {
    this.creandoCategoria.set(true);
    this.catalogoService.crearCategoria(input).subscribe({
      next: () => {
        this.creandoCategoria.set(false);
        this.notificacionService.exito(`Categoría "${input.nombre}" creada`);
        this.cargarCategorias();
      },
      error: (error) => {
        this.creandoCategoria.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo crear la categoría');
      },
    });
  }

  onEliminarCategoria(id: string): void {
    this.catalogoService.eliminarCategoria(id).subscribe({
      next: () => {
        this.notificacionService.exito('Categoría eliminada');
        this.cargarCategorias();
      },
      error: (error) => {
        this.notificacionService.error(error?.error?.message ?? 'No se pudo eliminar la categoría');
      },
    });
  }

  onCrearProducto(input: CrearProductoInput): void {
    this.creandoProducto.set(true);
    this.catalogoService.crearProducto(input).subscribe({
      next: () => {
        this.creandoProducto.set(false);
        this.notificacionService.exito(`Producto "${input.nombre}" creado`);
        this.cargarProductos();
      },
      error: (error) => {
        this.creandoProducto.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo crear el producto');
      },
    });
  }

  onEliminarProducto(id: string): void {
    this.catalogoService.eliminarProducto(id).subscribe({
      next: () => {
        this.notificacionService.exito('Producto eliminado');
        this.cargarProductos();
      },
      error: (error) => {
        this.notificacionService.error(error?.error?.message ?? 'No se pudo eliminar el producto');
      },
    });
  }

  onEditarProducto(producto: Producto): void {
    this.productoSeleccionado.set(producto);
  }

  onCerrarModal(): void {
    this.productoSeleccionado.set(null);
  }

  onGuardarProducto(id: string, input: ActualizarProductoInput): void {
    this.guardandoProducto.set(true);
    this.catalogoService.actualizarProducto(id, input).subscribe({
      next: () => {
        this.guardandoProducto.set(false);
        this.productoSeleccionado.set(null);
        this.notificacionService.exito('Producto actualizado');
        this.cargarProductos();
      },
      error: (error) => {
        this.guardandoProducto.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo actualizar el producto');
      },
    });
  }

  private cargarCategorias(): void {
    this.catalogoService.listarCategorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
    });
  }

  private cargarProductos(): void {
    this.catalogoService.listarProductos().subscribe({
      next: (productos) => this.productos.set(productos),
    });
  }
}
