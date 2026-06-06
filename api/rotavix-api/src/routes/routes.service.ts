import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  occupiedSeats?: number[];
}

export interface Booking {
  id: number;
  routeId: number;
  passengerName: string;
  passengerDocument: string;
  passengerEmail: string;
  passengerPhone: string;
  seatNumber: number;
  bookingDate: string;
  createdAt: string;
  username?: string;
}

const COMPANIES = [
  'Viação RotaVIX',
  'Expresso SP-RJ',
  'Buser',
  'Catarinense',
  'Expresso VIX',
];
const BUS_TYPES: BusRoute['busType'][] = ['Leito', 'Executivo', 'Convencional'];

@Injectable()
export class RoutesService {
  constructor(private readonly db: DatabaseService) {}

  /** Ensure at least `min` routes exist in the database */
  ensureMinimumRoutes(min = 10): void {
    const count = (
      this.db.db.prepare('SELECT COUNT(*) as cnt FROM routes').get() as {
        cnt: number;
      }
    ).cnt;
    if (count >= min) return;

    const existingDates = (
      this.db.db.prepare('SELECT DISTINCT date FROM routes').all() as {
        date: string;
      }[]
    ).map((r) => r.date);

    const today = new Date().toISOString().split('T')[0];
    const cities = [
      'São Paulo',
      'Rio de Janeiro',
      'Belo Horizonte',
      'Curitiba',
      'Salvador',
      'Brasília',
      'Fortaleza',
      'Florianópolis',
      'Vitória',
    ];

    const needed = min - count;
    const routes = this.generateFakeRoutes(
      cities[needed % cities.length],
      cities[(needed + 1) % cities.length],
      existingDates[0] ?? today,
      needed,
    );
    this.insertRoutes(routes);
  }

  findAll(): BusRoute[] {
    this.ensureMinimumRoutes(10);
    return this.db.db
      .prepare(
        `SELECT id, origin, destination, company,
                departure_time AS departureTime,
                arrival_time   AS arrivalTime,
                duration, price,
                available_seats AS availableSeats,
                bus_type        AS busType,
                date
         FROM routes ORDER BY date, id`,
      )
      .all() as BusRoute[];
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

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const results = this.db.db
      .prepare(
        `SELECT id, origin, destination, company,
                departure_time AS departureTime,
                arrival_time   AS arrivalTime,
                duration, price,
                available_seats AS availableSeats,
                bus_type        AS busType,
                date
         FROM routes ${where} ORDER BY date, id`,
      )
      .all(params) as BusRoute[];

    // Auto-generate fake routes when nothing found for a specific search
    if (results.length === 0 && origin && destination && date) {
      const fakeRoutes = this.generateFakeRoutes(origin, destination, date, 5);
      this.insertRoutes(fakeRoutes);
      // Re-query to get the freshly inserted routes with proper IDs
      return this.db.db
        .prepare(
          `SELECT id, origin, destination, company,
                  departure_time AS departureTime,
                  arrival_time   AS arrivalTime,
                  duration, price,
                  available_seats AS availableSeats,
                  bus_type        AS busType,
                  date
           FROM routes ${where} ORDER BY date, id`,
        )
        .all(params) as BusRoute[];
    }

    return results;
  }

  findOne(id: number): BusRoute {
    const route = this.db.db
      .prepare(
        `SELECT id, origin, destination, company,
                departure_time AS departureTime,
                arrival_time   AS arrivalTime,
                duration, price,
                available_seats AS availableSeats,
                bus_type        AS busType,
                date
         FROM routes WHERE id = ?`,
      )
      .get(id) as BusRoute | undefined;

    if (!route) {
      // Auto-create a fake route when booking a non-existent route
      const today = new Date().toISOString().split('T')[0];
      const fake = this.generateFakeRoutes(
        'São Paulo',
        'Rio de Janeiro',
        today,
        1,
      )[0];
      this.insertRoutes([fake]);
      // Re-query to get the inserted route
      const inserted = this.db.db
        .prepare(
          `SELECT id, origin, destination, company,
                  departure_time AS departureTime,
                  arrival_time   AS arrivalTime,
                  duration, price,
                  available_seats AS availableSeats,
                  bus_type        AS busType,
                  date
           FROM routes WHERE id = last_insert_rowid()`,
        )
        .get() as BusRoute;
      inserted.occupiedSeats = [];
      return inserted;
    }

    const bookings = this.db.db
      .prepare('SELECT seat_number FROM bookings WHERE route_id = ?')
      .all(id) as { seat_number: number }[];

    route.occupiedSeats = bookings.map((b) => b.seat_number);

    return route;
  }

