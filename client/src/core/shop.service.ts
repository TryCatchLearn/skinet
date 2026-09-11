import { HttpParams, httpResource } from '@angular/common/http';
import { Service, signal } from '@angular/core';
import { Pagination } from '../shared/pagination.model';
import { Product } from './product.model';
import { environment } from '../environments/environment';
import { ShopParams } from './shop-params.model';

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
}
