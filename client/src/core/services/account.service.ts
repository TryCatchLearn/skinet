import { computed, inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { Address, User } from '../models/user.model';

@Service()
export class AccountService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);

    userResource = httpResource<User>(() => ({
        url: `${this.baseUrl}/account/user-info`,
        withCredentials: true
    }));
    currentUser = computed(() => this.userResource.value() ?? null);

    login(values: any) {
        let params = new HttpParams();
        params = params.append('useCookies', true);
        return this.http.post<User>(this.baseUrl + '/login', values, {params})
    }

    register(values: any) {
        return this.http.post(this.baseUrl + '/account/register', values)
    }

    logout() {
        return this.http.post(this.baseUrl + '/account/logout', {});
    }

    updateAddress(address: Address) {
        return this.http.post(this.baseUrl + '/account/address', address);
    }
}
