import { Profile } from './profile';

export interface Car {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
}

export interface CarResponse {
  car: Car;
}
