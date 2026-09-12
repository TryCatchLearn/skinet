import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatAnchor, MatButton, RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}
