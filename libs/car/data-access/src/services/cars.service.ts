import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarApiService } from '../../../../core/http-client/src/lib/car.api.service';
import { Car } from '../../../../core/api-types/src/lib/car';

// Define the interface for the lookup lists
export interface CarData {
  yearBuiltList: number[];
  countriesList: { abbreviation: string; country: string }[];
}

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly carApiService = inject(CarApiService);

  // Mock data for individual car entities
  CAR_DATA: Car[] = [
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model 3',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2022,
      country: 'US',
    },
    { id: 2, brand: 'BMW', model: 'X5', serviceDate: '2026-03-19T13:23', yearBuilt: 2025, country: 'DE' },
    {
      id: 3,
      brand: 'Ford',
      model: 'Mustang',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2023,
      country: 'US',
    },
    {
      id: 4,
      brand: 'Volvo',
      model: 'Volvo 5',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2020,
      country: 'SE',
    },
    {
      id: 5,
      brand: 'Mercedes',
      model: 'TR76',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2024,
      country: 'DE',
    },
    {
      id: 6,
      brand: 'Land Rover',
      model: '88',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2025,
      country: 'UK',
    },
    {
      id: 7,
      brand: 'Toyota',
      model: '8d',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2022,
      country: 'JP',
    },
  ];

  // Method to fetch the lookup/dropdown data
  getCarData(): Observable<CarData> {
    return of({
      yearBuiltList: [2020, 2021, 2022, 2023, 2024, 2025],
      countriesList: [
        { abbreviation: 'US', country: 'United States' },
        { abbreviation: 'DE', country: 'Germany' },
        { abbreviation: 'JP', country: 'Japan' },
        { abbreviation: 'UK', country: 'United Kingdom' },
        { abbreviation: 'SE', country: 'Sweden' },
      ],
    });
    // return this.carApiService.ad('/cars/options');
  }

  findAllCars(): Observable<Car[]> {
    return of(this.CAR_DATA);
    // return this.carApiService.get('/cars');
  }

  saveCars(cars: Car[]): Observable<Car[]> {
    return this.carApiService.post<Car[], Car[]>('/cars/bulk-update', cars);
  }
}
