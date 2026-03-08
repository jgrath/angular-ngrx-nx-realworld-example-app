import { Component, signal, AfterViewInit, ViewChild, effect, viewChild, OnInit, Signal, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { email, form, Field, required } from '@angular/forms/signals';
import { CarDialogComponent } from './feature-car-edit/update-car.component';
import { MatDialog } from '@angular/material/dialog';

export interface CarData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
}

const CAR_DATA: CarData[] = [
  { id: 1, brand: 'Tesla', model: 'Model 3', serviceDate: '2026-03-19T13:23' },
  { id: 2, brand: 'BMW', model: 'X5', serviceDate: '2026-03-19T13:23' },
  { id: 3, brand: 'Ford', model: 'Mustang', serviceDate: '2026-03-19T13:23' },
  { id: 4, brand: 'Volvo', model: 'Volvo 5', serviceDate: '2026-03-19T13:23' },
  { id: 5, brand: 'Mercedes', model: 'TR76', serviceDate: '2026-03-19T13:23' },
  { id: 6, brand: 'Toyota', model: '88', serviceDate: '2026-03-19T13:23' },
  { id: 7, brand: 'Toyota22', model: '8d', serviceDate: '2026-03-19T13:23' },
  // ... Add at least 6+ items to see the pagination work
];

@Component({
  selector: 'cdt-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
  imports: [MatTableModule, MatPaginatorModule, Field],
})
export class CarComponent implements OnInit {
  private dialog = inject(MatDialog); // ✅ Recommended
  constructor() {
    effect(() => {
      if (this.updateDate()) {
        console.log('is ');
        this.dataSource.set(new MatTableDataSource<CarData>(CAR_DATA));
      }
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
    // Paginator is guaranteed to be available here, but not in ngOnInit
    this.dataSource().paginator = this.paginator();
  }

  addCar() {
    console.log('btton');
    this.dataSource.set(new MatTableDataSource<CarData>(CAR_DATA));
    this.updateDate.set(true);
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
        // Handle the saved data (e.g., update your Signal or DataSource)
        console.log('The dialog was closed with:', result);
        const table = this.dataSource();
        // 2. Find and update the specific car
        // Filter

        const updatedArray = table.data.map((item) => {
          if (item.id === result.id) {
            // Merge the old item with the new result data
            return { ...item, ...result };
          }
          return item;
        });

        // 3. Update the data property of the existing DataSource
        table.data = updatedArray;

        // 4. Update the Signal so the template refreshes
        this.dataSource.set(table);
      }
    });
  }

  private updateCarInList(updatedCar: CarData): void {
    this.dataSource.update((table) => {
      // 1. Create a NEW array (Immutability is key for Change Detection)
      const newData = table.data.map((item) => (item.id === updatedCar.id ? { ...item, ...updatedCar } : item));

      // 2. Update the data property of the existing DataSource
      table.data = newData;

      // 3. Return the table instance so the Signal notifies the UI
      return table;
    });
  }
}

// visual code
// rewrite to signal
// use method
