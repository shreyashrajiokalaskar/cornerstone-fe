import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommonHttpService {
  constructor(private httpClient: HttpClient) { }

  get<T>(endPoint: string): Observable<T> {
    return this.httpClient.get<T>(`${environment.API_URL}/${endPoint}`);
  }

  post<T>(endPoint: string, body: any): Observable<T> {
    return this.httpClient.post<T>(`${environment.API_URL}/${endPoint}`, body);
  }

  postWithProgress<T>(endPoint: string, body: any): Observable<HttpEvent<T>> {
    return this.httpClient.post<T>(`${environment.API_URL}/${endPoint}`, body, {
      observe: 'events',
      responseType: 'json',
      reportProgress: true
    });
  }


  patch<T>(endPoint: string, body: any): Observable<T> {
    return this.httpClient.patch<T>(`${environment.API_URL}/${endPoint}`, body);
  }

  delete<T>(endPoint: string): Observable<T> {
    return this.httpClient.delete<T>(`${environment.API_URL}/${endPoint}`);
  }
}
