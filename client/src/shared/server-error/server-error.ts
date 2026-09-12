import { Component, inject, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [JsonPipe],
  selector: 'app-server-error',
  styleUrl: './server-error.css',
  templateUrl: './server-error.html',
})
export class ServerError {
  private router = inject(Router);
  error = this.router.currentNavigation()?.extras?.state?.['error'];
  protected readonly isDevMode = isDevMode
}
