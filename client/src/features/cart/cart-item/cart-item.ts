import { Component, inject, input } from '@angular/core';
import { Item } from '../../../core/models/cart.model';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [RouterLink, MatButton, MatIcon, MatIconButton, CurrencyPipe],
  selector: 'app-cart-item',
  styleUrl: './cart-item.css',
  templateUrl: './cart-item.html',
})
export class CartItem {
  item = input.required<Item>();
  protected cartService = inject(CartService);
}
