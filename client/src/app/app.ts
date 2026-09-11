import { Component } from '@angular/core';
import { Header } from "./layout/header/header";
import { Shop } from '../features/shop/shop';

@Component({
  imports: [Header, Shop],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

}
