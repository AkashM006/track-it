import { Component, inject, OnInit, output, signal } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { ICategory } from '../types/category';
import ExpenseService from '../services/expense.service';
import { IExpense } from '../types/expense';
import { v4 as uuidv4 } from 'uuid';
import Utils from '../../utils';
import { CategoryService } from '../services/category.service';

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
export class FormModal implements OnInit {
  close = output();
  categories = signal<ICategory[]>([]);
  expenseForm = signal({
    date: Utils.dateToString(new Date()),
    name: '',
    amount: '',
    selectedCategory: CATEGORIES[0],
  });
  expenseService = inject(ExpenseService);
  categoriesService = inject(CategoryService);

  async ngOnInit() {
    const result = await this.categoriesService.getAllCategories();
    if (!result || !result.success || !result.results) return;
    this.categories.set(result.results);
  }

  onClose() {
    this.close.emit();
  }

  onSelectCategory(category: ICategory) {
    this.expenseForm.update((prev) => ({
      ...prev,
      selectedCategory: category,
    }));
  }

  // Todo: When modal is opened focus on the input automatically

  onSubmit() {
    // Todo: Validate the amount, date and then store in, if fails then show toast
    const newExpense: IExpense = {
      id: uuidv4(),
      name: this.expenseForm().name,
      amount: +this.expenseForm().amount,
      category: this.expenseForm().selectedCategory,
      date: Utils.stringToDate(this.expenseForm().date),
    };
    this.expenseService.addExpense(newExpense);
    this.close.emit();
  }

  setDate(event: Event) {
    const dateField = event.target as HTMLInputElement;
    const dateString = dateField.value;
    if (dateString) {
      this.expenseForm.update((prev) => ({
        ...prev,
        date: Utils.dateToString(new Date(dateString)),
      }));
    }
  }
}
