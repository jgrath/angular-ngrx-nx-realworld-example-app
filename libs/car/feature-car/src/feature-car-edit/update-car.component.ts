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
    this.loginForm.brand().value.set(this.data.brand ?? '');
    this.loginForm.model().value.set(this.data.model ?? '');
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
