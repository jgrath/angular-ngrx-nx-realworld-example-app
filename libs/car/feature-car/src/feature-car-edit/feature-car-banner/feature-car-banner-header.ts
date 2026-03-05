import { Component, input, OnInit, effect } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'feature-car-dialog-header',
  standalone: true,
  imports: [MatDialogModule],
  template: `<h2 mat-dialog-title>{{ bannerText() }}</h2>`,
  styleUrls: ['../update.car.component.css'],
})
export class FeatureCarComponent implements OnInit {
  readonly bannerText = input<string>('Default Banner');

  ngOnInit() {
    // 3. Access as a function: this.bannerText()
    console.log('Banner received on init:', this.bannerText());
  }
}