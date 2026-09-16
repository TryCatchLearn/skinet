import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
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
}
