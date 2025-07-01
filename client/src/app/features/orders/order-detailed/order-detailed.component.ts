import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    DatePipe,
    MatButton,
    AddressPipe,
    PaymentCardPipe,
    CurrencyPipe
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  order?: Order;
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders'

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick() {
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders')
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const loadOrderData = this.accountService.isAdmin()
      ? this.adminService.getOrder(+id)
      : this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order => this.order = order
    })
  }
}
