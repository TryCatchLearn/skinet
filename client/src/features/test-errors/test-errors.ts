import { Component, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [MatButton, JsonPipe],
  selector: 'app-test-errors',
  styleUrl: './test-errors.css',
  templateUrl: './test-errors.html',
})
export class TestErrors {
  private baseUrl = environment.baseUrl;

  request = signal<HttpResourceRequest | undefined>(undefined);
  errorResource = httpResource(() => this.request());

  getError(url: string, method?: string, body?: unknown) {
    this.request.set({url: `${this.baseUrl}/${url}`, method, body})
  }
}
