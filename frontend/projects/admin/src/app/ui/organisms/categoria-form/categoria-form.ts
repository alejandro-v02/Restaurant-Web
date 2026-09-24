import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';
import { FormFieldMolecule } from '../../molecules/form-field/form-field';
import { CrearCategoriaInput } from '../../../core/catalogo/catalogo.service';

@Component({
  selector: 'ui-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom, FormFieldMolecule],
  templateUrl: './categoria-form.html',
})
export class CategoriaFormOrganism {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly creada = output<CrearCategoriaInput>();

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.creada.emit(this.form.getRawValue());
    this.form.reset({ nombre: '' });
  }
}
