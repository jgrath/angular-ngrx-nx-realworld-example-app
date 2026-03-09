import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/http-client/src';
import { Observable } from 'rxjs';
import { Article } from '../../../../core/api-types/src';
import { Car } from '../../../../core/api-types/src/lib/car';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly apiService = inject(ApiService);

  query(): Observable<{ cars: Car[] }> {
    return this.apiService.get('/cars');
  }
}
