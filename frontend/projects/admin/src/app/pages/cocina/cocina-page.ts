import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CocinaService } from '../../core/cocina/cocina.service';
import { EstadoPedidoItem, ItemCocina } from '../../core/cocina/cocina.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { ButtonAtom } from '../../ui/atoms/button/button';

export interface GrupoPlato {
  key: string;
  productoNombre: string;
  estado: EstadoPedidoItem;
  cantidadTotal: number;
  primerMesero: string;
  primerTimestamp: string;
  notas: string[];
  items: ItemCocina[];
}

const INTERVALO_ACTUALIZACION_MS = 8000;

const SIGUIENTE_ESTADO: Partial<Record<EstadoPedidoItem, EstadoPedidoItem>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
};

const ETIQUETA_BOTON: Partial<Record<EstadoPedidoItem, string>> = {
  PENDIENTE: 'Empezar',
  EN_PREPARACION: 'Marcar listo',
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
  readonly procesandoKey = signal<string | null>(null);

  private readonly intervalo = setInterval(() => this.cargar(), INTERVALO_ACTUALIZACION_MS);

  readonly grupos = computed<GrupoPlato[]>(() => {
    const mapa = new Map<string, GrupoPlato>();

    for (const item of this.items()) {
      const key = `${item.productoNombre}__${item.estado}`;
      let grupo = mapa.get(key);
      if (!grupo) {
        grupo = {
          key,
          productoNombre: item.productoNombre,
          estado: item.estado,
          cantidadTotal: 0,
          primerMesero: item.meseroNombre,
          primerTimestamp: item.creadoEn,
          notas: [],
          items: [],
        };
        mapa.set(key, grupo);
      }

      grupo.cantidadTotal += item.cantidad;
      grupo.items.push(item);
      if (item.notas) {
        grupo.notas.push(item.notas);
      }
      if (new Date(item.creadoEn) < new Date(grupo.primerTimestamp)) {
        grupo.primerTimestamp = item.creadoEn;
        grupo.primerMesero = item.meseroNombre;
      }
    }

    return [...mapa.values()].sort(
      (a, b) => new Date(a.primerTimestamp).getTime() - new Date(b.primerTimestamp).getTime(),
    );
  });

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  constructor() {
    this.cargar();
  }

  etiquetaBoton(estado: EstadoPedidoItem): string {
    return ETIQUETA_BOTON[estado] ?? 'Actualizar';
  }

  tieneSiguiente(estado: EstadoPedidoItem): boolean {
    return !!SIGUIENTE_ESTADO[estado];
  }

  onAvanzarGrupo(grupo: GrupoPlato): void {
    const siguiente = SIGUIENTE_ESTADO[grupo.estado];
    if (!siguiente) {
      return;
    }
    this.procesandoKey.set(grupo.key);
    forkJoin(
      grupo.items.map((item) => this.cocinaService.actualizarEstado(item.itemId, siguiente)),
    ).subscribe({
      next: () => {
        this.procesandoKey.set(null);
        this.cargar();
      },
      error: (error) => {
        this.procesandoKey.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo actualizar el plato');
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
