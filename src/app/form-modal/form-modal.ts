import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
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
import { FormsModule, NgForm } from '@angular/forms';
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
  updateExpense = output<IExpense>();

  // Services
  expenseService = inject(ExpenseService);
  categoriesService = inject(CategoryService);

  // Signals used in templates
  expenseForm = signal<{
    date: string;
    name: string;
    amount: string;
    category?: ICategory;
  }>({
    date: Utils.dateToString(new Date()),
    name: '',
    amount: '',
    // selectedCategory: CATEGORIES[0],
    category: undefined,
  });
  isEditForm = computed(() => this.selectedExpense() !== null);

  // Query
  categoriesQuery = useQuery(() => this.categoriesService.getAllCategories(), {
    initialData: [],
    placeholder: [],
  });

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

  // signals derived from query, mutations
  categories = computed(() => this.categoriesQuery.state().data);

  // View Queries
  form = viewChild<NgForm>('newExpenseForm');
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  constructor() {
    effect(() => {
      if (this.categoriesQuery.state().status === 'success') {
        this.nameInput()?.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.categoriesQuery.execute();
    if (this.isEditForm()) {
      const selectedExp = this.selectedExpense()!;
      this.expenseForm.set({
        date: Utils.dateToString(selectedExp.date),
        name: selectedExp.name,
        amount: selectedExp.amount.toString(),
        category: selectedExp.category,
      });
    }
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
      category,
    }));
  }

  async onSubmit() {
    // Todo: Validate the amount, date and then store in, if fails then show toast.
    // Maybe using some validation library

    const formValues = this.expenseForm();
    const { name, amount, category, date } = formValues;

    if (!category) {
      // Todo: Show some toast or something
      alert('Select a category to add an expense');
      return;
    }

    const newExpense: IExpense = {
      id: '',
      name: name,
      amount: +amount,
      category,
      date: Utils.stringToDate(date),
    };

    if (!this.isEditForm()) {
      this.addExpenseMutation.mutate(newExpense);
    } else {
      this.updateExpenseMutation.mutate({
        ...newExpense,
        id: this.selectedExpense()!.id,
      });
    }
  }

  onExpenseAdded(expense: IExpense | undefined) {
    if (expense) {
      this.addExpense.emit(expense);
    }
    this.form()?.reset();
    this.onClose();
  }

  onAddExpenseError(error: string) {
    // Todo: Change to toast later
    alert(error);
  }

  onExpenseUpdated(expense: IExpense | undefined) {
    if (expense) {
      this.updateExpense.emit(expense);
    }
    this.form()?.reset();
    this.onClose();
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
