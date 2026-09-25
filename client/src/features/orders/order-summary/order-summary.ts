import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe, Location } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [CurrencyPipe, MatButton, RouterLink, MatFormField, MatLabel, MatInput],
  selector: 'app-order-summary',
  styleUrl: './order-summary.css',
  templateUrl: './order-summary.html',
})
export class OrderSummary {
  protected cartService = inject(CartService);
  protected location = inject(Location);
  private router = inject(Router);
  loading = signal(false);

  async onCheckout() {
    this.loading.set(true);
    await this.router.navigateByUrl('/checkout');
    this.loading.set(false);
  }
}
