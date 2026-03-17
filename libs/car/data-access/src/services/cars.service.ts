import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/http-client/src';
import { Observable, of } from 'rxjs';
import { CarApiService } from '../../../../core/http-client/src/lib/car.api.service';
import { Article } from '../../../../core/api-types/src';
import { Car } from '../../../../core/api-types/src/lib/car';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly carApiService = inject(CarApiService);

  CAR_DATA: Car[] = [
    { id: 1, brand: 'Tesla', model: 'Model 3', serviceDate: '2026-03-19T13:23' },
    { id: 2, brand: 'BMW', model: 'X5', serviceDate: '2026-03-19T13:23' },
    { id: 3, brand: 'Ford', model: 'Mustang', serviceDate: '2026-03-19T13:23' },
    { id: 4, brand: 'Volvo', model: 'Volvo 5', serviceDate: '2026-03-19T13:23' },
    { id: 5, brand: 'Mercedes', model: 'TR76', serviceDate: '2026-03-19T13:23' },
    { id: 6, brand: 'Toyota', model: '88', serviceDate: '2026-03-19T13:23' },
    { id: 7, brand: 'Toyota22', model: '8d', serviceDate: '2026-03-19T13:23' },
    // ... Add at least 6+ items to see the pagination work
  ];

  findAllCars(): Observable<Car[]> {
    console.log('inside findAllCars()');
    return of([
      { id: 1, serviceDate: '2026-03-16T11:33:15.3338168+00:00', brand: 'Tesla4', model: 'Model 3' },
      { id: 2, serviceDate: '2026-03-16T11:33:15.3338199+00:00', brand: 'BMW', model: 'X5' },
      { id: 3, serviceDate: '2026-03-16T11:33:15.3338201+00:00', brand: 'Ford', model: 'Mustang' },
      { id: 4, serviceDate: '2026-03-16T11:33:15.3338203+00:00', brand: 'Volvo', model: 'Volvo 5' },
      { id: 5, serviceDate: '2026-03-16T11:33:15.3338205+00:00', brand: 'Mercedes', model: 'TR76' },
      { id: 6, serviceDate: '2026-03-16T11:33:15.333821+00:00', brand: 'Toyota', model: '88' },
    ]);
    //return this.carApiService.get('/cars');
  }

  saveCars(cars: Car[]): Observable<Car[]> {
    return this.carApiService.post<Car[], Car[]>('/cars/bulk-update', cars);
  }
}
