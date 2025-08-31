import { Injectable } from '@angular/core';
import { API_LINK } from '../api.config';
import ApiResponse from '../../types/response';
import { ICategory } from '../../types/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  async getAllCategories() {
    const response = await fetch(`${API_LINK}/categories`);
    const result: ApiResponse<ICategory[]> = await response.json();

    return result;
  }
}
