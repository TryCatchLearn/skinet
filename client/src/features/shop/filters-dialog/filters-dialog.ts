import { Component, inject, viewChild } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  imports: [MatDivider, MatSelectionList, MatListOption, MatAnchor, MatButton],
  selector: 'app-filters-dialog',
  styleUrl: './filters-dialog.css',
  templateUrl: './filters-dialog.html',
})
export class FiltersDialog {
  protected shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FiltersDialog>);

  private brandList = viewChild.required<MatSelectionList>('brandList');
  private typeList = viewChild.required<MatSelectionList>('typeList');

  applyFilters() {
    const selectedBrands = this.brandList().selectedOptions.selected.map(x => x.value);
    const selectedTypes = this.typeList().selectedOptions.selected.map(x => x.value);
    this.dialogRef.close({
      selectedBrands,
      selectedTypes
    })
  }
}
