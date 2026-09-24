import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './button.html',
})
export class ButtonAtom {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);
  readonly pressed = output<void>();

  onClick(): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    this.pressed.emit();
  }
}
