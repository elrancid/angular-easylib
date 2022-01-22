import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from './dialog.service';
import { MatButtonModule } from '@angular/material/button';
// import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [
    DialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ButtonModule,
    // MatDialog,
    // MatDialogRef,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    DialogService
  ],
  exports: [
    DialogComponent,
    ConfirmationDialogComponent,
    // MatDialogModule,
    // MatDialog,
    // MatDialogRef,
  ]
})
export class DialogModule { }
