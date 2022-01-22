import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'easy-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
// export class SidenavComponent implements OnInit {
export class SidenavComponent {

  public opened = true;
  public autosize = false;

  @ViewChild(MatSidenav) private sidenav!: MatSidenav;

  constructor() {
    // setTimeout(() => {
    //   this.autosize = false;
    // }, 1000);
  }

  // ngOnInit(): void {
  //   setTimeout(() => {
  //     this.autosize = false;
  //   }, 1000);
  // }

  public open(): void {
    this.sidenav.open();
  }

  public close(): void {
    this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }

  public redraw(): void {
    this.autosize = true;
    setTimeout(() => {
      this.autosize = false;
    });
  }

}
