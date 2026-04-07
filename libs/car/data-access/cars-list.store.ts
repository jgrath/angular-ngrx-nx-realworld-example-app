import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { carsListInitialState, CarsListState } from './models/cars-list.model';
import { setLoaded, setLoading, withCallState } from '../../core/data-access/src';
import { computed, inject } from '@angular/core';
import { CarsService } from './src/services/cars.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Car, CarDataInfo } from '../../core/api-types/src/lib/car';

export const CarsListStore = signalStore(
  { providedIn: 'root' },

  withState<CarsListState>(carsListInitialState),
  withCallState({ collection: 'getCars' }),
  withCallState({ collection: 'saveCars' }),

  withComputed((store) => ({
    isCarsLoading: computed(() => store.getCarsCallState() === 'loading'),
    isSaving: computed(() => store.saveCarsCallState() === 'loading'),
  })),

  withMethods((store, carsService = inject(CarsService)) => ({
    loadCars: rxMethod<void>(
      pipe(
        tap(() => setLoading('getCars')),
        switchMap(() =>
          forkJoin({
            countryArray: carsService.getCountryCodeArray(),
            cars: carsService.findAllCars(),
          }).pipe(
            tapResponse({
              next: ({ countryArray, cars }) => {
                const countryMap = new Map<string, string>(countryArray);
                const updatedCars = cars.map((car) => ({
                  ...car,
                  country: countryMap.get(car.brand) || 'Unknown',
                }));
                patchState(store, {
                  cars: {
                    entities: updatedCars,
                    lastUpdatedTime: new Date().toISOString(),
                  },
                  ...setLoaded('getCars'),
                });
              },
              error: (error) => {
                console.error(error);
                patchState(store, {
                  ...carsListInitialState,
                  ...setLoaded('getCars'),
                });
              },
            }),
          ),
        ),
      ),
    ),
    updateCarInState: (updatedCar: Car) => {
      patchState(store, {
        cars: {
          ...store.cars(), // Spreads current entities and lastUpdatedTime
          entities: store.cars.entities().map((c) => (c.id === updatedCar.id ? updatedCar : c)),
        },
      });
    },
    updateAllCarsToToday: () => {
      const todayStr = new Date().toISOString().slice(0, 16);

      patchState(store, {
        cars: {
          ...store.cars(), // Spreads current state to keep lastUpdatedTime
          entities: store.cars.entities().map((car) => ({
            ...car,
            serviceDate: todayStr,
          })),
        },
      });
    },
    addCar: (newCar: Car) => {
      patchState(store, {
        cars: {
          ...store.cars(), // Keep lastUpdatedTime
          entities: [...store.cars.entities(), newCar], // Add new car to the end of the list
        },
      });
    },
    saveCars: rxMethod<Car[]>(
      pipe(
        tap(() => setLoading('saveCars')),
        concatMap((carsArray) =>
          carsService.saveCars(carsArray).pipe(
            tapResponse({
              next: (updatedCars: Car[]) => {
                patchState(store, {
                  cars: { entities: updatedCars, lastUpdatedTime: new Date().toISOString() },
                  ...setLoaded('saveCars'),
                });
              },
              error: (error) => {
                console.error('Save failed', error);
              },
            }),
          ),
        ),
      ),
    ),
    getAllCarData: rxMethod<void>(
      pipe(
        tap(() => setLoading('getCarData')), // Assuming you add this to withCallState below
        concatMap(() =>
          carsService.getCarData().pipe(
            tapResponse({
              next: (CarDataInfo) => {
                patchState(store, {
                  yearBuilt: CarDataInfo.yearBuiltList,
                  countries: CarDataInfo.countriesList,
                  ...setLoaded('getCarData'),
                });
              },
              error: (error) => {
                console.error('Failed to load car data', error);
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
