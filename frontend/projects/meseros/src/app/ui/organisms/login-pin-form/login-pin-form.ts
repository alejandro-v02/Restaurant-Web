import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';

export interface LoginPinCredentials {
  codigo: string;
  pin: string;
}

@Component({
  selector: 'ui-login-pin-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom],
  templateUrl: './login-pin-form.html',
})
export class LoginPinFormOrganism {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly submitted = output<LoginPinCredentials>();

  readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required]],
    pin: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
