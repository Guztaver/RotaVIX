import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
})
export class CookieConsentComponent {
  readonly auth = inject(AuthService);

  accept(): void {
    this.auth.grantConsent();
  }

  reject(): void {
    this.auth.revokeConsent();
  }
}
