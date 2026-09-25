import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogoService } from '../../core/catalogo/catalogo.service';
import { Categoria, Producto } from '../../core/catalogo/catalogo.models';
import { PedidoService } from '../../core/pedidos/pedido.service';
import { Pedido, PedidoItem } from '../../core/pedidos/pedido.models';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { InputAtom } from '../../ui/atoms/input/input';

const INTERVALO_ACTUALIZACION_MS = 8000;

@Component({
  selector: 'app-pedido-page',
  standalone: true,
  imports: [FormsModule, ButtonAtom, InputAtom],
  templateUrl: './pedido-page.html',
})
export class PedidoPage implements OnDestroy {
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
  readonly confirmadoProductoId = signal<string | null>(null);
  readonly entregandoItemId = signal<string | null>(null);
  readonly cantidadEntregarDraft = signal<Record<string, number>>({});
  private confirmacionTimeout?: ReturnType<typeof setTimeout>;
  private readonly intervalo = setInterval(
    () => this.refrescarItems(),
    INTERVALO_ACTUALIZACION_MS,
  );

  readonly productosDeCategoria = computed(() => {
    const catId = this.categoriaActivaId();
    return this.productos().filter((producto) => producto.categoriaId === catId && producto.disponible);
  });

  readonly itemsValidos = computed(() =>
    this.items().filter(
      (item) =>
        !!item.productoId &&
        Number.isFinite(item.cantidad) &&
        item.cantidad > 0 &&
        Number.isFinite(item.precioUnitario),
    ),
  );

  readonly total = computed(() =>
    this.itemsValidos().reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0),
  );

  constructor() {
    this.cargarTodo();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
    if (this.confirmacionTimeout) {
      clearTimeout(this.confirmacionTimeout);
    }
  }

  nombreProducto(productoId: string): string {
    return this.productos().find((producto) => producto.id === productoId)?.nombre ?? '—';
  }

  itemPorProducto(productoId: string): PedidoItem | undefined {
    return this.itemsValidos().find((item) => item.productoId === productoId);
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
        this.mostrarConfirmacion(producto.id);
      },
      error: (error) => {
        this.procesandoProductoId.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo agregar el producto');
      },
    });
  }

  private mostrarConfirmacion(productoId: string): void {
    this.confirmadoProductoId.set(productoId);
    if (this.confirmacionTimeout) {
      clearTimeout(this.confirmacionTimeout);
    }
    this.confirmacionTimeout = setTimeout(() => this.confirmadoProductoId.set(null), 1200);
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

  cantidadEntregarDe(item: PedidoItem): number {
    return this.cantidadEntregarDraft()[item.id] ?? item.cantidad;
  }

  onAjustarCantidadEntregar(item: PedidoItem, delta: number): void {
    const actual = this.cantidadEntregarDe(item);
    const nuevo = Math.min(item.cantidad, Math.max(1, actual + delta));
    this.cantidadEntregarDraft.update((draft) => ({ ...draft, [item.id]: nuevo }));
  }

  onEntregarItem(item: PedidoItem): void {
    if (this.entregandoItemId()) {
      return;
    }
    const cantidad = this.cantidadEntregarDe(item);
    this.entregandoItemId.set(item.id);
    this.errorMensaje.set(null);
    this.pedidoService.entregarItem(item.id, cantidad).subscribe({
      next: () => {
        this.entregandoItemId.set(null);
        this.cantidadEntregarDraft.update((draft) => {
          const { [item.id]: _quitado, ...resto } = draft;
          return resto;
        });
        this.actualizarDesdeServidor();
      },
      error: (error) => {
        this.entregandoItemId.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo marcar como entregado');
      },
    });
  }

  private reemplazarItem(item: PedidoItem): void {
    this.items.update((items) => {
      const existe = items.some((actual) => actual.id === item.id);
      return existe ? items.map((actual) => (actual.id === item.id ? item : actual)) : [...items, item];
    });
  }

  private refrescarItems(): void {
    if (this.procesandoProductoId() || this.entregandoItemId()) {
      return;
    }
    this.actualizarDesdeServidor();
  }

  private actualizarDesdeServidor(): void {
    this.pedidoService.obtenerPorMesa(this.mesaId).subscribe({
      next: (activo) => {
        if (activo) {
          this.pedido.set(activo.pedido);
          this.items.set(activo.items);
        }
      },
      error: () => {
        // silencioso: no interrumpir al mesero por una actualización fallida
      },
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
