import { Component, Inject, signal, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { email, form, Field, required } from '@angular/forms/signals'; // Import FormField/Field
import { FeatureCarComponent } from './feature-car-banner/feature-car-banner-header';

interface LoginData {
  id: number;
  brand: string;
  model: string;
  serviceDate: string;
}

@Component({
  selector: 'app-car-dialog',
  standalone: true,
  imports: [MatDialogModule, Field, FeatureCarComponent],
  templateUrl: './update-car-component.html',
  styleUrls: ['./update.car.component.css'],
})
export class CarDialogComponent {
  @Input() bannerText: string;
  constructor(
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Receives the 'car' object
  ) {
    this.bannerText = 'Edit car details';
  }

  loginModel = signal<LoginData>({
    id: this.data.id,
    brand: '',
    model: '',
    serviceDate: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.brand, { message: 'Brand is required' });
    required(schemaPath.model, { message: 'Model is required' });
  });

  ngOnInit() {
    const now = new Date();

    // Format to YYYY-MM-DDTHH:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.loginForm.brand().value.set(this.data.brand ?? '');
    this.loginForm.model().value.set(this.data.model ?? '');
    this.loginForm.serviceDate().value.set(formattedDateTime);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    console.log('Updated Brand:', this.loginForm.brand().value());
    console.log('Updated Model:', this.loginForm.model().value());
    console.log('Updated serviceDate:', this.loginForm.serviceDate().value());
    const formState = this.loginForm();

    const updatedData = formState.value;

    console.log('Form Data:', updatedData());
    this.dialogRef.close(updatedData());
  } // Pass data back

  onSubmit(event: Event) {
    event.preventDefault();
    // Perform login logic here
  }
}
