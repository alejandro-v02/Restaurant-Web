import { Component, inject, signal } from '@angular/core';
import { CrearUsuarioInput, UsuariosService } from '../../core/usuarios/usuarios.service';
import { Usuario } from '../../core/usuarios/usuarios.models';
import { NotificacionService } from '../../core/notificaciones/notificacion.service';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioFormOrganism } from '../../ui/organisms/usuario-form/usuario-form';
import { ButtonAtom } from '../../ui/atoms/button/button';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [UsuarioFormOrganism, ButtonAtom],
  templateUrl: './usuarios-page.html',
})
export class UsuariosPage {
  private readonly usuariosService = inject(UsuariosService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly authService = inject(AuthService);

  readonly propioId = this.authService.usuario()?.id;

  readonly usuarios = signal<Usuario[]>([]);
  readonly cargando = signal(true);
  readonly creando = signal(false);
  readonly procesandoId = signal<string | null>(null);

  constructor() {
    this.cargarUsuarios();
  }

  onCrearUsuario(input: CrearUsuarioInput): void {
    this.creando.set(true);
    this.usuariosService.crear(input).subscribe({
      next: (usuario) => {
        this.creando.set(false);
        this.notificacionService.exito(`Usuario "${usuario.nombre}" creado`);
        this.cargarUsuarios();
      },
      error: (error) => {
        this.creando.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo crear el usuario');
      },
    });
  }

  onCambiarActivo(usuario: Usuario): void {
    if (this.procesandoId() || usuario.id === this.propioId) {
      return;
    }
    this.procesandoId.set(usuario.id);
    this.usuariosService.actualizar(usuario.id, { activo: !usuario.activo }).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.notificacionService.exito(usuario.activo ? 'Usuario desactivado' : 'Usuario activado');
        this.cargarUsuarios();
      },
      error: (error) => {
        this.procesandoId.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo actualizar el usuario');
      },
    });
  }

  onResetearClave(usuario: Usuario): void {
    if (this.procesandoId()) {
      return;
    }
    const esMesero = usuario.rol === 'MESERO';
    const valor = prompt(esMesero ? 'Nuevo PIN (mínimo 4 dígitos):' : 'Nueva contraseña (mínimo 8 caracteres):');
    if (!valor) {
      return;
    }
    this.procesandoId.set(usuario.id);
    const input = esMesero ? { pin: valor } : { password: valor };
    this.usuariosService.actualizar(usuario.id, input).subscribe({
      next: () => {
        this.procesandoId.set(null);
        this.notificacionService.exito(esMesero ? 'PIN actualizado' : 'Contraseña actualizada');
      },
      error: (error) => {
        this.procesandoId.set(null);
        this.notificacionService.error(error?.error?.message ?? 'No se pudo resetear la clave');
      },
    });
  }

  private cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuariosService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.notificacionService.error(error?.error?.message ?? 'No se pudieron cargar los usuarios');
      },
    });
  }
}
