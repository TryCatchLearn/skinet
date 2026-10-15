import { Component, inject, input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Order } from '../../../core/models/order.model';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { NgClass, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { SplitCamelCasePipe } from '../../../shared/pipes/split-camel-case-pipe';
import { AccountService } from '../../../core/services/account.service';

@Component({
  imports: [
    MatCard,
    MatCardHeader,
    MatChip,
    NgClass,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    RouterLink,
    MatButton,
    SplitCamelCasePipe
  ],
  selector: 'app-order-detailed',
  styleUrl: './order-detailed.css',
  templateUrl: './order-detailed.html',
})
export class OrderDetailed {
  private baseUrl = environment.baseUrl;
  private accountService = inject(AccountService);
  private router = inject(Router);
  protected buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders';
  id = input<string>();

  onReturnClick() {
    this.accountService.isAdmin() ? this.router.navigateByUrl('/admin') : this.router.navigateByUrl('/orders')
  }

  orderResource = httpResource<Order>(() => this.id() && !this.accountService.isAdmin() 
    ? `${this.baseUrl}/orders/${this.id()}` : `${this.baseUrl}/admin/orders/${this.id()}`)

}
