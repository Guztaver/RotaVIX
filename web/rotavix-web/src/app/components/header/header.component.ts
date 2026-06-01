import { Component, input, output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly showBack = input(false);
  readonly refreshed = output<void>();

  constructor(
    private readonly location: Location,
    private readonly router: Router,
  ) {}

  goBack(): void {
    this.location.back();
  }

  refresh(): void {
    this.refreshed.emit();
  }
}
