import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatButton],
  selector: 'app-confirmation-dialog',
  styleUrl: './confirmation-dialog.css',
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  data = inject(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
