import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileInputComponent } from './file-input.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [
    FileInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMatFileInputModule,
    MatFormFieldModule,
    // MatIconModule,
    // MatButtonModule,
    ButtonModule,
  ],
  exports: [
    FileInputComponent
  ]
})
export class FileInputModule { }
