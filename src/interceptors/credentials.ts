import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function credentialsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const newRequest = req.clone({
    setHeaders: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    withCredentials: true,
  });

  return next(newRequest);
}
