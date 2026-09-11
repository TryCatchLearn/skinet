import { Component, signal } from '@angular/core';
import { Header } from "./layout/header/header";
import { httpResource } from '@angular/common/http';
import { Pagination } from '../shared/pagination.model';
import { Product } from '../core/product.model';

@Component({
  imports: [Header],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private baseUrl = 'https://localhost:5001/api';
  protected readonly title = signal('Skinet');
  protected productsResouce = httpResource<Pagination<Product>>(() => `${this.baseUrl}/products`)
}
