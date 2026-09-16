import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from './cart-item/cart-item';
import { OrderSummary } from '../orders/order-summary/order-summary';

@Component({
  imports: [CartItem, OrderSummary],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  protected cartService = inject(CartService);
}
