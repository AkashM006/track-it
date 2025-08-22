import { Component, inject, output, signal } from '@angular/core';
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
import ExpenseService from '../expense.service';
import { IExpense } from '../types/expense';
import { v4 as uuidv4 } from 'uuid';

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
    date: new Date(),
    name: '',
    amount: '',
    selectedCategory: CATEGORIES[0],
  });
  expenseService = inject(ExpenseService);

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
    // Todo: Validate the amount and then store in, if fails then show toast
    const newExpense: IExpense = {
      id: uuidv4(),
      name: this.expenseForm().name,
      amount: +this.expenseForm().amount,
      category: this.expenseForm().selectedCategory,
      date: new Date(),
    };
    this.expenseService.addExpense(newExpense);
    this.close.emit();
  }
}
