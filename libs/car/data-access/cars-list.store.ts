import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { carsListInitialState, CarsListState } from './models/cars-list.model';
import { setLoaded, setLoading, withCallState } from '../../core/data-access/src';
import { inject } from '@angular/core';
import { CarsService } from './src/services/cars.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Car } from '../../core/api-types/src/lib/car';

export const CarsListStore = signalStore(
  { providedIn: 'root' },

  withState<CarsListState>(carsListInitialState),

  withMethods((store, carsService = inject(CarsService)) => ({
    loadCars: rxMethod<string>(
      pipe(
        tap(() => setLoading('getCars')),
        concatMap(() =>
          carsService.findAllCars().pipe(
            tapResponse({
              next: (carsArray: Car[]) => {
                patchState(store, {
                  cars: { entities: carsArray },
                  ...setLoaded('getCars'),
                });
              },
              error: () => {
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
          entities: store.cars.entities().map((c) => (c.id === updatedCar.id ? updatedCar : c)),
        },
      });
    },
    updateAllCarsToToday: () => {
      const todayStr = new Date().toISOString().slice(0, 16);

      patchState(store, {
        cars: {
          entities: store.cars.entities().map((car) => ({
            ...car,
            serviceDate: todayStr,
          })),
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
                  cars: { entities: updatedCars },
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
  })),

  withCallState({ collection: 'getCars' }),
  withCallState({ collection: 'saveCars' }),
);
