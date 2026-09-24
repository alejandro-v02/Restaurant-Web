import { Component, computed, inject, signal } from '@angular/core';
import { MesaService } from '../../core/mesas/mesa.service';
import { Mesa } from '../../core/mesas/mesa.models';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonAtom } from '../../ui/atoms/button/button';

@Component({
  selector: 'app-mesas-page',
  standalone: true,
  imports: [ButtonAtom],
  templateUrl: './mesas-page.html',
})
export class MesasPage {
  private readonly mesaService = inject(MesaService);
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;
  readonly mesas = signal<Mesa[]>([]);
  readonly cargando = signal(true);
  readonly procesando = signal<string | null>(null);
  readonly errorMensaje = signal<string | null>(null);

  readonly misMesas = computed(() =>
    this.mesas().filter((mesa) => mesa.meseroId === this.usuario()?.id),
  );

  readonly mesasLibres = computed(() =>
    this.mesas().filter((mesa) => mesa.estado === 'LIBRE' && !mesa.meseroId),
  );

  readonly mesasDeOtros = computed(() =>
    this.mesas().filter((mesa) => mesa.meseroId && mesa.meseroId !== this.usuario()?.id),
  );

  constructor() {
    this.cargarMesas();
  }

  onTomar(mesa: Mesa): void {
    this.procesando.set(mesa.id);
    this.errorMensaje.set(null);
    this.mesaService.tomar(mesa.id).subscribe({
      next: () => {
        this.procesando.set(null);
        this.cargarMesas();
      },
      error: (error) => {
        this.procesando.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo tomar la mesa');
      },
    });
  }

  onLiberar(mesa: Mesa): void {
    this.procesando.set(mesa.id);
    this.errorMensaje.set(null);
    this.mesaService.liberar(mesa.id).subscribe({
      next: () => {
        this.procesando.set(null);
        this.cargarMesas();
      },
      error: (error) => {
        this.procesando.set(null);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo liberar la mesa');
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  private cargarMesas(): void {
    this.cargando.set(true);
    this.mesaService.listar().subscribe({
      next: (mesas) => {
        this.mesas.set(mesas);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('No se pudieron cargar las mesas');
      },
    });
  }
}
