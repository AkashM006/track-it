import { Component, computed, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionAirplaneOutline,
  ionBagHandleOutline,
  ionCloseOutline,
  ionDocumentOutline,
  ionEllipsisHorizontalOutline,
  ionFastFoodOutline,
} from '@ng-icons/ionicons';
import CATEGORIES from '../categories';
import { FormsModule, NgForm } from '@angular/forms';
import { ICategory } from '../types/category';

@Component({
  selector: 'app-form-modal',
  imports: [NgIcon, FormsModule],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.scss',
  viewProviders: [
    provideIcons({
      ionCloseOutline,
      ionFastFoodOutline,
      ionAirplaneOutline,
      ionBagHandleOutline,
      ionDocumentOutline,
      ionEllipsisHorizontalOutline,
    }),
  ],
})
export class FormModal {
  close = output();
  categories = signal<ICategory[]>(CATEGORIES);
  expenseForm = signal({
    name: '',
    amount: '',
    selectedCategory: CATEGORIES[0],
  });

  onClose() {
    this.close.emit();
  }

  onSelectCategory(category: ICategory) {
    this.expenseForm.update((prev) => ({
      ...prev,
      selectedCategory: category,
    }));
  }

  onSubmit() {
    // Todo: Integrate this with service
    this.close.emit();
  }
}
