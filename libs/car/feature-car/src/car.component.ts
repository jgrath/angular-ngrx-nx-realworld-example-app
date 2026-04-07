import { Component, signal, effect, viewChild, OnInit, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
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
  // 2. Added MatProgressSpinnerModule to imports
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, Field, DatePipe],
})
export class CarComponent implements OnInit {
  private dialog = inject(MatDialog);
  readonly countries = signal<string[]>([]);

  // 3. Changed to 'public store' so the HTML can access store.isCarsLoading()
  public readonly store = inject(CarsListStore);

  constructor() {
    effect(() => {
      const allCarsArray: Car[] = this.store.cars.entities();
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
    this.store.getAllCarData();
    // 5. Ensure loadCars is called to trigger the loading state
    this.store.loadCars();
  }

  getCountryName(abbreviation: string): string {
    const options = this.store.countries();
    const match = options.find((obj) => obj.abbreviation === abbreviation);

    return match?.country ?? abbreviation;
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator();
  }

  saveAllCars() {
    const allCars: CarData[] = this.dataSource().data;
    this.store.saveCars(allCars);
    this.dataSource.set(new MatTableDataSource<CarData>(allCars));
  }

  addNewCar(newCar: CarData) {
    const itemsInArray = this.store.cars().entities.length;
    const maxId = itemsInArray > 0 ? itemsInArray : 0;

    const carToSave = {
      ...newCar,
      id: maxId + 1,
    };

    this.store.addCar(carToSave);
  }

  editCarBrand(car: CarData, newBrand: string) {
    const currentData = this.dataSource();
    const updatedData = currentData.data.map((item) => {
      if (item.id === car.id) {
        return { ...item, brand: newBrand };
      }
      return item;
    });

    this.dataSource.set(new MatTableDataSource<CarData>(updatedData));
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
            buttonText: 'Update',
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
      isEdit ? this.store.updateCarInState(result) : this.addNewCar(result);
    });
  }
}
