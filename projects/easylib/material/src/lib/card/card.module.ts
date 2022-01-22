import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card.component';


@NgModule({
  declarations: [
    CardComponent,
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    MatCardModule,
  ],
  exports: [
    CardComponent,
  ]
})
export class CardModule { }
