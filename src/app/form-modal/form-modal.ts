import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
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
import { ICategory } from '../../types/category';
import ExpenseService from '../services/expense.service';
import { IExpense } from '../../types/expense';
import Utils from '../../utils';
import { CategoryService } from '../services/category.service';
import { Loader } from '../common/loader/loader';
import { Modal } from '../common/modal/modal';

@Component({
  selector: 'app-form-modal',
  imports: [FormsModule, Loader, Modal],
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
  expenseForm = signal({
    date: Utils.dateToString(new Date()),
    name: '',
    amount: '',
    selectedCategory: CATEGORIES[0],
  });
  expenseService = inject(ExpenseService);
  categoriesService = inject(CategoryService);
  selectedExpense = input.required<IExpense | null>();

  // categories = signal<ICategory[]>();
  categoriesObject = this.categoriesService.getAllCategories();
  categories = computed(() => this.categoriesObject().data ?? []);

  isEditForm = computed(() => this.selectedExpense() !== null);

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

  async onSubmit() {
    // Todo: Validate the amount, date and then store in, if fails then show toast
    const newExpense: IExpense = {
      id: '',
      name: this.expenseForm().name,
      amount: +this.expenseForm().amount,
      category: this.expenseForm().selectedCategory,
      date: Utils.stringToDate(this.expenseForm().date),
    };
    if (!this.isEditForm()) {
      await this.expenseService.addExpense(newExpense);
    } else {
      newExpense.id = this.selectedExpense()!.id;
      await this.expenseService.updateExpense(newExpense);
    }
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
