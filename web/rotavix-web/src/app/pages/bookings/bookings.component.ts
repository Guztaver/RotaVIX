import { DatePipe } from '@angular/common';
import { Component, inject, type OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BookingResponse } from '../../services/route.service';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';

const SAMPLE_BOOKINGS: BookingResponse[] = [
  {
    id: 1024,
    routeId: 1,
    passengerName: 'Maria Silva',
    passengerDocument: '***.456.789-**',
    seatNumber: 12,
    bookingDate: '2026-06-15',
    createdAt: '2026-06-01T10:30:00Z',
  },
  {
    id: 1023,
    routeId: 2,
    passengerName: 'João Santos',
    passengerDocument: '***.123.654-**',
    seatNumber: 8,
    bookingDate: '2026-06-10',
    createdAt: '2026-05-28T14:15:00Z',
  },
  {
    id: 1022,
    routeId: 3,
    passengerName: 'Ana Costa',
    passengerDocument: '***.789.321-**',
    seatNumber: 22,
    bookingDate: '2026-06-05',
    createdAt: '2026-05-25T09:00:00Z',
  },
];

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
    } else {
      this.bookings.set(SAMPLE_BOOKINGS);
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
