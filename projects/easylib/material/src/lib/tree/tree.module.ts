import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { TreeComponent } from './tree.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TreeComponent,
  ],
  imports: [
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    TreeComponent,
  ]
})
export class TreeModule { }
