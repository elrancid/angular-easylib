import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'easy-log',
  template: `
    <p>
      log works!
    </p>
  `,
  styles: [
  ]
})
export class LogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
