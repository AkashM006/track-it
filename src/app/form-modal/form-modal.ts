import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
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
import useMutation from '../../helper/useMutation';
import useQuery from '../../helper/useQuery';

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
export class FormModal implements OnInit, OnDestroy {
  // Inputs & Outputs
  selectedExpense = input.required<IExpense | null>();
  close = output();
  addExpense = output<IExpense>();
  // Services
  expenseService = inject(ExpenseService);
  categoriesService = inject(CategoryService);

  // Signals used in templates
  expenseForm = signal({
    date: Utils.dateToString(new Date()),
    name: '',
    amount: '',
    selectedCategory: CATEGORIES[0],
  });

  categoriesQuery = useQuery(() => this.categoriesService.getAllCategories(), {
    initialData: [],
    placeholder: [],
  });
  categories = computed(() => this.categoriesQuery.state().data);

  isEditForm = computed(() => this.selectedExpense() !== null);

  // Mutations
  addExpenseMutation = useMutation(
    (newExpense: IExpense) => this.expenseService.addExpense(newExpense),
    {
      onSuccess: this.onExpenseAdded.bind(this),
      onError: this.onAddExpenseError.bind(this),
    }
  );
  updateExpenseMutation = useMutation(
    (newExpense: IExpense) => this.expenseService.updateExpense(newExpense),
    {
      onSuccess: this.onExpenseUpdated.bind(this),
      onError: this.onUpdateExpenseError.bind(this),
    }
  );

  ngOnInit(): void {
    this.categoriesQuery.execute();
  }

  ngOnDestroy(): void {
    this.addExpenseMutation.destroy();
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
      this.addExpenseMutation.mutate(newExpense);
    }
    // if (!this.isEditForm()) {
    //   await this.expenseService.addExpense(newExpense);
    // } else {
    //   newExpense.id = this.selectedExpense()!.id;
    //   await this.expenseService.updateExpense(newExpense);
    // }
  }

  onExpenseAdded(expense: IExpense | undefined) {
    // Todo: add to list
    if (expense) {
      this.addExpense.emit(expense);
    }
    this.onClose();
  }

  onAddExpenseError(error: string) {
    // Todo: Change to toast later
    alert(error);
  }

  onExpenseUpdated(expense: IExpense | undefined) {
    // Todo
  }

  onUpdateExpenseError(error: string) {
    // Todo: Show toast
    alert(error);
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
