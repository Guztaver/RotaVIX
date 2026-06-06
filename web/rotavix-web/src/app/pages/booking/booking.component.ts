import { DatePipe } from '@angular/common';
import { Component, inject, type OnDestroy, type OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { type BookingRequest, RouteService } from '../../services/route.service';

function isValidCpf(
  control: import('@angular/forms').AbstractControl,
): import('@angular/forms').ValidationErrors | null {
  if (!control.value) return null;
  let cpf = control.value.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return { cpf: true };
  const cpfNumbers = cpf.split('').map((el: string) => +el);
  const rest = (count: number) =>
    ((cpfNumbers
      .slice(0, count - 12)
      .reduce((soma: number, el: number, index: number) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;
  return rest(10) === cpfNumbers[9] && rest(11) === cpfNumbers[10] ? null : { cpf: true };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit, OnDestroy {
  private readonly routeService = inject(RouteService);
  private readonly auth = inject(AuthService);
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
    passengerDocument: ['', [Validators.required, isValidCpf]],
    seatNumber: [1, [Validators.required, Validators.min(1)]],
    paymentMethod: ['pix', Validators.required],
    cardNumber: [''],
  });

  readonly selectedSeat = signal(1);
  readonly maxSeats = signal(40);
  readonly step = signal<'details' | 'confirm'>('details');

  private sub?: Subscription;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
    if (this.isSeatOccupied(seat)) return;
    this.selectedSeat.set(seat);
    this.bookingForm.controls.seatNumber.setValue(seat);
  }

  isSeatOccupied(seat: number): boolean {
    return this.routeData()?.occupiedSeats?.includes(seat) ?? false;
  }

  goToConfirm(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    this.step.set('confirm');
  }

  submitBooking(): void {
    if (this.bookingForm.invalid || !this.routeData()) {
      return;
    }

    const formValue = this.bookingForm.getRawValue();
    const username = this.auth.username();
    const booking: BookingRequest = {
      routeId: this.routeData()!.id,
      passengerName: formValue.passengerName,
      passengerEmail: formValue.passengerEmail,
      passengerPhone: formValue.passengerPhone,
      passengerDocument: formValue.passengerDocument,
      seatNumber: formValue.seatNumber,
      paymentMethod: formValue.paymentMethod,
      username: username ?? undefined,
    };

    this.routeService.createBooking(booking).subscribe({
      next: (result) => {
        if (result) {
          this.step.set('details');
        }
      },
    });
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  get seatNumbers(): number[] {
    return Array.from({ length: this.maxSeats() }, (_, i) => i + 1);
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    let formatted = value;
    if (value.length > 9) {
      formatted = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      formatted = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      formatted = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    input.value = formatted;
    this.bookingForm.controls.passengerDocument.setValue(formatted);
  }

  /** Auto-format card number as XXXX-XXXX-XXXX-XXXX */
  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    const groups = value.match(/.{1,4}/g) ?? [];
    const formatted = groups.join('-');
    input.value = formatted;
    this.bookingForm.controls.cardNumber.setValue(formatted);
  }

  /** Fake boleto barcode for display */
  get boletoCode(): string {
    const block = () =>
      String(Math.floor(Math.random() * 100000))
        .padStart(5, '0')
        .replace(/(\d{5})(\d{1,5})/, '$1.$2');
    return `${block()} ${block()} ${block()} ${block()} 9 ${String(Math.floor(Math.random() * 1e14)).padStart(14, '0')}`;
  }

  /** Get payment method display name */
  get paymentLabel(): string {
    const method = this.bookingForm.controls.paymentMethod.value;
    switch (method) {
      case 'pix':
        return 'Pix';
      case 'credit':
        return 'Cartão de crédito';
      case 'boleto':
        return 'Boleto bancário';
      default:
        return method;
    }
  }
}
