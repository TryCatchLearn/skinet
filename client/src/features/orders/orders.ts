import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { MatChip } from '@angular/material/chips';
import { SplitCamelCasePipe } from '../../shared/pipes/split-camel-case-pipe';

@Component({
  imports: [RouterLink, DatePipe, CurrencyPipe, MatChip, NgClass, SplitCamelCasePipe],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders {
  protected orderService = inject(OrderService)
}
