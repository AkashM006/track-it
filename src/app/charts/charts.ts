import { Component, computed, inject } from '@angular/core';
import ExpenseService from '../expense.service';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  ArcElement,
  ChartConfiguration,
  ChartData,
  Colors,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-charts',
  imports: [BaseChartDirective],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
  viewProviders: [
    provideCharts({ registerables: [ArcElement, DoughnutController, Tooltip, Legend, Colors] }),
  ],
  providers: [CurrencyPipe],
})
export class Charts {
  private expenseService = inject(ExpenseService);
  private currencyPipe = inject(CurrencyPipe);

  expenses = this.expenseService.expenses;

  options: ChartConfiguration['options'] = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return this.currencyPipe.transform(value, 'INR', 'symbol')!;
          },
        },
      },
    },
  };

  categoryWiseExpenseChartObject = computed<ChartData<'doughnut'>>(() => {
    const expensesMappedToCategories = this.expenses().reduce((prev, expense) => {
      const { category, amount } = expense;

      if (!prev[category.name]) {
        prev[category.name] = {
          amount,
          color: category.color,
        };
      } else {
        prev[category.name].amount = (prev[category.name]?.amount ?? 0) + amount;
      }

      return { ...prev };
    }, <Record<string, { amount: number; color: string }>>{});
    const keys = Object.keys(expensesMappedToCategories);

    const labels = keys;
    const data = keys.map((key) => expensesMappedToCategories[key].amount);
    const backgroundColor = keys.map((key) => expensesMappedToCategories[key].color);
    return {
      labels,
      datasets: [{ data, backgroundColor }],
    };
  });

  // TODO: Must do this after adding date field in new expense
  // dayWiseExpenseChartObject = computed<ChartData<'bar'>>(() => {});
}
