import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../../core/busy.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  imports: [MatBadge, MatIcon, MatButton, RouterLink, RouterLinkActive, MatProgressSpinner],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected busyService = inject(BusyService);
}
