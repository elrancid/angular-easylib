import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'easy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() avatarClass?: string; // see https://material.angular.io/components/card/examples

  @Input() actions: boolean = false;

  @Input() imgSrc?: string;
  @Input() imgAlt?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
