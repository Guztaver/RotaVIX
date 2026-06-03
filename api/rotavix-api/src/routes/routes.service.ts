import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateBookingDto } from './dto/create-booking.dto';
import { DatabaseService } from '../database/database.service';

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

@Injectable()
export class RoutesService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): BusRoute[] {
    return this.db.db.prepare('SELECT * FROM routes ORDER BY date, id').all() as BusRoute[];
  }

  search(origin?: string, destination?: string, date?: string): BusRoute[] {
    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (origin) {
      conditions.push('LOWER(origin) = LOWER(@origin)');
      params.origin = origin;
    }
    if (destination) {
      conditions.push('LOWER(destination) = LOWER(@destination)');
      params.destination = destination;
    }
    if (date) {
      conditions.push('date = @date');
      params.date = date;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return this.db.db
      .prepare(`SELECT * FROM routes ${where} ORDER BY date, id`)
      .all(params) as BusRoute[];
  }

  findOne(id: number): BusRoute {
    const route = this.db.db
      .prepare('SELECT * FROM routes WHERE id = ?')
      .get(id) as BusRoute | undefined;
    if (!route) {
      throw new NotFoundException(`Rota com ID ${id} não encontrada`);
    }
    return route;
  }

  createBooking(dto: CreateBookingDto): Booking {
    const route = this.findOne(dto.routeId);

    if (route.availableSeats <= 0) {
      throw new BadRequestException('Não há assentos disponíveis nesta rota');
    }

    const existing = this.db.db
      .prepare('SELECT id FROM bookings WHERE route_id = ? AND seat_number = ?')
      .get(dto.routeId, dto.seatNumber) as { id: number } | undefined;

    if (existing) {
      throw new BadRequestException(
        `Assento ${dto.seatNumber} já está ocupado nesta rota`,
      );
    }

    const createdAt = new Date().toISOString();

    const doBooking = this.db.db.transaction(() => {
      this.db.db
        .prepare('UPDATE routes SET available_seats = available_seats - 1 WHERE id = ?')
        .run(dto.routeId);

      const result = this.db.db.prepare(`
        INSERT INTO bookings (route_id, passenger_name, passenger_document, seat_number, booking_date, created_at, username)
        VALUES (@routeId, @passengerName, @passengerDocument, @seatNumber, @bookingDate, @createdAt, @username)
      `).run({
        routeId: dto.routeId,
        passengerName: dto.passengerName,
        passengerDocument: dto.passengerDocument,
        seatNumber: dto.seatNumber,
        bookingDate: route.date,
        createdAt,
        username: dto.username ?? null,
      });

      return result.lastInsertRowid as number;
    });

    const bookingId = doBooking();

    return {
      id: bookingId,
      routeId: dto.routeId,
      passengerName: dto.passengerName,
      passengerDocument: dto.passengerDocument,
      seatNumber: dto.seatNumber,
      bookingDate: route.date,
      createdAt,
      username: dto.username,
    };
  }

  getBookings(): Booking[] {
    return this.db.db.prepare('SELECT * FROM bookings ORDER BY id DESC').all() as Booking[];
  }

  getBookingsByRoute(routeId: number): Booking[] {
    return this.db.db
      .prepare('SELECT * FROM bookings WHERE route_id = ? ORDER BY id')
      .all(routeId) as Booking[];
  }

  getBookingsByUsername(username: string): Booking[] {
    return this.db.db
      .prepare('SELECT * FROM bookings WHERE LOWER(username) = LOWER(?) ORDER BY id DESC')
      .all(username) as Booking[];
  }
}
