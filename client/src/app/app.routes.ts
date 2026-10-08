import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { authGuard } from '../core/guards/auth-guard';
import { emptyCartGuard } from '../core/guards/empty-cart-guard';
import { paymentIntentResolver } from '../core/resolvers/payment-intent-resolver';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', loadComponent: () => import('../features/shop/shop').then(x => x.Shop)},
    {path: 'shop/:id', loadComponent: () => import('../features/shop/product-details/product-details')
        .then(x => x.ProductDetails)},
    {path: 'cart', loadComponent: () => import('../features/cart/cart').then(x => x.Cart)},
    {path: 'checkout', loadComponent: () => import('../features/checkout/checkout').then(x => x.Checkout), 
        canActivate: [authGuard, emptyCartGuard],
        resolve: {paymentIntent: paymentIntentResolver}
    },
    {path: 'orders', loadComponent: () => import('../features/orders/orders')
        .then(x => x.Orders), canActivate: [authGuard]},
    {path: 'orders/:id', loadComponent: () => import('../features/orders/order-detailed/order-detailed')
        .then(x => x.OrderDetailed), canActivate: [authGuard]},
    {path: 'account/login', loadComponent: () => import('../features/account/login/login')
        .then(x => x.Login)},
    {path: 'account/register', loadComponent: () => import('../features/account/register/register')
        .then(x => x.Register)},
    {path: 'test-errors', loadComponent: () => import('../features/test-errors/test-errors')
        .then(x => x.TestErrors)},
    {path: 'server-error', loadComponent: () => import('../shared/server-error/server-error')
        .then(x => x.ServerError)},
    {path: 'not-found', loadComponent: () => import('../shared/not-found/not-found')
        .then(x => x.NotFound)},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
