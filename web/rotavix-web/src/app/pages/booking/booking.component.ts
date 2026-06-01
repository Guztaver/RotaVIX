import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouteService, type BookingRequest, type RouteResult } from '../../services/route.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit, OnDestroy {
  private readonly routeService = inject(RouteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = this.routeService.loading;
  readonly error = this.routeService.error;
  readonly routeData = this.routeService.selectedRoute;
  readonly bookingResult = this.routeService.bookingResult;

  readonly bookingForm = inject(FormBuilder).nonNullable.group({
    passengerName: ['', [Validators.required, Validators.minLength(3)]],
    passengerEmail: ['', [Validators.required, Validators.email]],
    passengerPhone: ['', [Validators.required, Validators.minLength(10)]],
    passengerDocument: ['', [Validators.required, Validators.minLength(11)]],
    seatNumber: [1, [Validators.required, Validators.min(1)]],
    paymentMethod: ['pix', Validators.required],
  });

  readonly selectedSeat = signal(1);
  readonly maxSeats = signal(40);
  readonly step = signal<'details' | 'confirm'>('details');

  private sub?: Subscription;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // If we already have route data from the listing, use it
    const existing = this.routeService.selectedRoute();
    if (existing && existing.id === id) {
      this.maxSeats.set(existing.availableSeats);
    } else if (id) {
      this.routeService.getRouteById(id).subscribe({
        next: (route) => this.maxSeats.set(route.availableSeats),
        error: () => this.router.navigate(['/']),
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  selectSeat(seat: number): void {
    this.selectedSeat.set(seat);
    this.bookingForm.controls.seatNumber.setValue(seat);
  }

  goToConfirm(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    this.step.set('confirm');
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.routeData()) return;

    const formValue = this.bookingForm.getRawValue();
    const booking: BookingRequest = {
      routeId: this.routeData()!.id,
      passengerName: formValue.passengerName,
      passengerDocument: formValue.passengerDocument,
      seatNumber: formValue.seatNumber,
    };

    this.routeService.createBooking(booking).subscribe({
      next: (result) => {
        if (result) {
          this.step.set('details'); // mark it as done via bookingResult signal
        }
      },
    });
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  /** Build an array of seat numbers available */
  get seatNumbers(): number[] {
    return Array.from({ length: this.maxSeats() }, (_, i) => i + 1);
  }
}
