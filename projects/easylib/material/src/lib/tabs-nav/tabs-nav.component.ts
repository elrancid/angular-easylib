import { Component, Input } from '@angular/core';
import { Links } from './tabs-nav.module';

@Component({
  selector: 'easy-tabs-nav',
  styles: [
    ':host { display: block; }',
  ],
  templateUrl: './tabs-nav.component.html',
})
export class TabsNavComponent {

  @Input() links!: Links;

  constructor() {}
}
