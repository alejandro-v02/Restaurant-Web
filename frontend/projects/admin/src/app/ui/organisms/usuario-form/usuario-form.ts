import { Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';
import { SelectAtom, SelectOption } from '../../atoms/select/select';
import { FormFieldMolecule } from '../../molecules/form-field/form-field';
import { CrearUsuarioInput } from '../../../core/usuarios/usuarios.service';
import { ROLES_USUARIO, RolUsuario } from '../../../core/usuarios/usuarios.models';

@Component({
  selector: 'ui-usuario-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom, SelectAtom, FormFieldMolecule],
  templateUrl: './usuario-form.html',
})
export class UsuarioFormOrganism {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly creado = output<CrearUsuarioInput>();

  readonly opcionesRol: SelectOption[] = ROLES_USUARIO;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    rol: ['MESERO' as RolUsuario, [Validators.required]],
    email: [''],
    password: [''],
    codigo: [''],
    pin: [''],
  });

  private readonly rolSeleccionado = toSignal(this.form.controls.rol.valueChanges, {
    initialValue: this.form.controls.rol.value,
  });

  readonly esMesero = computed(() => this.rolSeleccionado() === 'MESERO');

  onSubmit(): void {
    if (this.form.controls.nombre.invalid || this.form.controls.rol.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const input: CrearUsuarioInput = this.esMesero()
      ? { nombre: raw.nombre, rol: raw.rol, codigo: raw.codigo, pin: raw.pin }
      : { nombre: raw.nombre, rol: raw.rol, email: raw.email, password: raw.password };

    this.creado.emit(input);
    this.form.reset({ nombre: '', rol: 'MESERO', email: '', password: '', codigo: '', pin: '' });
  }
}
