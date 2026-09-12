import { inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class SnackbarService {
    private snackbar = inject(MatSnackBar);

    error(message: string) {
        this.snackbar.open(message, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
        })
    }
}
