import { Component, signal, effect, viewChild, OnInit, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CarDialogComponent } from './feature-car-edit/update-car.component';
import { CarsListStore } from '@realworld/car/data-access/cars-list.store';
import { Car } from '@realworld/core/api-types/src/lib/car';

export interface CarData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
  yearBuilt: number;
  country: string;
}

@Component({
  selector: 'cdt-car',
  standalone: true,
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
  ],
})
export class CarComponent implements OnInit, AfterViewInit, OnDestroy {
  private dialog = inject(MatDialog);
  public readonly store = inject(CarsListStore);

  displayedColumns: string[] = ['id', 'brand', 'model', 'yearBuilt', 'country', 'serviceDate', 'actions'];
  readonly dataSource = signal(new MatTableDataSource<CarData>([]));
  readonly paginator = viewChild(MatPaginator);

  // Debounce stream for search
  private searchSubject = new Subject<string>();

  constructor() {
    effect(() => {
      const allCarsArray: Car[] = this.store.cars.entities();
      this.dataSource().data = allCarsArray as CarData[];
    });

    // Initialize debounce listener (300ms delay)
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => this.executeFilter(value));
  }

  ngOnInit(): void {
    this.store.getAllCarData();
    this.store.loadCars();

    // Custom Filter Predicate to handle Country Names
    this.dataSource().filterPredicate = (data: CarData, filter: string) => {
      const countryDisplayName = this.getCountryName(data.country).toLowerCase();
      const searchTerms = (data.brand + data.model + data.yearBuilt + countryDisplayName).toLowerCase();

      return searchTerms.includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator() ?? null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement)?.value || '';
    this.searchSubject.next(filterValue);
  }

  private executeFilter(value: string) {
    this.dataSource().filter = value.trim().toLowerCase();
    this.paginator()?.firstPage();
  }

  getCountryName(abbreviation: string): string {
    const options = this.store.countries();
    const match = options.find((obj) => obj.abbreviation === abbreviation);
    return match?.country ?? abbreviation;
  }

  saveAllCars() {
    this.store.saveCars(this.dataSource().data);
  }

  openCarDialog(car?: CarData): void {
    const isEdit = !!car?.id;
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '500px',
      height: '600px',
      data: isEdit
        ? { ...car, bannerText: 'Edit Car Details', buttonText: 'Update' }
        : { brand: '', model: '', bannerText: 'Add New Car', buttonText: 'Add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      isEdit ? this.store.updateCarInState(result) : this.store.addCar({ ...result, id: Date.now() });
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
