import { Component, input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Product } from '../../../core/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  imports: [
    CurrencyPipe,
    MatAnchor,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatDivider
  ],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private baseUrl = environment.baseUrl;
  id = input<string>();

  productResource = httpResource<Product>(() => this.id() 
    ? `${this.baseUrl}/products/${this.id()}` : undefined)
}
