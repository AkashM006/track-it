import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IUser } from '../../types/user';
import { API_LINK } from '../api.config';
import ApiResponse from '../../types/response';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userRoute = '/user';
  private http = inject(HttpClient);

  getUserDetails(): Observable<IUser | undefined> {
    return this.http.get<ApiResponse<IUser>>(`${API_LINK}${this.userRoute}`).pipe(
      map((result) => {
        if (result.success && result.results) {
          const { email, name } = result.results;
          const user = {
            email,
            name,
          };

          return user;
        }
        return undefined;
      })
    );
  }
}
