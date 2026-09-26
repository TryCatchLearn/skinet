import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { Cart, Item } from '../models/cart.model';
import { Product } from '../models/product.model';
import { CheckoutService } from './checkout.service';
import { firstValueFrom } from 'rxjs';

@Service()
export class CartService {
    private baseUrl = environment.baseUrl;
    private http = inject(HttpClient);
    private checkoutService = inject(CheckoutService);

    private cartId = signal<string | null>(localStorage.getItem('cart_id'));

    loading = signal(false);

    cartResource = httpResource<Cart>(() => this.cartId()
        ? `${this.baseUrl}/cart?id=${this.cartId()}` : undefined);

    itemCount = computed(() => {
        return this.cartResource.value()?.items.reduce((sum, item) => sum + item.quantity, 0)
    });

    totals = computed(() => {
        const items = this.cartResource.value()?.items;
        const deliveryId = this.cartResource.value()?.deliveryMethodId;

        const subtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
        const shipping = this.checkoutService.deliveryMethods()?.find(x => x.id === deliveryId)?.price ?? 0;
        const discount = 0;
        const total = subtotal + shipping - discount;

        return {
            subtotal,
            shipping,
            discount,
            total
        }
    })

    async setCart(cart: Cart) {
        this.loading.set(true);
        try {
            const updatedCart = await firstValueFrom(this.http.post<Cart>(`${this.baseUrl}/cart`, cart));
            this.cartId.set(cart.id);
            this.cartResource.set(updatedCart);
            return updatedCart;
        } finally {
            this.loading.set(false)
        }
    }

    addItemToCart(item: Item | Product, quantity = 1) {
        const cart = this.cartResource.value() ?? this.createCart();
        if (this.isProduct(item)) {
            item = this.mapProductToCartItem(item);
        }
        cart.items = this.addOrUpdateCartItem(cart.items, item, quantity);
        this.setCart(cart);
    }

    removeItemFromCart(productId: number, quantity = 1) {
        const cart = this.cartResource.value();
        if (!cart) return;
        const index = cart.items.findIndex(i => i.productId === productId);
        if (index !== -1) {
            if (cart.items[index].quantity > quantity) {
                cart.items[index].quantity -= quantity;
            } else {
                cart.items.splice(index, 1)
            }
            if (cart.items.length === 0) {
                this.deleteCart();
            } else {
                this.setCart(cart);
            }
        }
    }

    deleteCart() {
        this.http.delete(this.baseUrl + '/cart?id=' + this.cartResource.value()?.id).subscribe({
            next: () => this.forgetCart()
        })
    }

    forgetCart() {
        localStorage.removeItem('cart_id');
        this.cartResource.value.set(undefined);
        this.cartId.set(null);
    }

    private addOrUpdateCartItem(items: Item[], item: Item, quantity: number): Item[] {
        const index = items.findIndex(i => i.productId === item.productId);
        if (index === -1) {
            item.quantity = quantity;
            items.push(item);
        } else {
            items[index].quantity += quantity;
        }
        return items;
    }

    private mapProductToCartItem(item: Product): Item {
        return {
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: 0,
            pictureUrl: item.pictureUrl,
            brand: item.brand,
            type: item.type
        }
    }

    private isProduct(item: Item | Product): item is Product {
        return (item as Product).id !== undefined
    }

    private createCart() {
        const cart = new Cart();
        localStorage.setItem('cart_id', cart.id);
        this.cartId.set(cart.id);
        return cart;
    }
}
