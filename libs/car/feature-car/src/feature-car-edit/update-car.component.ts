import { Component, Inject, signal, Input, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { form, Field, required } from '@angular/forms/signals';
import { FeatureCarComponent } from './feature-car-banner/feature-car-banner-header';
import { CarsListStore } from '@realworld/car/data-access/cars-list.store';

interface CarFormData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
  yearBuilt: string;
  country: string;
}

@Component({
  selector: 'app-car-dialog',
  standalone: true,
  imports: [MatDialogModule, Field, FeatureCarComponent],
  templateUrl: './update-car-component.html',
  styleUrls: ['./update.car.component.css'],
})
export class CarDialogComponent implements OnInit {
  @Input() bannerText: string;
  buttonText: string = 'Add New';
  private readonly carsListStore = inject(CarsListStore);
  years: number[] = this.carsListStore.yearBuilt();
  countries: { abbreviation: string; country: string }[] = this.carsListStore.countries();

  constructor(
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bannerText = this.data?.id ? 'Edit Car Details' : 'Add New Car';
    this.buttonText = this.data?.id ? 'Update' : 'Add New';
  }

  carModel = signal<CarFormData>({
    id: this.data.id || 0,
    brand: '',
    model: '',
    serviceDate: '',
    yearBuilt: this.data.yearBuilt || '', // Only one 'yearBuilt' key allowed
    country: this.data.country || '', // Only one 'country' key allowed
  });

  carForm = form(this.carModel, (schemaPath) => {
    required(schemaPath.brand, { message: 'Brand is required' });
    required(schemaPath.model, { message: 'Model is required' });
    required(schemaPath.yearBuilt, { message: 'Year is required' });
    required(schemaPath.country, { message: 'Country is required' });
  });

  ngOnInit() {
    // Check if serviceDate exists, otherwise use current date as fallback
    const rawDate = this.data.serviceDate ? new Date(this.data.serviceDate) : new Date();
    const formattedDate = rawDate.toISOString().substring(0, 16);

    this.carForm.brand().value.set(this.data.brand ?? '');
    this.carForm.model().value.set(this.data.model ?? '');
    this.carForm.serviceDate().value.set(formattedDate);

    // Set initial values for the dropdowns
    //this.carForm.yearBuilt().value.set(this.data.yearBuilt);
    //this.carForm.country().value.set(this.data.country ?? null);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    //if (this.carForm.invalid()) {
    // return;
    // }
    const updatedData = this.carForm().value();
    this.dialogRef.close(updatedData);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.onUpdate();
  }
}
