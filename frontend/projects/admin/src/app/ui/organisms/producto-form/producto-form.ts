import { Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';
import { SelectAtom, SelectOption } from '../../atoms/select/select';
import { FormFieldMolecule } from '../../molecules/form-field/form-field';
import { CrearProductoInput } from '../../../core/catalogo/catalogo.service';
import { Categoria, TIPOS_IMPUESTO, TipoImpuesto } from '../../../core/catalogo/catalogo.models';

@Component({
  selector: 'ui-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom, SelectAtom, FormFieldMolecule],
  templateUrl: './producto-form.html',
})
export class ProductoFormOrganism {
  private readonly fb = inject(FormBuilder);

  readonly categorias = input.required<Categoria[]>();
  readonly loading = input(false);
  readonly creado = output<CrearProductoInput>();

  readonly opcionesCategoria = computed<SelectOption[]>(() =>
    this.categorias().map((categoria) => ({ value: categoria.id, label: categoria.nombre })),
  );

  readonly opcionesTipoImpuesto: SelectOption[] = TIPOS_IMPUESTO;

  readonly form = this.fb.nonNullable.group({
    categoriaId: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    tipoImpuesto: ['IVA_19' as TipoImpuesto, [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.creado.emit({
      categoriaId: raw.categoriaId,
      nombre: raw.nombre,
      precio: Number(raw.precio),
      tipoImpuesto: raw.tipoImpuesto,
    });
    this.form.reset({ categoriaId: '', nombre: '', precio: '', tipoImpuesto: 'IVA_19' });
  }
}
