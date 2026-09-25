import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { Shop } from '../features/shop/shop';
import { ProductDetails } from '../features/shop/product-details/product-details';
import { TestErrors } from '../features/test-errors/test-errors';
import { ServerError } from '../shared/server-error/server-error';
import { NotFound } from '../shared/not-found/not-found';
import { Cart } from '../features/cart/cart';
import { Checkout } from '../features/checkout/checkout';
import { Login } from '../features/account/login/login';
import { Register } from '../features/account/register/register';
import { authGuard } from '../core/guards/auth-guard';
import { emptyCartGuard } from '../core/guards/empty-cart-guard';
import { paymentIntentResolver } from '../core/resolvers/payment-intent-resolver';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: Shop},
    {path: 'shop/:id', component: ProductDetails},
    {path: 'cart', component: Cart},
    {path: 'checkout', component: Checkout, 
        canActivate: [authGuard, emptyCartGuard],
        resolve: {paymentIntent: paymentIntentResolver}
    },
    {path: 'account/login', component: Login},
    {path: 'account/register', component: Register},
    {path: 'test-errors', component: TestErrors},
    {path: 'server-error', component: ServerError},
    {path: 'not-found', component: NotFound},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
