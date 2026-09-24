import { Component } from '@angular/core';

@Component({
  selector: 'ui-logo',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1.5 text-lg text-slate-800">
      🔥 <strong class="text-orange-600">Ember</strong> Restaurant
    </span>
  `,
})
export class LogoAtom {}
