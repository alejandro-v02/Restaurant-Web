import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom } from '../../atoms/button/button';
import { InputAtom } from '../../atoms/input/input';
import { SelectAtom, SelectOption } from '../../atoms/select/select';
import { CheckboxAtom } from '../../atoms/checkbox/checkbox';
import { FormFieldMolecule } from '../../molecules/form-field/form-field';
import { ActualizarProductoInput } from '../../../core/catalogo/catalogo.service';
import { Categoria, Producto, TIPOS_IMPUESTO, TipoImpuesto } from '../../../core/catalogo/catalogo.models';

@Component({
  selector: 'ui-producto-editar-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonAtom, InputAtom, SelectAtom, CheckboxAtom, FormFieldMolecule],
  templateUrl: './producto-editar-form.html',
})
export class ProductoEditarFormOrganism implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly producto = input.required<Producto>();
  readonly categorias = input.required<Categoria[]>();
  readonly loading = input(false);
  readonly guardado = output<ActualizarProductoInput>();

  readonly opcionesCategoria = computed<SelectOption[]>(() =>
    this.categorias().map((categoria) => ({ value: categoria.id, label: categoria.nombre })),
  );

  readonly opcionesTipoImpuesto: SelectOption[] = TIPOS_IMPUESTO;

  readonly form = this.fb.nonNullable.group({
    categoriaId: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    tipoImpuesto: ['EXCLUIDO' as TipoImpuesto, [Validators.required]],
    disponible: [true],
    enviarACocina: [true],
  });

  ngOnInit(): void {
    const producto = this.producto();
    this.form.patchValue({
      categoriaId: producto.categoriaId,
      nombre: producto.nombre,
      precio: String(producto.precio),
      tipoImpuesto: producto.tipoImpuesto,
      disponible: producto.disponible,
      enviarACocina: producto.enviarACocina,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.guardado.emit({
      categoriaId: raw.categoriaId,
      nombre: raw.nombre,
      precio: Number(raw.precio),
      tipoImpuesto: raw.tipoImpuesto,
      disponible: raw.disponible,
      enviarACocina: raw.enviarACocina,
    });
  }
}
