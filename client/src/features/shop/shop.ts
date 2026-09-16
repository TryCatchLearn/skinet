import { Component, inject, signal } from '@angular/core';
import { ProductItem } from './product-item/product-item';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatSelectionList, MatListOption, MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { form, FormField } from '@angular/forms/signals';
import { ShopService } from '../../core/services/shop.service';

@Component({
  imports: [
    ProductItem,
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatPaginator,
    FormField,
    MatIconButton
  ],
  selector: 'app-shop',
  styleUrl: './shop.css',
  templateUrl: './shop.html',
})
export class Shop {
  protected shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  protected sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' },
  ];
  protected pageSizeOptions = [5, 10, 15, 20];
  private searchModel = signal({
    searchTerm: ''
  });

  protected searchForm = form(this.searchModel);

  onReset() {
    this.shopService.shopParams.set({
      brands: [],
      types: [],
      sort: 'name',
      pageNumber: 1,
      pageSize: 10,
      search: ''
    });
    if (this.searchForm.searchTerm().value() !== '') this.searchForm.searchTerm().value.set('');
  }

  onSearchChange(event: Event) {
    event.preventDefault();
    this.shopService.shopParams.update(current => ({
      ...current,
      pageNumber: 1,
      search: this.searchForm.searchTerm().value()
    }));
  }

  onPaginationEvent(event: PageEvent) {
    this.shopService.shopParams.update(current => ({
      ...current,
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize
    }))
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopService.shopParams.update(current => ({
        ...current,
        pageNumber: 1,
        sort: selectedOption.value
      }));
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialog, {
      width: '500px',
      height: '500px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shopService.shopParams.update(current => ({
          ...current,
          pageNumber: 1,
          brands: result.selectedBrands
        }));
        this.shopService.shopParams.update(current => ({
          ...current,
          pageNumber: 1,
          types: result.selectedTypes
        }));
      }
    })
  }
}
