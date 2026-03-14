import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@realworld/core/api-types';
import { CarsListStore } from '@realworld/car/data-access/cars-list.store';

@Component({
  selector: 'cdt-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly user = input.required<User>();

  protected readonly isLoggedIn = input.required<boolean>();

  private readonly carsListStore = inject(CarsListStore);


}
