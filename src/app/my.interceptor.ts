import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
//import { CookieService } from 'ngx-cookie-service';

import { HttpXsrfTokenExtractor } from '@angular/common/http';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    //constructor(private cookieService: CookieService) {}
    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //const csrf = this.cookieService.get('_iris_csrf');
      const headerName = 'X-CSRF-Token';
      let token = this.tokenExtractor.getToken() as string;
      if (token !== null && !req.headers.has(headerName)) {
          req = req.clone({headers: req.headers.set(headerName, token)});
      }
      return next.handle(req);
    }
}
