import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor  implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(
      map(res => {
        return res;
      }), 
      catchError((error:HttpErrorResponse) => {
        let errorMsg = '';
        // Client side error
        if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
            alert(errorMsg);
        } else {
          // Server side error
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          alert(errorMsg);
        }
        return throwError(errorMsg);
      })
    );
  }
}
