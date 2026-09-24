import { Component } from '@angular/core';

@Component({
  selector: 'ui-logo',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1.5 text-lg">
      🔥 <strong>Ember</strong> Restaurant
    </span>
  `,
})
export class LogoAtom {}
