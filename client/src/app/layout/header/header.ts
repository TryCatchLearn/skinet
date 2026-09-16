import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../../core/services/busy.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [MatBadge, MatIcon, MatButton, RouterLink, RouterLinkActive, MatProgressSpinner],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected busyService = inject(BusyService);
  protected cartService = inject(CartService);
}
