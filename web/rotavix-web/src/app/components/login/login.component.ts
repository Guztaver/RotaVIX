import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  readonly closed = output<void>();

  readonly inputName = signal('');
  readonly showDialog = signal(false);

  open(): void {
    this.inputName.set(this.auth.username() ?? '');
    this.showDialog.set(true);
  }

  close(): void {
    this.showDialog.set(false);
    this.closed.emit();
  }

  submit(): void {
    const ok = this.auth.login(this.inputName());
    if (ok) {
      this.close();
    }
  }

  logout(): void {
    this.auth.logout();
    this.closed.emit();
  }
}
