import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { LoginData } from '../../../core/models/user.model';
import { form, FormField } from '@angular/forms/signals';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [MatCard, MatFormField, MatLabel, MatInput, FormField, MatButton],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private accountService = inject(AccountService);
  private router = inject(Router);
  protected loading = signal(false);

  private redirectUrl = this.router.currentNavigation()?.extras?.state?.['attemptedUrl'] ?? '/shop'

  protected loginModel = signal<LoginData>({
    email: '',
    password: ''
  });

  protected loginForm = form(this.loginModel);

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    this.accountService.login(this.loginModel()).subscribe({
      next: () => {
        this.loading.set(false);
        this.accountService.userResource.reload();
        void this.router.navigateByUrl(this.redirectUrl);
      },
      error: () => this.loading.set(false)
    })
  }
}
