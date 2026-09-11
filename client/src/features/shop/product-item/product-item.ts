import { Component, input } from '@angular/core';
import { Product } from '../../../core/product.model';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [MatCard, MatCardContent, CurrencyPipe, MatCardActions, MatButton, MatIcon],
  selector: 'app-product-item',
  styleUrl: './product-item.css',
  templateUrl: './product-item.html',
})
export class ProductItem {
  public product = input.required<Product>();
}
