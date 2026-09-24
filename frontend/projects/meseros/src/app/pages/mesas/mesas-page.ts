import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../core/mesas/mesa.service';
import { Mesa } from '../../core/mesas/mesa.models';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { InputAtom } from '../../ui/atoms/input/input';

type Vista = 'lista' | 'personas';

@Component({
  selector: 'app-mesas-page',
  standalone: true,
  imports: [FormsModule, ButtonAtom, InputAtom],
  templateUrl: './mesas-page.html',
})
export class MesasPage {
  private readonly mesaService = inject(MesaService);
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;
  readonly mesas = signal<Mesa[]>([]);
  readonly cargando = signal(true);
  readonly procesando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly vista = signal<Vista>('lista');
  readonly mesaSeleccionada = signal<Mesa | null>(null);
  readonly personas = signal('');

  readonly misMesas = computed(() =>
    this.mesas().filter((mesa) => mesa.meseroId === this.usuario()?.id),
  );

  constructor() {
    this.cargarMesas();
  }

  claseNumero(mesa: Mesa): string {
    if (mesa.meseroId === this.usuario()?.id) {
      return 'border-gray-900 font-semibold';
    }
    if (mesa.meseroId || mesa.estado !== 'LIBRE') {
      return 'border-gray-200 text-gray-300';
    }
    return 'border-gray-300';
  }

  onSeleccionarNumero(mesa: Mesa): void {
    const esMia = mesa.meseroId === this.usuario()?.id;
    const estaLibre = mesa.estado === 'LIBRE' && !mesa.meseroId;
    if (!esMia && !estaLibre) {
      return;
    }
    this.mesaSeleccionada.set(mesa);
    this.personas.set('');
    this.vista.set('personas');
  }

  onCancelar(): void {
    this.mesaSeleccionada.set(null);
    this.vista.set('lista');
  }

  onTomarPedido(): void {
    const mesa = this.mesaSeleccionada();
    if (!mesa) {
      return;
    }
    this.procesando.set(true);
    this.errorMensaje.set(null);
    this.mesaService.tomar(mesa.id).subscribe({
      next: () => {
        this.procesando.set(false);
        this.vista.set('lista');
        this.mesaSeleccionada.set(null);
        this.cargarMesas();
      },
      error: (error) => {
        this.procesando.set(false);
        this.errorMensaje.set(error?.error?.message ?? 'No se pudo tomar la mesa');
      },
    });
  }

  onLiberar(mesa: Mesa): void {
    this.procesando.set(true);
    this.errorMensaje.set(null);
    this.mesaService.liberar(mesa.id).subscribe({
      next: () => {
        this.procesando.set(false);
        this.cargarMesas();
      },
      error: (error) => {
        this.procesando.set(false);
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
