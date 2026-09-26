import { computed, inject, resource, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationToken, loadStripe, PaymentIntent, StripeAddressElementOptions, StripeError } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AccountService } from './account.service';

@Service()
export class StripeService {
    private baseUrl = environment.baseUrl;
    private cartService = inject(CartService);
    private http = inject(HttpClient);
    private accountService = inject(AccountService);
    confirmationToken = signal<ConfirmationToken | undefined>(undefined);

    private stripeResource = resource({
        loader: () => loadStripe(environment.stripePublicKey)
    });

    private elementsParams = computed(() => {
        const stripe = this.stripeResource.value();
        const clientSecret = this.cartService.cartResource.value()?.clientSecret;
        return stripe && clientSecret ? { stripe, clientSecret } : undefined
    });

    private elementsResource = resource({
        params: this.elementsParams,
        loader: async ({params: {stripe, clientSecret}}) => 
            stripe.elements({clientSecret, appearance: {labels: 'floating'}})
    })

    addressElementResource = resource({
        params: computed(() => {
            const elements = this.elementsResource.value();
            const user = this.accountService.currentUser();
            return elements && user ? {elements, user} : undefined;
        }),
        loader: async ({ params: { elements, user } }) => {            
            const options: StripeAddressElementOptions = {
                mode: 'shipping',
                defaultValues: {
                    name: user?.firstName + ' ' + user?.lastName,
                    address: {
                        line1: user?.address.line1,
                        line2: user?.address.line2,
                        city: user?.address.city,
                        state: user?.address.state,
                        country: user?.address.country ?? 'US',
                        postal_code: user?.address.postalCode
                    }
                }
            };
            return elements.create('address', options);
        }
    });

    paymentElementResource = resource({
        params: computed(() => this.elementsResource.value()),
        loader: async ({params: elements}) => elements.create('payment', {
            wallets: {applePay: 'never', googlePay: 'never'}
        })
    })

    async createOrUpdatePaymentIntent() {
        const cart = this.cartService.cartResource.value();
        if (!cart) throw new Error('Problem with cart');

        const updatedCart = await firstValueFrom(this.http.post<Cart>(
            `${this.baseUrl}/payments/${cart.id}`, {}));

        this.cartService.cartResource.set(updatedCart);
        return updatedCart;
    }

    async createConfirmationToken() {
        const stripe = this.elementsParams()?.stripe;
        const elements = this.elementsResource.value();
        if (!stripe || !elements) return null;

        const submitResult = await elements.submit();
        if (submitResult.error) return submitResult;

        const result = await stripe.createConfirmationToken({
            elements,
            params: {
                payment_method_data: {
                    billing_details: {
                        email: this.accountService.currentUser()?.email
                    }
                }
            }
        });
        if (result.confirmationToken) this.confirmationToken.set(result.confirmationToken);
        return result;
    }

    async confirmPayment(): Promise<{error?: StripeError; paymentIntent?: PaymentIntent} | null> {
        const params = this.elementsParams();
        const elements = this.elementsResource.value();
        const token = this.confirmationToken()?.id;
        if (!params || !elements || !token) return null;

        const submitResult = await elements.submit();
        if (submitResult.error) return submitResult;

        return await params.stripe.confirmPayment({
            clientSecret: params.clientSecret,
            confirmParams: {
                confirmation_token: token
            },
            redirect: 'if_required'
        })
    }
}
