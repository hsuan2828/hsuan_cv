import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

/*
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
 */

@Injectable()
export class BackendService {
    constructor(private http: HttpClient) { }
    public browserLang :string = 'en';

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.log("something wrong");
            throw of(error);
            //return of(result as T);
        };
    }
        /*
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            if (error.status === 200) {
         */
                /* TODO: error from server */
        /*
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    private extractData(res: Response) {
        let body = res.json();
        if (res.status === 200) {
            if (body.RESPONSE === 'OK') {
                return body.data || {};
            } else {
                throw res;
            }
        } else {
            throw res;
        }
    }
    */

    getData(url: string, data: object): Observable<any> {
        let tok = document.getElementById("csrf").getAttribute("value");
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-Csrf-Token': tok,
            }),
            withCredentials: true
        }
        let bodyString = JSON.stringify(data);
        return this.http
        .post(url, bodyString, httpOptions)
        .pipe( 
            //map(this.extractData),
            catchError(this.handleError<any>('getData'))
            //catchError(this.handleError)
        );
    }
}
