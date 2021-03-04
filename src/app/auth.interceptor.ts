import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: BackendService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getToken();

    if (authToken === undefined) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    return next.handle(authReq);
  }
}
