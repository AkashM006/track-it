import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionTrendingDownOutline, ionWalletOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-header',
  imports: [NgIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  viewProviders: [
    provideIcons({
      ionWalletOutline,
      ionTrendingDownOutline,
    }),
  ],
})
export class Header {}
