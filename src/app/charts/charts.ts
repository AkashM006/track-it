import { Component, computed, inject, input } from '@angular/core';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  ChartConfiguration,
  ChartData,
  Colors,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { CurrencyPipe } from '@angular/common';
import Utils from '../../utils';
import { IExpense } from '../types/expense';

@Component({
  selector: 'app-charts',
  imports: [BaseChartDirective],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
  viewProviders: [
    provideCharts({
      registerables: [
        ArcElement,
        DoughnutController,
        Tooltip,
        Legend,
        Colors,
        BarController,
        CategoryScale,
        LinearScale,
        BarElement,
      ],
    }),
  ],
  providers: [CurrencyPipe],
})
export class Charts {
  expenses = input.required<IExpense[]>();
  private currencyPipe = inject(CurrencyPipe);

  doughNutChartOptions: ChartConfiguration['options'] = {
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

  barChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: false,
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

  dayWiseExpenseChartObject = computed<ChartData<'bar'>>(() => {
    const today = new Date();
    const dates = Utils.getDatesOfCurrentWeek().map(Utils.dateToString);
    const expensesMappedToDates: Record<string, number> = Object.fromEntries(
      dates.map((date) => [date, 0])
    );
    this.expenses().forEach((expense) => {
      const expenseDate = Utils.dateToString(expense.date);

      if (expensesMappedToDates[expenseDate] !== undefined) {
        expensesMappedToDates[expenseDate] += expense.amount;
      }
    });

    const labels = dates.filter((date) => Utils.stringToDate(date) <= today);
    const data = labels.map((date) => expensesMappedToDates[date]);

    return {
      labels,
      datasets: [{ data }],
    };
  });
}
