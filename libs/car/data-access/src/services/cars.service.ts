import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
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
      country: '',
    },
    { id: 2, brand: 'BMW', model: 'X5', serviceDate: '2026-03-19T13:23', yearBuilt: 2025, country: 'DE' },
    {
      id: 3,
      brand: 'Ford',
      model: 'Mustang',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2023,
      country: '',
    },
    {
      id: 4,
      brand: 'Volvo',
      model: 'Volvo 5',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2020,
      country: '',
    },
    {
      id: 5,
      brand: 'Mercedes',
      model: 'TR76',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2024,
      country: '',
    },
    {
      id: 6,
      brand: 'Land Rover',
      model: '88',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2025,
      country: '',
    },
    {
      id: 7,
      brand: 'Toyota',
      model: '8d',
      serviceDate: '2026-03-19T13:23',
      yearBuilt: 2022,
      country: '',
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
    // return this.carApiService.getCarOptions('/cars/options');
  }

  getCountryCodeArray(): Observable<Array<[string, string]>> {
    let countryCodes = new Map<string, string>();
    countryCodes.set('Tesla', 'US');
    countryCodes.set('BMW', 'DE');
    countryCodes.set('Ford', 'US');
    countryCodes.set('Volvo', 'SE');
    countryCodes.set('Land Rover', 'UK');
    countryCodes.set('Toyota', 'JP');

    const array = Array.from(countryCodes.entries());
    return of(array).pipe(delay(1000));
  }

  findAllCars(): Observable<Car[]> {
    return of(this.CAR_DATA);
    // return this.carApiService.get('/cars');
  }

  saveCars(cars: Car[]): Observable<Car[]> {
    return this.carApiService.post<Car[], Car[]>('/cars/bulk-update', cars);
  }
}
