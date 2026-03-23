import { Component, Inject, signal, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { form, Field, required } from '@angular/forms/signals';
import { FeatureCarComponent } from './feature-car-banner/feature-car-banner-header';

interface LoginData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
  yearBuilt: string | null; // Allow null
  country: string | null; // Allow null
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

  // Extract lookup arrays passed from CarComponent
  years: number[] = this.data.yearBuiltOptions || [];
  countries: { abbreviation: string; country: string }[] = this.data.countriesOptions || [];

  constructor(
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bannerText = this.data?.id ? 'Edit Car Details' : 'Add New Car';
    this.buttonText = this.data?.id ? 'Update' : 'Add New';
  }

  loginModel = signal<LoginData>({
    id: this.data.id || 0,
    brand: '',
    model: '',
    serviceDate: '',
    yearBuilt: this.data.yearBuilt?.toString() ?? null, // Default to null
    country: this.data.country ?? null,
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.brand, { message: 'Brand is required' });
    required(schemaPath.model, { message: 'Model is required' });
    required(schemaPath.yearBuilt, { message: 'Year is required' });
    required(schemaPath.country, { message: 'Country is required' });
  });

  ngOnInit() {
    // Check if serviceDate exists, otherwise use current date as fallback
    const rawDate = this.data.serviceDate ? new Date(this.data.serviceDate) : new Date();
    const formattedDate = rawDate.toISOString().substring(0, 16);

    this.loginForm.brand().value.set(this.data.brand ?? '');
    this.loginForm.model().value.set(this.data.model ?? '');
    this.loginForm.serviceDate().value.set(formattedDate);

    // Set initial values for the dropdowns
    this.loginForm.yearBuilt().value.set(this.data.yearBuilt?.toString() ?? null);
    this.loginForm.country().value.set(this.data.country ?? null);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    //  if (this.loginForm.invalid()) {
    //  return;
    // }
    const updatedData = this.loginForm().value();
    this.dialogRef.close(updatedData);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.onUpdate();
  }
}
