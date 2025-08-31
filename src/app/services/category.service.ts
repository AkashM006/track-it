import { inject, Injectable } from '@angular/core';
import { API_LINK } from '../api.config';
import ApiResponse from '../../types/response';
import { ICategory } from '../../types/category';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import ResourceState from '../../types/resourceState';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesLink = '/categories';

  private http = inject(HttpClient);

  getAllCategories(): Observable<ICategory[]> {
    return this.http
      .get<ApiResponse<ICategory[]>>(`${API_LINK}${this.categoriesLink}`)
      .pipe(map((response) => response.results ?? []));
  }
}
