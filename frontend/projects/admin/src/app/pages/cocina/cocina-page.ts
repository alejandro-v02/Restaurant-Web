import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CocinaService } from '../../core/cocina/cocina.service';
import { EstadoPedidoItem, ItemCocina } from '../../core/cocina/cocina.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { ButtonAtom } from '../../ui/atoms/button/button';

export interface GrupoCocina {
  mesaNumero: number;
  items: ItemCocina[];
}

const INTERVALO_ACTUALIZACION_MS = 8000;

const SIGUIENTE_ESTADO: Partial<Record<EstadoPedidoItem, EstadoPedidoItem>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
  LISTO: 'ENTREGADO',
};

const ETIQUETA_BOTON: Partial<Record<EstadoPedidoItem, string>> = {
  PENDIENTE: 'Empezar',
  EN_PREPARACION: 'Marcar listo',
  LISTO: 'Entregado',
};

@Component({
  selector: 'app-cocina-page',
  standalone: true,
  imports: [ButtonAtom],
  templateUrl: './cocina-page.html',
})
export class CocinaPage implements OnDestroy {
  private readonly cocinaService = inject(CocinaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly items = signal<ItemCocina[]>([]);
  readonly cargando = signal(true);
  readonly procesandoId = signal<string | null>(null);

  private readonly intervalo = setInterval(() => this.cargar(), INTERVALO_ACTUALIZACION_MS);

  readonly grupos = computed<GrupoCocina[]>(() => {
    const mapa = new Map<number, ItemCocina[]>();
    for (const item of this.items()) {
      const lista = mapa.get(item.mesaNumero) ?? [];
      lista.push(item);
      mapa.set(item.mesaNumero, lista);
    }
    return [...mapa.entries()]
      .map(([mesaNumero, items]) => ({ mesaNumero, items }))
      .sort((a, b) => a.mesaNumero - b.mesaNumero);
  });

  constructor() {
    this.cargar();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  etiquetaBoton(estado: EstadoPedidoItem): string {
    return ETIQUETA_BOTON[estado] ?? 'Actualizar';
  }

  onAvanzar(item: ItemCocina): void {
    const siguiente = SIGUIENTE_ESTADO[item.estado];
    if (!siguiente) {
      return;
    }
    this.procesandoId.set(item.itemId);
    this.cocinaService.actualizarEstado(item.itemId, siguiente).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.cargar();
      },
      error: (error) => {
        this.procesandoId.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo actualizar el ítem');
      },
    });
  }

  private cargar(): void {
    this.cocinaService.listarItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }
}
