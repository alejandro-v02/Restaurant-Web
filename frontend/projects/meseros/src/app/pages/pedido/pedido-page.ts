import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogoService } from '../../core/catalogo/catalogo.service';
import { Categoria, Producto } from '../../core/catalogo/catalogo.models';
import { PedidoService } from '../../core/pedidos/pedido.service';
import { Pedido, PedidoItem } from '../../core/pedidos/pedido.models';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { InputAtom } from '../../ui/atoms/input/input';

@Component({
  selector: 'app-pedido-page',
  standalone: true,
  imports: [FormsModule, ButtonAtom, InputAtom],
  templateUrl: './pedido-page.html',
})
export class PedidoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogoService = inject(CatalogoService);
  private readonly pedidoService = inject(PedidoService);

  readonly mesaId = this.route.snapshot.paramMap.get('mesaId')!;
  readonly numero = this.route.snapshot.queryParamMap.get('numero') ?? '';

  readonly categorias = signal<Categoria[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly categoriaActivaId = signal<string | null>(null);
  readonly pedido = signal<Pedido | null>(null);
  readonly items = signal<PedidoItem[]>([]);
  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly procesandoProductoId = signal<string | null>(null);
  readonly errorMensaje = signal<string | null>(null);
  readonly notasDraft = signal<Record<string, string>>({});

  readonly productosDeCategoria = computed(() => {
    const catId = this.categoriaActivaId();
    return this.productos().filter((producto) => producto.categoriaId === catId && producto.disponible);
  });

  readonly total = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0),
  );

  constructor() {
    this.cargarTodo();
  }

  nombreProducto(productoId: string): string {
    return this.productos().find((producto) => producto.id === productoId)?.nombre ?? '—';
  }

  itemPorProducto(productoId: string): PedidoItem | undefined {
    return this.items().find((item) => item.productoId === productoId);
  }

  cantidadDe(productoId: string): number {
    return this.itemPorProducto(productoId)?.cantidad ?? 0;
  }

  notaDe(productoId: string): string {
    return this.notasDraft()[productoId] ?? this.itemPorProducto(productoId)?.notas ?? '';
  }

  onElegirCategoria(id: string): void {
    this.categoriaActivaId.set(id);
  }

  onIncrementar(producto: Producto): void {
    const pedido = this.pedido();
    if (!pedido || this.procesandoProductoId()) {
      return;
    }
    const item = this.itemPorProducto(producto.id);
    this.procesandoProductoId.set(producto.id);
    this.errorMensaje.set(null);

    const observable = item
      ? this.pedidoService.actualizarItem(item.id, { cantidad: item.cantidad + 1 })
      : this.pedidoService.agregarItem(pedido.id, { productoId: producto.id, cantidad: 1 });

    observable.subscribe({
      next: (itemActualizado) => {
        this.procesandoProductoId.set(null);
        this.reemplazarItem(itemActualizado);
      },
      error: (error) => {
        this.procesandoProductoId.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo agregar el producto');
      },
    });
  }

  onDecrementar(producto: Producto): void {
    const item = this.itemPorProducto(producto.id);
    if (!item || this.procesandoProductoId()) {
      return;
    }
    this.procesandoProductoId.set(producto.id);
    this.errorMensaje.set(null);

    if (item.cantidad <= 1) {
      this.pedidoService.eliminarItem(item.id).subscribe({
        next: () => {
          this.procesandoProductoId.set(null);
          this.items.update((items) => items.filter((existente) => existente.id !== item.id));
        },
        error: (error) => {
          this.procesandoProductoId.set(null);
          this.errorMensaje.set(error?.error?.message ?? 'No se pudo quitar el producto');
        },
      });
      return;
    }

    this.pedidoService.actualizarItem(item.id, { cantidad: item.cantidad - 1 }).subscribe({
      next: (itemActualizado) => {
        this.procesandoProductoId.set(null);
        this.reemplazarItem(itemActualizado);
      },
      error: (error) => {
        this.procesandoProductoId.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo actualizar la cantidad');
      },
    });
  }

  onNotaInput(productoId: string, valor: string): void {
    this.notasDraft.update((draft) => ({ ...draft, [productoId]: valor }));
  }

  onGuardarNota(producto: Producto): void {
    const item = this.itemPorProducto(producto.id);
    const valor = this.notasDraft()[producto.id];
    if (!item || valor === undefined || valor === (item.notas ?? '')) {
      return;
    }
    this.pedidoService.actualizarItem(item.id, { notas: valor }).subscribe({
      next: (itemActualizado) => this.reemplazarItem(itemActualizado),
      error: (error) => {
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo guardar la nota');
      },
    });
  }

  onEnviarCocina(): void {
    const pedido = this.pedido();
    if (!pedido) {
      return;
    }
    this.enviando.set(true);
    this.errorMensaje.set(null);
    this.pedidoService.enviar(pedido.id).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.enviando.set(false);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo enviar a cocina');
      },
    });
  }

  onVolver(): void {
    this.router.navigateByUrl('/');
  }

  private reemplazarItem(item: PedidoItem): void {
    this.items.update((items) => {
      const existe = items.some((actual) => actual.id === item.id);
      return existe ? items.map((actual) => (actual.id === item.id ? item : actual)) : [...items, item];
    });
  }

  private cargarTodo(): void {
    this.cargando.set(true);
    forkJoin({
      categorias: this.catalogoService.listarCategorias(),
      productos: this.catalogoService.listarProductos(),
      activo: this.pedidoService.obtenerPorMesa(this.mesaId),
    }).subscribe({
      next: ({ categorias, productos, activo }) => {
        this.categorias.set(categorias);
        this.productos.set(productos);
        this.categoriaActivaId.set(categorias[0]?.id ?? null);
        if (activo) {
          this.pedido.set(activo.pedido);
          this.items.set(activo.items);
        } else {
          this.errorMensaje.set('No hay un pedido abierto para esta mesa');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('No se pudo cargar la información');
      },
    });
  }
}
