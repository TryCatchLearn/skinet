import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { form, min, FormField } from '@angular/forms/signals';

@Component({
  imports: [
    CurrencyPipe,
    MatAnchor,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatDivider,
    FormField,
    NgOptimizedImage
],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private baseUrl = environment.baseUrl;
  protected cartService = inject(CartService);
  id = input<string>();

  productResource = httpResource<Product>(() => this.id() 
    ? `${this.baseUrl}/products/${this.id()}` : undefined);

  quantityInCart = computed(() => {
    const product = this.productResource.value();
    if (!product) return 0;
    return this.cartService.cartResource.value()?.items
      .find(i => i.productId === product.id)?.quantity ?? 0
  });

  quantity = linkedSignal(() => this.quantityInCart() || 1);
  quantityField = form(this.quantity, p => {
    min(p, 0)
  });

  updateCart() {
    const product = this.productResource.value();
    if (!product) return;
    if (this.quantity() > this.quantityInCart()) {
      this.cartService.addItemToCart(product, (this.quantity() - this.quantityInCart()))
    } else {
      this.cartService.removeItemFromCart(product.id, (this.quantityInCart() - this.quantity()))
    }
  }
}
