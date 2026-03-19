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
  buttonText: string = 'Add New';
  constructor(
    public dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bannerText = this.data?.id ? 'Edit Car Details' : 'Add New Car';
    this.buttonText = this.data?.id ? 'Update' : 'Add New';
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
    const rawDate = new Date(this.data.serviceDate);
    const formattedDate = rawDate.toISOString().substring(0, 16); // Results in "YYYY-MM-DDTHH:mm"

    this.loginForm.brand().value.set(this.data.brand ?? '');
    this.loginForm.model().value.set(this.data.model ?? '');
    this.loginForm.serviceDate().value.set(formattedDate);
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
