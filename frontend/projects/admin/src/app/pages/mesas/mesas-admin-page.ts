import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MesaService } from '../../core/mesas/mesa.service';
import { MesaDetallada } from '../../core/mesas/mesa.models';
import { PedidoService } from '../../core/pedidos/pedido.service';
import { UsuariosService } from '../../core/usuarios/usuarios.service';
import { Usuario } from '../../core/usuarios/usuarios.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { ButtonAtom } from '../../ui/atoms/button/button';
import { SelectAtom, SelectOption } from '../../ui/atoms/select/select';

@Component({
  selector: 'app-mesas-admin-page',
  standalone: true,
  imports: [FormsModule, ButtonAtom, SelectAtom],
  templateUrl: './mesas-admin-page.html',
})
export class MesasAdminPage {
  private readonly mesaService = inject(MesaService);
  private readonly pedidoService = inject(PedidoService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly notificacionService = inject(NotificacionService);

  readonly mesas = signal<MesaDetallada[]>([]);
  readonly meseros = signal<Usuario[]>([]);
  readonly cargando = signal(true);
  readonly procesandoId = signal<string | null>(null);

  readonly opcionesMesero = computed<SelectOption[]>(() => [
    { value: '', label: 'Sin asignar' },
    ...this.meseros().map((mesero) => ({ value: mesero.id, label: mesero.nombre })),
  ]);

  constructor() {
    this.cargarTodo();
  }

  onReasignar(mesa: MesaDetallada, meseroId: string): void {
    if (this.procesandoId()) {
      return;
    }
    if (mesa.estado !== 'LIBRE' && mesa.meseroId !== meseroId) {
      const continuar = confirm(
        `La mesa ${mesa.numero} ya está ocupada. Si tiene un pedido en curso, va a seguir a nombre del mesero anterior. ¿Reasignar de todos modos?`,
      );
      if (!continuar) {
        return;
      }
    }
    this.procesandoId.set(mesa.id);
    this.mesaService.asignarMesero(mesa.id, meseroId || null).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.notificacionService.exito(`Mesa ${mesa.numero} actualizada`);
        this.cargarMesas();
      },
      error: (error) => {
        this.procesandoId.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo reasignar la mesa');
      },
    });
  }

  onLiberar(mesa: MesaDetallada): void {
    if (this.procesandoId()) {
      return;
    }
    this.procesandoId.set(mesa.id);
    this.pedidoService.cerrarPedidoActivo(mesa.id).subscribe({
      next: () => {
        this.mesaService.liberar(mesa.id).subscribe({
          next: () => {
            this.procesandoId.set(null);
            this.notificacionService.exito(`Mesa ${mesa.numero} liberada`);
            this.cargarMesas();
          },
          error: (error) => {
            this.procesandoId.set(null);
            this.notificacionService.error(error?.error?.message ?? 'No se pudo liberar la mesa');
          },
        });
      },
      error: (error) => {
        this.procesandoId.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo cerrar el pedido');
      },
    });
  }

  private cargarTodo(): void {
    this.cargando.set(true);
    this.usuariosService.listar().subscribe({
      next: (usuarios) => {
        this.meseros.set(usuarios.filter((usuario) => usuario.rol === 'MESERO' && usuario.activo));
        this.cargarMesas();
      },
      error: () => this.cargarMesas(),
    });
  }

  private cargarMesas(): void {
    this.mesaService.listarDetallado().subscribe({
      next: (mesas) => {
        this.mesas.set(mesas);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudieron cargar las mesas');
      },
    });
  }
}
