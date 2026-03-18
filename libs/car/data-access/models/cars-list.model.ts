import { Car } from '../../../core/api-types/src/lib/car';

export interface CarsListState {
  cars: Cars;
}

export interface Cars {
  entities: Car[],
  lastUpdatedTime: string;
}

export const carsListInitialState: CarsListState = {
  cars: {
    entities: [],
    lastUpdatedTime: '',
  },
};
