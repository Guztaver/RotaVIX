import { Location } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginComponent],
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
