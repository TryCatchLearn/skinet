import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Shop } from '../features/shop/shop';
import { ProductDetails } from '../features/shop/product-details/product-details';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: Shop},
    {path: 'shop/:id', component: ProductDetails},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];
