import { computed, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { httpResource } from '@angular/common/http';
import { DeliveryMethod } from '../models/delivery.model';

@Service()
export class CheckoutService {
    private baseUrl = environment.baseUrl;

    readonly deliveryResource = httpResource<DeliveryMethod[]>(() => 
        `${this.baseUrl}/payments/delivery-methods`);

    deliveryMethods = computed(() => {
        return this.deliveryResource.value()?.sort((a,b) => a.price - b.price);
    })
}
