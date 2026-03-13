import { Car } from '../../../core/api-types/src/lib/car';

export interface CarsListState {
  cars: Cars;
}

export interface Cars {
  entities: Car[];
}

export const carsListInitialState: CarsListState = {
  cars: {
    entities: [],
  },
};
