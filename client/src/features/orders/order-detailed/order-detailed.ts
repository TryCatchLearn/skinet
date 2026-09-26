import { Component, input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { Order } from '../../../core/models/order.model';
import { MatCard, MatCardHeader, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { NgClass, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { SplitCamelCasePipe } from '../../../shared/pipes/split-camel-case-pipe';

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
  id = input<string>();

  orderResource = httpResource<Order>(() => this.id() 
    ? `${this.baseUrl}/orders/${this.id()}` : undefined)

}
