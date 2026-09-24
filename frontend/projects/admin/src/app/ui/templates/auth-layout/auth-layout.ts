import { Component, input } from '@angular/core';
import { LogoAtom } from '../../atoms/logo/logo';

@Component({
  selector: 'ui-auth-layout',
  standalone: true,
  imports: [LogoAtom],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayoutTemplate {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
