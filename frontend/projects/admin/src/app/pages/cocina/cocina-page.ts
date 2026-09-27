import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CocinaService } from '../../core/cocina/cocina.service';
import { ItemCocina } from '../../core/cocina/cocina.models';

export interface GrupoPlato {
  key: string;
  productoNombre: string;
  cantidadTotal: number;
  primerMesero: string;
  primerTimestamp: string;
  notas: string[];
}

const INTERVALO_ACTUALIZACION_MS = 8000;

@Component({
  selector: 'app-cocina-page',
  standalone: true,
  imports: [],
  templateUrl: './cocina-page.html',
})
export class CocinaPage implements OnDestroy {
  private readonly cocinaService = inject(CocinaService);

  readonly items = signal<ItemCocina[]>([]);
  readonly cargando = signal(true);
  readonly errorConexion = signal(false);

  private readonly intervalo = setInterval(() => this.cargar(), INTERVALO_ACTUALIZACION_MS);

  readonly grupos = computed<GrupoPlato[]>(() => {
    const mapa = new Map<string, GrupoPlato>();

    for (const item of this.items()) {
      let grupo = mapa.get(item.productoNombre);
      if (!grupo) {
        grupo = {
          key: item.productoNombre,
          productoNombre: item.productoNombre,
          cantidadTotal: 0,
          primerMesero: item.meseroNombre,
          primerTimestamp: item.creadoEn,
          notas: [],
        };
        mapa.set(item.productoNombre, grupo);
      }

      grupo.cantidadTotal += item.cantidad;
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

  private cargar(): void {
    this.cocinaService.listarItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.errorConexion.set(false);
        this.cargando.set(false);
      },
      error: () => {
        this.errorConexion.set(true);
        this.cargando.set(false);
      },
    });
  }
}
