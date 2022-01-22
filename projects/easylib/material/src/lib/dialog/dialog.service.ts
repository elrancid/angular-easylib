import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DialogComponent } from './dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogData } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public logs = true;

  constructor(public dialog: MatDialog) {}

  public openConfirmationDialog(data: ConfirmationDialogData): void {
    data = {
      cancel: 'Cancel',
      confirm: 'Confirm',
      ...data,
    };
    console.log('DialogService.openConfirmationDialog() data:', data);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: data.width || '250px',
      data,
    });
    console.log('DialogService.openConfirmationDialog() dialogRef:', dialogRef);
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed. result:', result);
    });
  }

  public openDialog(dialogComponent: ComponentType<unknown>, data: Record<string, any> = {}): void {
    const dialogRef = this.dialog.open(dialogComponent, {
      width: data['width'] || '250px',
      data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed. result:', result);
    });
  }

}
