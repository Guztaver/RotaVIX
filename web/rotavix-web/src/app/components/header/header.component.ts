import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly showBack = input(false);

  private readonly location = inject(Location);
  readonly auth = inject(AuthService);

  goBack(): void {
    this.location.back();
  }
}
