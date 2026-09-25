import { Component, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  imports: [MatFormField, MatLabel, MatInput, MatError, FormField],
  selector: 'app-text-field',
  styleUrl: './text-field.css',
  templateUrl: './text-field.html',
})
export class TextField<T extends string | number | boolean | Date | null> {
  field = input.required<Field<T>>();
  label = input.required<string>();
  type = input('text');
  placeholder = input('');
}
