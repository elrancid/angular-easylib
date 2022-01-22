import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title?: string,
  description?: string,
  confirm?: string,
  cancel?: string,
}

@Component({
  selector: 'easy-dialog',
  templateUrl: './dialog.component.html',
  styles: [],
  // styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    console.log('DialogComponent.ngOnInit() data:', this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
