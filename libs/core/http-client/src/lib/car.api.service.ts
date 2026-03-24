import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarApiService {
  private readonly http = inject(HttpClient);
  private readonly car_api_url = 'http://localhost:5014/api';

  get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.car_api_url}${url}`, {
      headers: this.headers,
      params,
      withCredentials: true,
    });
  }

    getCarOptions<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.car_api_url}${url}`, {
      headers: this.headers,
      params,
      withCredentials: true,
    });
  }

    post<T, D>(url: string, data: D): Observable<T> {
    return this.http.post<T>(`${this.car_api_url}${url}`, data, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  get headers(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json,',
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }
}
