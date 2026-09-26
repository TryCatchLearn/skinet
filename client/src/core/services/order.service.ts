import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { Order, OrderToCreate } from '../models/order.model';

@Service()
export class OrderService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);

    createOrder(order: OrderToCreate) {
        return this.http.post<Order>(this.baseUrl + '/orders', order);
    }

    readonly ordersResource = httpResource<Order[]>(() => this.baseUrl + '/orders');
}
