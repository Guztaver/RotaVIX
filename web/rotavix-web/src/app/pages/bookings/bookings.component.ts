import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BookingResponse } from '../../services/route.service';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsPage implements OnInit {
  private readonly routeService = inject(RouteService);
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly bookings = signal<BookingResponse[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const username = this.auth.username();
    if (username) {
      this.loadBookings(username);
    }
  }

  loadBookings(username: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.routeService.getBookingsByUsername(username).subscribe({
      next: (list) => {
        this.bookings.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar as reservas.');
        this.loading.set(false);
      },
    });
  }

  formatPrice(p: number): string {
    return `R$ ${p.toFixed(2).replace('.', ',')}`;
  }
}
