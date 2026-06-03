import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CreateBookingDto } from './dto/create-booking.dto';

const DATA_DIR = join(process.cwd(), 'data');
const ROUTES_FILE = join(DATA_DIR, 'routes.json');
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json');

export interface BusRoute {
  id: number;
  origin: string;
  destination: string;
  company: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  busType: 'Leito' | 'Executivo' | 'Convencional';
  date: string;
}

export interface Booking {
  id: number;
  routeId: number;
  passengerName: string;
  passengerDocument: string;
  seatNumber: number;
  bookingDate: string;
  createdAt: string;
  username?: string;
}

function loadJson<T>(filePath: string): T {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function saveJson<T>(filePath: string, data: T): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

@Injectable()
export class RoutesService {
  private routes: BusRoute[];
  private bookings: Booking[];
  private nextBookingId: number;

  constructor() {
    this.routes = loadJson<BusRoute[]>(ROUTES_FILE);
    this.bookings = loadJson<Booking[]>(BOOKINGS_FILE);
    this.nextBookingId =
      this.bookings.length > 0 ? Math.max(...this.bookings.map((b) => b.id)) + 1 : 1;
  }

  private saveRoutes(): void {
    saveJson(ROUTES_FILE, this.routes);
  }

  private saveBookings(): void {
    saveJson(BOOKINGS_FILE, this.bookings);
  }

  findAll(): BusRoute[] {
    return this.routes;
  }

  search(origin?: string, destination?: string, date?: string): BusRoute[] {
    let results = this.routes;

    if (origin) {
      results = results.filter((r) => r.origin.toLowerCase() === origin.toLowerCase());
    }
    if (destination) {
      results = results.filter((r) => r.destination.toLowerCase() === destination.toLowerCase());
    }
    if (date) {
      results = results.filter((r) => r.date === date);
    }

    return results;
  }

  findOne(id: number): BusRoute {
    const route = this.routes.find((r) => r.id === id);
    if (!route) {
      throw new NotFoundException(`Rota com ID ${id} não encontrada`);
    }
    return route;
  }

  createBooking(dto: CreateBookingDto): Booking {
    const route = this.routes.find((r) => r.id === dto.routeId);
    if (!route) {
      throw new NotFoundException(`Rota com ID ${dto.routeId} não encontrada`);
    }

    if (route.availableSeats <= 0) {
      throw new BadRequestException('Não há assentos disponíveis nesta rota');
    }

    const seatTaken = this.bookings.some(
      (b) => b.routeId === dto.routeId && b.seatNumber === dto.seatNumber,
    );
    if (seatTaken) {
      throw new BadRequestException(`Assento ${dto.seatNumber} já está ocupado nesta rota`);
    }

    route.availableSeats -= 1;
    this.saveRoutes();

    const booking: Booking = {
      id: this.nextBookingId++,
      routeId: dto.routeId,
      passengerName: dto.passengerName,
      passengerDocument: dto.passengerDocument,
      seatNumber: dto.seatNumber,
      bookingDate: route.date,
      createdAt: new Date().toISOString(),
      username: dto.username,
    };

    this.bookings.push(booking);
    this.saveBookings();
    return booking;
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  getBookingsByRoute(routeId: number): Booking[] {
    return this.bookings.filter((b) => b.routeId === routeId);
  }

  getBookingsByUsername(username: string): Booking[] {
    return this.bookings.filter((b) => b.username?.toLowerCase() === username.toLowerCase());
  }
}
