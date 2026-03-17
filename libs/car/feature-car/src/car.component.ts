import {
  Component,
  signal,
  effect,
  viewChild,
  OnInit,
  inject,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { email, form, Field, required } from '@angular/forms/signals';
import { CarDialogComponent } from './feature-car-edit/update-car.component';
import { MatDialog } from '@angular/material/dialog';
import { CarsListStore } from '@realworld/car/data-access/cars-list.store';
import { Car } from '@realworld/core/api-types/src/lib/car';
import { DatePipe } from '@angular/common';

export interface CarData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
}

@Component({
  selector: 'cdt-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  imports: [MatTableModule, MatPaginatorModule, Field, DatePipe],
})
export class CarComponent implements OnInit {
  private dialog = inject(MatDialog);

  private readonly carsListStore = inject(CarsListStore);

  constructor() {
    effect(() => {
        const allCarsArray: Car[] = this.carsListStore.cars.entities();
        this.dataSource.set(new MatTableDataSource<CarData>(allCarsArray));
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  displayedColumns: string[] = ['id', 'brand', 'model', 'actions', 'serviceDate'];

  readonly dataSource = signal(new MatTableDataSource<CarData>([]));
  readonly paginator = viewChild(MatPaginator);
  readonly updateDate = signal(false);

  ngOnInit(): void {
    this.updateDate.set(true);
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator();
  }

  addCar() {
    console.log('btton');
    this.updateDate.set(true);
  }

  saveAllCars() {
    // 1. Get the current data array from the Signal's DataSource
    const allCars: CarData[] = this.dataSource().data;

    this.carsListStore.saveCars(allCars);

    this.dataSource.set(new MatTableDataSource<CarData>(allCars));
  }

  deleteCar(car: string) {
    console.log(car);
  }

  editCarBrand(car: CarData, newBrand: string) {
    // 1. Get the current array from the signal's data source
    const currentData: MatTableDataSource<CarData, MatPaginator> = this.dataSource();
    // 2. Find and update the specific car
    // Filter
    const updatedData = currentData.data.map((item) => {
      if (item.id === car.id) {
        return { ...item, brand: car.model }; // Create a new object with the updated brand
      }
      return item;
    });

    // 3. Reassign the data to trigger the table refresh
    this.dataSource.set(new MatTableDataSource<CarData>(updatedData));

    console.log('Updated car:', car.id, 'to brand:', car.model);
  }

  openCarDialog(car?: any): void {
    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '500px',
      height: '430px',
      data: car ? { ...car, bannerText: 'Edit Car Details' } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed with:', result);
        this.carsListStore.updateCarInState(result);
      }
    });
  }
}
