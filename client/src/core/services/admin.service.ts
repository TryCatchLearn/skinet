import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { OrderParams } from '../models/order-params.model';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { Pagination } from '../../shared/pagination.model';
import { Order } from '../models/order.model';

@Service()
export class AdminService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);

    orderParams = signal<OrderParams>({
        pageNumber: 1,
        pageSize: 10,
        status: ''
    });

    readonly ordersResource = httpResource<Pagination<Order>>(() => {
        const {pageNumber, pageSize, status} = this.orderParams();

        let params = new HttpParams();

        if (status && status !== 'All') params = params.append('status', status);
        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);

        return {
            url: `${this.baseUrl}/admin/orders`,
            params
        }
    });

    refundOrder(id: number) {
        return this.http.post<Order>(`${this.baseUrl}/admin/orders/refund/${id}`, {});
    }
}
