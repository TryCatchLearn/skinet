import { Component, computed, inject } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { Order } from '../../core/models/order.model';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  imports: [
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    DatePipe,
    CurrencyPipe,
    MatTooltip,
    MatIconButton,
    RouterLink,
    MatIcon
  ],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  protected adminService = inject(AdminService);
  protected displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'actions'];
  protected statusOptions = ['All', 'PaymentReceived', 'Refunded', 'Pending'];
  private dialogService = inject(DialogService);

  protected orders = computed<Order[]>(() => this.adminService.ordersResource.value()?.data ?? []);
  protected totalItems = computed(() => this.adminService.ordersResource.value()?.count ?? 0);
  protected pageIndex = computed(() => this.adminService.orderParams().pageNumber - 1);
  protected pageSize = computed(() => this.adminService.orderParams().pageSize);

  onPageChange(event: PageEvent) {
    this.adminService.orderParams.update(current => ({
      ...current,
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize
    }))
  }

  onFilterSelect(event: MatSelectChange) {
    this.adminService.orderParams.update(current => ({
      ...current,
      pageNumber: 1,
      status: event.value
    }))
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund', 
      'Are you sure you want to issue this refund? This cannot be undone'
    )

    if (confirmed) this.refundOrder(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: () => {
        this.adminService.ordersResource.reload()
      }
    })
  }
}
