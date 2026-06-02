import { HttpClient, type HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, type Observable, of, tap, throwError } from 'rxjs';
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
  username?: string;
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

/** Structured error for the UI */
export interface AppError {
  /** Short user-friendly summary */
  summary: string;
  /** Optional detailed messages (e.g. individual validation errors) */
  details?: string[];
  /** HTTP status code if available */
  status?: number;
}

/* ------------------------------------------------------------------ */
/* Error extraction helpers                                           */
/* ------------------------------------------------------------------ */

/**
 * Parse an HttpErrorResponse into a user-friendly AppError.
 * Handles NestJS ValidationPipe errors (string, string[], or object),
 * network errors, and generic HTTP errors.
 */
function extractError(err: HttpErrorResponse): AppError {
  // Network error (offline, CORS, timeout)
  if (err.status === 0) {
    return {
      summary: 'Sem conexão com o servidor.',
      details: ['Verifique sua internet e tente novamente.'],
      status: 0,
    };
  }

  const body = err.error;
  const rawMessage: unknown = body?.message ?? body?.error ?? err.message;

  // NestJS ValidationPipe often returns message as an array of strings
  if (Array.isArray(rawMessage)) {
    const details = rawMessage.map((m) => String(m));
    return {
      summary: 'Dados inválidos. Corrija os erros abaixo:',
      details,
      status: err.status,
    };
  }

  // Single string message
  if (typeof rawMessage === 'string' && rawMessage.length > 0) {
    return {
      summary: rawMessage,
      status: err.status,
    };
  }

  // Object with nested messages (NestJS class-validator sometimes returns this)
  if (typeof rawMessage === 'object' && rawMessage !== null) {
    const details = flattenErrorObject(rawMessage as Record<string, unknown>);
    if (details.length > 0) {
      return {
        summary: 'Dados inválidos. Verifique os campos abaixo:',
        details,
        status: err.status,
      };
    }
  }

  // Fallback for specific HTTP statuses
  switch (err.status) {
    case 400:
      return { summary: 'Requisição inválida. Verifique os dados enviados.', status: 400 };
    case 404:
      return { summary: 'Recurso não encontrado.', status: 404 };
    case 500:
      return { summary: 'Erro interno do servidor. Tente novamente mais tarde.', status: 500 };
    default:
      return { summary: 'Ocorreu um erro inesperado. Tente novamente.', status: err.status };
  }
}

/** Recursively flatten a nested error object into user-friendly strings */
function flattenErrorObject(obj: Record<string, unknown>, prefix = ''): string[] {
  const result: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const label = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          result.push(item);
        } else if (typeof item === 'object' && item !== null) {
          result.push(...flattenErrorObject(item as Record<string, unknown>, label));
        }
      }
    } else if (typeof value === 'string') {
      result.push(value);
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenErrorObject(value as Record<string, unknown>, label));
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Service                                                            */
/* ------------------------------------------------------------------ */

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly apiBase = environment.apiBase;

  /* --- State signals --- */
  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);

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
          this.error.set(extractError(err));
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
        this.error.set(extractError(err));
        return throwError(() => new Error(extractError(err).summary));
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
        this.error.set(extractError(err));
        return throwError(() => new Error(extractError(err).summary));
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  /* ------------------------------------------------------------------ */
  /* Get bookings by username                                           */
  /* ------------------------------------------------------------------ */

  getBookingsByUsername(username: string): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiBase}/bookings`, {
      params: new HttpParams().set('username', username),
    });
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
