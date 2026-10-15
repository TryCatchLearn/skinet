import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';
import { firstValueFrom } from 'rxjs';

@Service()
export class DialogService {
    private dialog = inject(MatDialog);

    confirm(title: string, message: string) {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            width: '400px',
            data: {title, message}
        });

        return firstValueFrom(dialogRef.afterClosed());
    }
}
