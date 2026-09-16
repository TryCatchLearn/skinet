import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  imports: [MatCard, MatCardContent, CurrencyPipe, MatCardActions, MatButton, MatIcon, RouterLink],
  selector: 'app-product-item',
  styleUrl: './product-item.css',
  templateUrl: './product-item.html',
})
export class ProductItem {
  public product = input.required<Product>();
  protected cartService = inject(CartService);
}
