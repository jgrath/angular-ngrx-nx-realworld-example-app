import { Profile } from './profile';

export interface Car {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
  yearBuilt: number;
  country: string;
}

export interface CarDataInfo {
  yearBuiltList: number[];
  countriesList: { abbreviation: string; country: string }[];
}

export interface CarResponse {
  car: Car;
}
