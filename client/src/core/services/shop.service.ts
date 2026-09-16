import { HttpParams, httpResource } from '@angular/common/http';
import { linkedSignal, Service, signal } from '@angular/core';
import { ShopParams } from '../models/shop-params.model';
import { environment } from '../../environments/environment';
import { Pagination } from '../../shared/pagination.model';
import { Product } from '../models/product.model';

@Service()
export class ShopService {
    private baseUrl = environment.baseUrl;
    shopParams = signal<ShopParams>({
        brands: [],
        types: [],
        sort: 'name',
        pageNumber: 1,
        pageSize: 10,
        search: ''
    });

    readonly productsResouce = 
        httpResource<Pagination<Product>>(() => {
            const {brands, types, search, sort, pageNumber, pageSize} = this.shopParams();

            let params = new HttpParams();

            if (brands.length > 0) params = params.append('brands', brands.join(','));
            if (types.length > 0) params = params.append('types', types.join(','));
            if (search) params = params.append('search', search);
            params = params.append('sort', sort);
            params = params.append('pageSize', pageSize);
            params = params.append('pageIndex', pageNumber);

            return {
                url: `${this.baseUrl}/products`,
                params
            }
        });

    readonly brandsResource = httpResource<string[]>(() => `${this.baseUrl}/products/brands`);
    readonly typesResource = httpResource<string[]>(() => `${this.baseUrl}/products/types`);

    readonly displayedProducts = linkedSignal<Pagination<Product> | undefined, 
        Pagination<Product> | undefined>({
            source: () => this.productsResouce.value(),
            computation: (value, previous) => value ?? previous?.value
    })
}
