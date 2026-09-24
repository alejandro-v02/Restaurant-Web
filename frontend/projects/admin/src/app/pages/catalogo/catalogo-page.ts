import { Component, computed, inject, signal } from '@angular/core';
import {
  CatalogoService,
  CrearCategoriaInput,
  CrearProductoInput,
} from '../../core/catalogo/catalogo.service';
import { Categoria, Producto } from '../../core/catalogo/catalogo.models';
import { CategoriaFormOrganism } from '../../ui/organisms/categoria-form/categoria-form';
import { ProductoFormOrganism } from '../../ui/organisms/producto-form/producto-form';
import { ButtonAtom } from '../../ui/atoms/button/button';

export interface GrupoCatalogo {
  categoria: Categoria;
  productos: Producto[];
}

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [CategoriaFormOrganism, ProductoFormOrganism, ButtonAtom],
  templateUrl: './catalogo-page.html',
})
export class CatalogoPage {
  private readonly catalogoService = inject(CatalogoService);

  readonly categorias = signal<Categoria[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly creandoCategoria = signal(false);
  readonly creandoProducto = signal(false);
  readonly errorCategorias = signal<string | null>(null);
  readonly errorProductos = signal<string | null>(null);

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
    this.errorCategorias.set(null);
    this.catalogoService.crearCategoria(input).subscribe({
      next: () => {
        this.creandoCategoria.set(false);
        this.cargarCategorias();
      },
      error: () => {
        this.creandoCategoria.set(false);
        this.errorCategorias.set('No se pudo crear la categoría');
      },
    });
  }

  onEliminarCategoria(id: string): void {
    this.errorCategorias.set(null);
    this.catalogoService.eliminarCategoria(id).subscribe({
      next: () => this.cargarCategorias(),
      error: (error) => {
        this.errorCategorias.set(error?.error?.message ?? 'No se pudo eliminar la categoría');
      },
    });
  }

  onCrearProducto(input: CrearProductoInput): void {
    this.creandoProducto.set(true);
    this.errorProductos.set(null);
    this.catalogoService.crearProducto(input).subscribe({
      next: () => {
        this.creandoProducto.set(false);
        this.cargarProductos();
      },
      error: () => {
        this.creandoProducto.set(false);
        this.errorProductos.set('No se pudo crear el producto');
      },
    });
  }

  onEliminarProducto(id: string): void {
    this.errorProductos.set(null);
    this.catalogoService.eliminarProducto(id).subscribe({
      next: () => this.cargarProductos(),
      error: (error) => {
        this.errorProductos.set(error?.error?.message ?? 'No se pudo eliminar el producto');
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
