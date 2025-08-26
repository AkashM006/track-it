import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline } from '@ng-icons/ionicons';
import { FormModal } from './form-modal/form-modal';
import { ExpenseList } from './expense-list/expense-list';
import { Charts } from './charts/charts';

@Component({
  selector: 'app-root',
  imports: [Header, NgIcon, FormModal, ExpenseList, Charts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  viewProviders: [provideIcons({ ionAddOutline })],
})
export class App {
  isFormOpen = signal(false);
  isChartsOpen = signal(false);

  onNewExpense() {
    this.isFormOpen.set(true);
  }

  onCloseExpenseForm() {
    this.isFormOpen.set(false);
  }

  onToggleCharts() {
    this.isChartsOpen.update((prev) => !prev);
  }
}
