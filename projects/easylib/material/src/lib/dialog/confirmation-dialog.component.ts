import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  width?: string,
  title?: string,
  description?: string,
  confirm?: string,
  cancel?: string,
}

@Component({
  selector: 'easy-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styles: [':host {display: block;}'],
  // styleUrls: ['./dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    console.log('DialogComponent.constructor() data:', this.data);
  }

  ngOnInit(): void {
    console.log('DialogComponent.ngOnInit() data:', this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
