import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../core/caja/caja.service';
import { METODOS_PAGO, MetodoPago, PedidoCaja, Turno } from '../../core/caja/caja.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { InputAtom } from '../../ui/atoms/input/input';
import { SelectAtom, SelectOption } from '../../ui/atoms/select/select';

const INTERVALO_ACTUALIZACION_MS = 8000;

@Component({
  selector: 'app-caja-page',
  standalone: true,
  imports: [FormsModule, ButtonAtom, InputAtom, SelectAtom],
  templateUrl: './caja-page.html',
})
export class CajaPage implements OnDestroy {
  private readonly cajaService = inject(CajaService);
  private readonly notificacionService = inject(NotificacionService);

  readonly opcionesMetodo: SelectOption[] = METODOS_PAGO;

  readonly turno = signal<Turno | null>(null);
  readonly pedidos = signal<PedidoCaja[]>([]);
  readonly cargando = signal(true);

  readonly montoApertura = signal('');
  readonly procesandoAbrir = signal(false);

  readonly mostrarCerrar = signal(false);
  readonly montoCierre = signal('');
  readonly procesandoCerrar = signal(false);

  readonly pedidoCobrandoId = signal<string | null>(null);
  readonly metodoSeleccionado = signal<MetodoPago>('EFECTIVO');
  readonly propina = signal('');
  readonly procesandoCobro = signal<string | null>(null);

  private readonly intervalo = setInterval(() => this.cargarPedidos(), INTERVALO_ACTUALIZACION_MS);
  private ultimoIntentoFallo = false;

  constructor() {
    this.cargarTodo();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  onAbrirTurno(): void {
    const monto = Number(this.montoApertura());
    if (Number.isNaN(monto) || monto < 0) {
      return;
    }
    this.procesandoAbrir.set(true);
    this.cajaService.abrirTurno(monto).subscribe({
      next: (turno) => {
        this.procesandoAbrir.set(false);
        this.turno.set(turno);
        this.montoApertura.set('');
        this.cargarPedidos();
      },
      error: (error) => {
        this.procesandoAbrir.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo abrir el turno');
      },
    });
  }

  onMostrarCerrar(): void {
    this.montoCierre.set('');
    this.mostrarCerrar.set(true);
  }

  onCancelarCerrar(): void {
    this.mostrarCerrar.set(false);
  }

  onCerrarTurno(): void {
    const turno = this.turno();
    const monto = Number(this.montoCierre());
    if (!turno || Number.isNaN(monto) || monto < 0) {
      return;
    }
    this.procesandoCerrar.set(true);
    this.cajaService.cerrarTurno(turno.id, monto).subscribe({
      next: () => {
        this.procesandoCerrar.set(false);
        this.mostrarCerrar.set(false);
        this.turno.set(null);
        this.pedidos.set([]);
      },
      error: (error) => {
        this.procesandoCerrar.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo cerrar el turno');
      },
    });
  }

  onAbrirCobro(pedido: PedidoCaja): void {
    this.pedidoCobrandoId.set(pedido.pedidoId);
    this.metodoSeleccionado.set('EFECTIVO');
    this.propina.set('');
  }

  onCancelarCobro(): void {
    this.pedidoCobrandoId.set(null);
  }

  onConfirmarCobro(pedido: PedidoCaja): void {
    const propinaValor = this.propina() ? Number(this.propina()) : undefined;
    if (propinaValor !== undefined && Number.isNaN(propinaValor)) {
      return;
    }
    this.procesandoCobro.set(pedido.pedidoId);
    this.cajaService
      .cobrar(pedido.pedidoId, { metodo: this.metodoSeleccionado(), propina: propinaValor })
      .subscribe({
        next: () => {
          this.procesandoCobro.set(null);
          this.pedidoCobrandoId.set(null);
          this.pedidos.update((actuales) =>
            actuales.filter((actual) => actual.pedidoId !== pedido.pedidoId),
          );
          this.notificacionService.exito(`Mesa ${pedido.mesaNumero} cobrada`);
        },
        error: (error) => {
          this.procesandoCobro.set(null);
          this.notificacionService.error(error?.error?.message ?? 'No se pudo cobrar el pedido');
        },
      });
  }

  private cargarTodo(): void {
    this.cargando.set(true);
    this.cajaService.turnoActivo().subscribe({
      next: (turno) => {
        this.turno.set(turno);
        if (turno) {
          this.cargarPedidos(() => this.cargando.set(false));
        } else {
          this.cargando.set(false);
        }
      },
      error: (error) => {
        this.cargando.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo cargar el turno de caja');
      },
    });
  }

  private cargarPedidos(alTerminar?: () => void): void {
    if (!this.turno()) {
      return;
    }
    this.cajaService.listarPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.ultimoIntentoFallo = false;
        alTerminar?.();
      },
      error: (error) => {
        alTerminar?.();
        if (!this.ultimoIntentoFallo) {
          this.ultimoIntentoFallo = true;
          this.notificacionService.error(
            error?.error?.message ?? 'No se pudieron cargar los pedidos para cobrar',
          );
        }
      },
    });
  }
}
