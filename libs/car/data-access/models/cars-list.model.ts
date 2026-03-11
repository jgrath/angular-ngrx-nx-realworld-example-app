import { Car } from '../../../core/api-types/src/lib/car';

export interface CarsListState {
  cars: Cars;
  carToUpdate: Car
}

export interface Cars {
  entities: Car[];
}

export const carsListInitialState: CarsListState = {
  cars: {
    entities: [],
  },
};
