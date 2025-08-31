import { Component, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCloseOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-modal',
  imports: [NgIcon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  viewProviders: [provideIcons({ ionCloseOutline })],
})
export class Modal {
  close = output();

  onClose() {
    this.close.emit();
  }
}
