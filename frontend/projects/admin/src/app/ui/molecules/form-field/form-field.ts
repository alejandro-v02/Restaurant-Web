import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-form-field',
  standalone: true,
  templateUrl: './form-field.html',
})
export class FormFieldMolecule {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly errorMessage = input<string | null>(null);
}
