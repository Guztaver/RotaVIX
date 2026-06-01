import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

/* ------------------------------------------------------------------ */
/* Type definitions                                                    */
/* ------------------------------------------------------------------ */

export interface RouteSearchParams {
  origin: string;
  destination: string;
  date: string;
}

export interface RouteResult {
  id: number;
  company: string;
  companyLogo?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  busType: string;
  date: string;
  amenities?: string[];
}

export interface BookingRequest {
  routeId: number;
  passengerName: string;
  passengerEmail?: string;
  passengerPhone?: string;
  passengerDocument: string;
  seatNumber: number;
  paymentMethod?: string;
}

export interface BookingResponse {
  id: number;
  routeId: number;
  passengerName: string;
  passengerDocument: string;
  seatNumber: number;
  bookingDate: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Service                                                            */
/* ------------------------------------------------------------------ */

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly apiBase = environment.apiBase;

  /* --- State signals --- */
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly routes = signal<RouteResult[]>([]);
  readonly selectedRoute = signal<RouteResult | null>(null);
  readonly bookingResult = signal<BookingResponse | null>(null);

  constructor(private readonly http: HttpClient) {}

  /* ------------------------------------------------------------------ */
  /* Route search                                                       */
  /* ------------------------------------------------------------------ */

  searchRoutes(params: RouteSearchParams): Observable<RouteResult[]> {
    this.loading.set(true);
    this.error.set(null);

    const httpParams = new HttpParams()
      .set('origin', params.origin)
      .set('destination', params.destination)
      .set('date', params.date);

    return this.http
      .get<RouteResult[]>(`${this.apiBase}/routes/search`, {
        params: httpParams,
      })
      .pipe(
        tap((results) => this.routes.set(results)),
        catchError((err: HttpErrorResponse) => {
          const message = err.error?.message ?? err.message ?? 'Falha ao buscar rotas.';
          this.error.set(message);
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  /* ------------------------------------------------------------------ */
  /* Get route by ID                                                    */
  /* ------------------------------------------------------------------ */

  getRouteById(id: number): Observable<RouteResult> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<RouteResult>(`${this.apiBase}/routes/${id}`).pipe(
      tap((route) => this.selectedRoute.set(route)),
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message ?? err.message ?? 'Falha ao carregar a rota.';
        this.error.set(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  /* ------------------------------------------------------------------ */
  /* Create booking                                                     */
  /* ------------------------------------------------------------------ */

  createBooking(booking: BookingRequest): Observable<BookingResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<BookingResponse>(`${this.apiBase}/bookings`, booking).pipe(
      tap((result) => this.bookingResult.set(result)),
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message ?? err.message ?? 'Falha ao criar reserva.';
        this.error.set(message);
        return throwError(() => new Error(message));
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */

  clearError(): void {
    this.error.set(null);
  }

  clearSelectedRoute(): void {
    this.selectedRoute.set(null);
    this.routes.set([]);
  }
}
