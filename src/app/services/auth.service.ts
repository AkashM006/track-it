import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoginUser, IRegisterUser } from '../../types/user';
import { Observable } from 'rxjs';
import { API_LINK } from '../api.config';

@Injectable({ providedIn: 'root' })
class AuthService {
  private authRoute = '/user';
  private http = inject(HttpClient);
  private link = `${API_LINK}${this.authRoute}`;

  registerUser(newUser: IRegisterUser): Observable<unknown> {
    const requestBody = {
      ...newUser,
    };

    return this.http.post(`${this.link}/register`, requestBody);
  }

  loginUser(user: ILoginUser): Observable<unknown> {
    const requestBody = {
      ...user,
    };

    return this.http.post(`${this.link}/login`, requestBody);
  }

  logoutUser(): Observable<unknown> {
    return this.http.post(`${this.link}/logout`, {});
  }
}

export default AuthService;
