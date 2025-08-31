import { inject, Injectable } from '@angular/core';
import { API_LINK } from '../api.config';
import ApiResponse from '../../types/response';
import { ICategory } from '../../types/category';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import ResourceState from '../../types/resourceState';
import { catchError, map, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesLink = '/categories';

  private http = inject(HttpClient);

  getAllCategories() {
    const categories$ = this.http
      .get<ApiResponse<ICategory[]>>(`${API_LINK}${this.categoriesLink}`)
      .pipe(
        map((response) => {
          const result: ResourceState<ICategory[]> = {
            status: 'success' as const,
            data: null,
            error: null,
          };
          console.log(response);

          if (response.results) {
            result.data = response.results;
          }

          return result;
        }),
        // handling Error
        catchError((error: HttpErrorResponse) => {
          const errorObject = error.error;

          if (errorObject instanceof ProgressEvent) {
            return of({
              status: 'error' as const,
              error: 'Unable to reach server',
              data: null,
            });
          }

          const apiError = errorObject as ApiResponse<null>;

          return of({
            status: 'error' as const,
            error: apiError.msg,
            data: null,
          });
        }),
        // Starting with a loading state
        startWith({ status: 'loading' as const, data: null, error: null })
      );

    type CategoriesExpenseState = ResourceState<ICategory[]>;

    return toSignal<CategoriesExpenseState, CategoriesExpenseState>(categories$, {
      initialValue: {
        status: 'loading',
        data: null,
        error: null,
      },
    });
  }
}
