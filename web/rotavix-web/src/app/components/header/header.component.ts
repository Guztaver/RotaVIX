import { Location } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly showBack = input(false);
  readonly refreshed = output<void>();

  constructor(private readonly location: Location) {}

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    this.refreshed.emit();
  }
}
