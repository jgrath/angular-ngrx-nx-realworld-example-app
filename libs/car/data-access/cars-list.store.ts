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
        concatMap((listConfig) =>
          carsService.findAllCars().pipe(
            tapResponse({
              next: (carsArray: { cars: Car[] }) =>
                patchState(store, {
                  cars: {
                    entities: carsArray.cars,
                  },
                  ...setLoaded('getCars'),
                }),
              error: (error) => {
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
  })),
  withCallState({ collection: 'getCars' }),
);
