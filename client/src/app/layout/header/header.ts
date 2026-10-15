import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../../core/services/busy.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CartService } from '../../../core/services/cart.service';
import { AccountService } from '../../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { IsAdmin } from '../../../shared/directives/is-admin';

@Component({
  imports: [
    MatBadge,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatProgressSpinner,
    MatMenu,
    MatMenuItem,
    MatDivider,
    MatMenuTrigger,
    IsAdmin
],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected busyService = inject(BusyService);
  protected cartService = inject(CartService);
  protected accountService = inject(AccountService);
  private router = inject(Router);

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.userResource.set(undefined);
        void this.router.navigateByUrl('/');
      }
    })
  }
}
