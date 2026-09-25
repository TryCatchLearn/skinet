import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from './cart-item/cart-item';
import { OrderSummary } from '../orders/order-summary/order-summary';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { Router } from '@angular/router';

@Component({
  imports: [CartItem, OrderSummary, EmptyState],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  protected cartService = inject(CartService);
  private router = inject(Router);

  onAction() {
    void this.router.navigateByUrl('/shop');
  }
}
