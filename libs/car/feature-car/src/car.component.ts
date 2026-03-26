import { Component, signal, effect, viewChild, OnInit, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { Field } from '@angular/forms/signals';
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
  yearBuilt: number;
  country: string;
}

@Component({
  selector: 'cdt-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  imports: [MatTableModule, MatPaginatorModule, Field, DatePipe],
})
export class CarComponent implements OnInit {
  private dialog = inject(MatDialog);
  readonly countries = signal<string[]>([]);

  private readonly carsListStore = inject(CarsListStore);

  constructor() {
    effect(() => {
      const allCarsArray: Car[] = this.carsListStore.cars.entities();
      const currentDataSource = this.dataSource();
      currentDataSource.data = allCarsArray as CarData[];
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  displayedColumns: string[] = ['id', 'brand', 'model', 'yearBuilt', 'country', 'serviceDate', 'actions'];

  readonly dataSource = signal(new MatTableDataSource<CarData>([]));
  readonly paginator = viewChild(MatPaginator);
  readonly updateDate = signal(false);

  ngOnInit(): void {
    this.updateDate.set(true);
    this.carsListStore.getAllCarData();
  }

  getCountryName(abbreviation: string): string {
    const options = this.carsListStore.countries();
    const match = options.find((obj) => obj.abbreviation === abbreviation);

    return match?.country ?? abbreviation;
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator();
  }

  saveAllCars() {
    // 1. Get the current data array from the Signal's DataSource
    const allCars: CarData[] = this.dataSource().data;

    this.carsListStore.saveCars(allCars);

    this.dataSource.set(new MatTableDataSource<CarData>(allCars));
  }

  addNewCar(newCar: CarData) {
    // 1. In SignalStore, cars() returns the current state of that slice.
    const itemsInArray = this.carsListStore.cars().entities.length;

    // 4. Calculate Max ID (ensuring numeric conversion)
    const maxId = itemsInArray > 0 ? itemsInArray : 0;

    const carToSave = {
      ...newCar,
      id: maxId + 1,
    };

    // 5. Update Store
    this.carsListStore.addCar(carToSave);
  }

  editCarBrand(car: CarData, newBrand: string) {
    const currentData: MatTableDataSource<CarData, MatPaginator> = this.dataSource();
    const updatedData = currentData.data.map((item) => {
      if (item.id === car.id) {
        return { ...item, brand: car.model };
      }
      return item;
    });

    this.dataSource.set(new MatTableDataSource<CarData>(updatedData));

    console.log('Updated car:', car.id, 'to brand:', car.model);
  }

  openCarDialog(car?: CarData): void {
    const isEdit = !!car?.id;

    const dialogRef = this.dialog.open(CarDialogComponent, {
      width: '500px',
      height: '600px',
      data: isEdit
        ? {
            ...car,
            bannerText: 'Edit Car Details',
            buttonText: 'Update', // Set text for editing
          }
        : {
            yearBuilt: '',
            brand: '',
            model: '',
            serviceDate: '',
            bannerText: 'Add New Car',
            buttonText: 'Add',
          },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const isEdit = !!car?.id;
      if (!result) return;
      isEdit ? this.carsListStore.updateCarInState(result) : this.addNewCar(result);
    });
  }
}
