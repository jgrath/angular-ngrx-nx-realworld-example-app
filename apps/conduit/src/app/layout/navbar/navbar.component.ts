import { Component, ChangeDetectionStrategy, input, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@realworld/core/api-types';
import { CarsListStore } from '@realworld/car/data-access/cars-list.store';

@Component({
  selector: 'cdt-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  protected readonly user = input.required<User>();

  protected readonly isLoggedIn = input.required<boolean>();

  private readonly carsListStore = inject(CarsListStore);

  vehicleLabel = signal('Car');

  ngOnInit(): void {
    this.carsListStore.loadCars();
    const carEntities = this.carsListStore.cars.entities();

    if (carEntities.length > 1) {
      this.vehicleLabel.set('Cars');
    }

  }
}
