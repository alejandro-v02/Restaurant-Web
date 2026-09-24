import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogoService } from '../../core/catalogo/catalogo.service';
import { Categoria, Producto } from '../../core/catalogo/catalogo.models';
import { AgregarItemInput, PedidoService } from '../../core/pedidos/pedido.service';
import { Pedido, PedidoItem } from '../../core/pedidos/pedido.models';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { InputAtom } from '../../ui/atoms/input/input';

type Vista = 'menu' | 'cantidad';

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
  readonly agregando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly vista = signal<Vista>('menu');
  readonly productoSeleccionado = signal<Producto | null>(null);
  readonly cantidad = signal('1');
  readonly notas = signal('');

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

  onElegirCategoria(id: string): void {
    this.categoriaActivaId.set(id);
  }

  onSeleccionarProducto(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    this.cantidad.set('1');
    this.notas.set('');
    this.vista.set('cantidad');
  }

  onCancelarCantidad(): void {
    this.productoSeleccionado.set(null);
    this.vista.set('menu');
  }

  onAgregar(): void {
    const producto = this.productoSeleccionado();
    const pedido = this.pedido();
    if (!producto || !pedido) {
      return;
    }

    const input: AgregarItemInput = {
      productoId: producto.id,
      cantidad: Number(this.cantidad()),
      notas: this.notas() || undefined,
    };

    this.agregando.set(true);
    this.pedidoService.agregarItem(pedido.id, input).subscribe({
      next: (item) => {
        this.agregando.set(false);
        this.items.update((items) => [...items, item]);
        this.vista.set('menu');
        this.productoSeleccionado.set(null);
      },
      error: (error) => {
        this.agregando.set(false);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo agregar el producto');
      },
    });
  }

  onQuitarItem(item: PedidoItem): void {
    this.errorMensaje.set(null);
    this.pedidoService.eliminarItem(item.id).subscribe({
      next: () => this.items.update((items) => items.filter((existente) => existente.id !== item.id)),
      error: (error) => {
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo quitar el producto');
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
      next: (pedidoActualizado) => {
        this.enviando.set(false);
        this.pedido.set(pedidoActualizado);
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
