import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Router } from '@angular/router';
import { RegisterData } from '../../../core/models/user.model';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TextField } from '../../../shared/text-field/text-field';

@Component({
  imports: [MatCard, MatFormField, MatLabel, MatInput, MatButton, FormField, MatError, TextField],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private accountService = inject(AccountService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private registerModel = signal<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  protected loading = signal(false);
  protected validationErrors = signal<string[]>([]);

  protected registerForm = form(this.registerModel, path => {
    required(path.firstName, {message: 'First name is required'});
    required(path.lastName, {message: 'Last name is required'});
    required(path.email, {message: 'Email is required'});
    required(path.password, {message: 'Password is required'});
    email(path.email, {message: 'Email is invalid'});
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    this.accountService.register(this.registerModel()).subscribe({
      next: () => {
        this.snackbar.success('Registration successful - you can now login!');
        void this.router.navigateByUrl('/account/login');
      },
      error: error => {
        if (Array.isArray(error)) this.validationErrors.set(error)
        this.loading.set(false);
      }
    })
  }
}
