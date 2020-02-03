import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, pipe } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoaderService } from '../service/loader.service';

@Injectable({
    providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {

    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: LoaderService) { }

    removeRequest(requests: HttpRequest<any>) {
        const i = this.requests.indexOf(requests);
        if (i >= 0) {
            this.requests.splice(i, 1);

        }
        this.loaderService.isLoading.next(0 > 0);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.requests.push(request);
        this.loaderService.isLoading.next(true);
        const access_token: string = localStorage.getItem('token');

        if (access_token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + access_token) });
        }

        //request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        request = request.clone({ withCredentials: true, headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.removeRequest(request);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                this.removeRequest(request);
                return throwError(error);
                this.loaderService.isLoading.next(false);
            }));
    }

    private hideLoader(): void {
        this.loaderService.isLoading.next(false);
    }

}
