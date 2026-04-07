import { Car } from '../../../core/api-types/src/lib/car';

export interface Country {
  abbreviation: string;
  country: string;
}


export interface CarsListState {
  cars: Cars;
  // Add these two lines:
  yearBuilt: number[];
  countries: Country[];
  carsLoading: boolean
}

export interface Cars {
  entities: Car[];
  lastUpdatedTime: string;
}

export const carsListInitialState: CarsListState = {
  cars: {
    entities: [],
    lastUpdatedTime: '',
  },
  // Initialize them here:
  yearBuilt: [],
  countries: [],
  carsLoading: false
};
