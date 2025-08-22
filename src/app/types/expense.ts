import { ICategory } from './category';

export interface IExpense {
  id: string;
  name: string;
  amount: number;
  category: ICategory;
  date: Date;
}
