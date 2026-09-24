import { Component, input, output } from '@angular/core';
import { ButtonAtom } from '../../atoms/button/button';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [ButtonAtom],
  templateUrl: './modal.html',
})
export class ModalOrganism {
  readonly titulo = input<string>('');
  readonly cerrar = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit();
    }
  }
}