  createBooking(dto: CreateBookingDto): Booking {
    // Ensure the route exists – create it if not
    let route = this.db.db
      .prepare(
        `SELECT id, origin, destination, company,
                departure_time AS departureTime,
                arrival_time   AS arrivalTime,
                duration, price,
                available_seats AS availableSeats,
                bus_type        AS busType,
                date
         FROM routes WHERE id = ?`,
      )
      .get(dto.routeId) as BusRoute | undefined;

    if (!route) {
      const today = new Date().toISOString().split('T')[0];
      const fake = this.generateFakeRoutes(
        'São Paulo',
        'Rio de Janeiro',
        today,
        1,
      )[0];
      this.insertRoutes([fake]);
      route = this.db.db
        .prepare(
          `SELECT id, origin, destination, company,
                  departure_time AS departureTime,
                  arrival_time   AS arrivalTime,
                  duration, price,
                  available_seats AS availableSeats,
                  bus_type        AS busType,
                  date
           FROM routes WHERE id = last_insert_rowid()`,
        )
        .get() as BusRoute;
    }

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
        .prepare(
          'UPDATE routes SET available_seats = available_seats - 1 WHERE id = ?',
        )
        .run(dto.routeId);

      const result = this.db.db
        .prepare(
          `
        INSERT INTO bookings (route_id, passenger_name, passenger_document, passenger_email, passenger_phone, seat_number, booking_date, created_at, username)
        VALUES (@routeId, @passengerName, @passengerDocument, @passengerEmail, @passengerPhone, @seatNumber, @bookingDate, @createdAt, @username)
      `,
        )
        .run({
          routeId: dto.routeId,
          passengerName: dto.passengerName,
          passengerDocument: dto.passengerDocument,
          passengerEmail: dto.passengerEmail,
          passengerPhone: dto.passengerPhone,
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
      passengerEmail: dto.passengerEmail,
      passengerPhone: dto.passengerPhone,
      seatNumber: dto.seatNumber,
      bookingDate: route.date,
      createdAt,
      username: dto.username,
    };
  }

  getBookings(): Booking[] {
    return this.db.db
      .prepare(
        `SELECT id,
                route_id          AS routeId,
                passenger_name    AS passengerName,
                passenger_document AS passengerDocument,
                passenger_email   AS passengerEmail,
                passenger_phone   AS passengerPhone,
                seat_number       AS seatNumber,
                booking_date      AS bookingDate,
                created_at        AS createdAt,
                username
         FROM bookings ORDER BY id DESC`,
      )
      .all() as Booking[];
  }

  getBookingsByRoute(routeId: number): Booking[] {
    return this.db.db
      .prepare(
        `SELECT id,
                route_id          AS routeId,
                passenger_name    AS passengerName,
                passenger_document AS passengerDocument,
                passenger_email   AS passengerEmail,
                passenger_phone   AS passengerPhone,
                seat_number       AS seatNumber,
                booking_date      AS bookingDate,
                created_at        AS createdAt,
                username
         FROM bookings WHERE route_id = ? ORDER BY id`,
      )
      .all(routeId) as Booking[];
  }

  getBookingsByUsername(username: string): Booking[] {
    return this.db.db
      .prepare(
        `SELECT id,
                route_id          AS routeId,
                passenger_name    AS passengerName,
                passenger_document AS passengerDocument,
                passenger_email   AS passengerEmail,
                passenger_phone   AS passengerPhone,
                seat_number       AS seatNumber,
                booking_date      AS bookingDate,
                created_at        AS createdAt,
                username
         FROM bookings WHERE LOWER(username) = LOWER(?) ORDER BY id DESC`,
      )
      .all(username) as Booking[];
  }

  /* ------------------------------------------------------------------ */
  /* Private helpers                                                     */
  /* ------------------------------------------------------------------ */

  /** Generate fake routes for a given origin/destination/date */
  private generateFakeRoutes(
    origin: string,
    destination: string,
    date: string,
    count: number,
  ): BusRoute[] {
    const routes: BusRoute[] = [];
    const durations = [
      { h: 5, m: 0 },
      { h: 6, m: 0 },
      { h: 6, m: 30 },
      { h: 7, m: 0 },
      { h: 8, m: 0 },
      { h: 4, m: 30 },
      { h: 9, m: 0 },
      { h: 10, m: 0 },
    ];

    for (let i = 0; i < count; i++) {
      const dur = durations[i % durations.length];
      const duration = dur.m > 0 ? `${dur.h}h${dur.m}m` : `${dur.h}h`;
      const departH = (6 + i * 3) % 24;
      const departM: 0 | 30 = i % 2 === 0 ? 0 : 30;
      const totalMins = departH * 60 + departM + dur.h * 60 + dur.m;
      const arrH = Math.floor(totalMins / 60) % 24;
      const arrM = totalMins % 60;

      routes.push({
        id: 0, // placeholder – real ID assigned by DB
        origin,
        destination,
        company: COMPANIES[i % COMPANIES.length],
        departureTime: `${String(departH).padStart(2, '0')}:${String(departM).padStart(2, '0')}`,
        arrivalTime: `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
        duration,
        price: Math.round((80 + Math.random() * 120) * 10) / 10,
        availableSeats: 22 + (i % 31),
        busType: BUS_TYPES[i % 3],
        date,
      });
    }

    return routes;
  }

  /** Insert routes into the database (in a transaction) */
  private insertRoutes(routes: BusRoute[]): void {
    const insert = this.db.db.prepare(`
      INSERT INTO routes (origin, destination, company, departure_time, arrival_time, duration, price, available_seats, bus_type, date)
      VALUES (@origin, @destination, @company, @departureTime, @arrivalTime, @duration, @price, @availableSeats, @busType, @date)
    `);

    const tx = this.db.db.transaction((items: BusRoute[]) => {
      for (const r of items) {
        insert.run(r);
      }
    });

    tx(routes);
  }
}
