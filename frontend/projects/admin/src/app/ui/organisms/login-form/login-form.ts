import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';
import { FormFieldMolecule } from '../../molecules/form-field/form-field';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'ui-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom, FormFieldMolecule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginFormOrganism {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly submitted = output<LoginCredentials>();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || control.valid) {
      return null;
    }
    if (control.hasError('required')) {
      return 'El correo es obligatorio';
    }
    if (control.hasError('email')) {
      return 'Ingresa un correo válido';
    }
    return null;
  }

  get passwordError(): string | null {
    const control = this.form.controls.password;
    if (!control.touched || control.valid) {
      return null;
    }
    return 'La contraseña es obligatoria';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
