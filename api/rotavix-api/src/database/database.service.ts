import { Injectable, type OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BusRoute, Booking } from '../routes/routes.service';

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'data');
const DB_PATH = join(DATA_DIR, 'rotavix.db');

const SEED_ROUTES: BusRoute[] = [
  { id: 1, origin: 'São Paulo', destination: 'Rio de Janeiro', company: 'Expresso SP-RJ', departureTime: '06:00', arrivalTime: '12:00', duration: '6h', price: 99.9, availableSeats: 44, busType: 'Executivo', date: '2026-06-15' },
  { id: 2, origin: 'São Paulo', destination: 'Rio de Janeiro', company: 'Viação RotaVIX', departureTime: '14:00', arrivalTime: '20:00', duration: '6h', price: 119.9, availableSeats: 38, busType: 'Leito', date: '2026-06-15' },
  { id: 3, origin: 'São Paulo', destination: 'Belo Horizonte', company: 'Viação RotaVIX', departureTime: '08:00', arrivalTime: '16:00', duration: '8h', price: 139.9, availableSeats: 40, busType: 'Executivo', date: '2026-06-15' },
  { id: 4, origin: 'São Paulo', destination: 'Curitiba', company: 'Buser', departureTime: '22:00', arrivalTime: '04:30', duration: '6h30m', price: 89.9, availableSeats: 48, busType: 'Convencional', date: '2026-06-15' },
  { id: 5, origin: 'São Paulo', destination: 'Florianópolis', company: 'Catarinense', departureTime: '20:00', arrivalTime: '06:00', duration: '10h', price: 159.9, availableSeats: 36, busType: 'Leito', date: '2026-06-15' },
  { id: 6, origin: 'São Paulo', destination: 'Brasília', company: 'Viação RotaVIX', departureTime: '18:00', arrivalTime: '06:00', duration: '12h', price: 199.9, availableSeats: 32, busType: 'Leito', date: '2026-06-15' },
  { id: 7, origin: 'São Paulo', destination: 'Salvador', company: 'Expresso SP-RJ', departureTime: '19:00', arrivalTime: '11:00', duration: '16h', price: 289.9, availableSeats: 26, busType: 'Leito', date: '2026-06-15' },
  { id: 8, origin: 'Rio de Janeiro', destination: 'São Paulo', company: 'Expresso SP-RJ', departureTime: '07:00', arrivalTime: '13:00', duration: '6h', price: 99.9, availableSeats: 42, busType: 'Executivo', date: '2026-06-15' },
  { id: 9, origin: 'Rio de Janeiro', destination: 'São Paulo', company: 'Viação RotaVIX', departureTime: '16:00', arrivalTime: '22:00', duration: '6h', price: 119.9, availableSeats: 35, busType: 'Leito', date: '2026-06-15' },
  { id: 10, origin: 'Rio de Janeiro', destination: 'Belo Horizonte', company: 'Viação RotaVIX', departureTime: '09:00', arrivalTime: '16:00', duration: '7h', price: 119.9, availableSeats: 44, busType: 'Executivo', date: '2026-06-15' },
  { id: 11, origin: 'Rio de Janeiro', destination: 'Brasília', company: 'Buser', departureTime: '08:00', arrivalTime: '20:00', duration: '12h', price: 179.9, availableSeats: 40, busType: 'Convencional', date: '2026-06-15' },
  { id: 12, origin: 'Rio de Janeiro', destination: 'Vitória', company: 'Expresso VIX', departureTime: '08:00', arrivalTime: '15:30', duration: '7h30m', price: 129.9, availableSeats: 33, busType: 'Executivo', date: '2026-06-15' },
  { id: 13, origin: 'Belo Horizonte', destination: 'São Paulo', company: 'Expresso SP-RJ', departureTime: '10:00', arrivalTime: '18:00', duration: '8h', price: 139.9, availableSeats: 42, busType: 'Executivo', date: '2026-06-15' },
  { id: 14, origin: 'Belo Horizonte', destination: 'Rio de Janeiro', company: 'Expresso SP-RJ', departureTime: '07:00', arrivalTime: '14:00', duration: '7h', price: 109.9, availableSeats: 38, busType: 'Convencional', date: '2026-06-15' },
  { id: 15, origin: 'Belo Horizonte', destination: 'Brasília', company: 'Viação RotaVIX', departureTime: '06:00', arrivalTime: '15:00', duration: '9h', price: 169.9, availableSeats: 36, busType: 'Executivo', date: '2026-06-15' },
  { id: 16, origin: 'Belo Horizonte', destination: 'Vitória', company: 'Viação RotaVIX', departureTime: '22:00', arrivalTime: '06:00', duration: '8h', price: 149.9, availableSeats: 37, busType: 'Leito', date: '2026-06-15' },
  { id: 17, origin: 'Curitiba', destination: 'São Paulo', company: 'Viação RotaVIX', departureTime: '08:00', arrivalTime: '14:30', duration: '6h30m', price: 129.9, availableSeats: 40, busType: 'Executivo', date: '2026-06-15' },
  { id: 18, origin: 'Curitiba', destination: 'Florianópolis', company: 'Catarinense', departureTime: '06:00', arrivalTime: '10:00', duration: '4h', price: 79.9, availableSeats: 44, busType: 'Executivo', date: '2026-06-15' },
  { id: 19, origin: 'Florianópolis', destination: 'Curitiba', company: 'Catarinense', departureTime: '10:00', arrivalTime: '14:00', duration: '4h', price: 79.9, availableSeats: 42, busType: 'Executivo', date: '2026-06-15' },
  { id: 20, origin: 'Florianópolis', destination: 'São Paulo', company: 'Catarinense', departureTime: '21:00', arrivalTime: '07:00', duration: '10h', price: 159.9, availableSeats: 38, busType: 'Leito', date: '2026-06-15' },
  { id: 21, origin: 'Salvador', destination: 'Rio de Janeiro', company: 'Viação RotaVIX', departureTime: '16:00', arrivalTime: '07:00', duration: '15h', price: 269.9, availableSeats: 28, busType: 'Leito', date: '2026-06-15' },
  { id: 22, origin: 'Salvador', destination: 'Brasília', company: 'Expresso SP-RJ', departureTime: '19:00', arrivalTime: '08:00', duration: '13h', price: 219.9, availableSeats: 30, busType: 'Executivo', date: '2026-06-15' },
  { id: 23, origin: 'Brasília', destination: 'São Paulo', company: 'Viação RotaVIX', departureTime: '08:00', arrivalTime: '20:00', duration: '12h', price: 199.9, availableSeats: 34, busType: 'Executivo', date: '2026-06-15' },
  { id: 24, origin: 'Brasília', destination: 'Rio de Janeiro', company: 'Buser', departureTime: '20:00', arrivalTime: '08:00', duration: '12h', price: 179.9, availableSeats: 38, busType: 'Convencional', date: '2026-06-15' },
  { id: 25, origin: 'Brasília', destination: 'Salvador', company: 'Viação RotaVIX', departureTime: '18:00', arrivalTime: '07:00', duration: '13h', price: 219.9, availableSeats: 26, busType: 'Executivo', date: '2026-06-15' },
  { id: 26, origin: 'Fortaleza', destination: 'Salvador', company: 'Viação RotaVIX', departureTime: '07:00', arrivalTime: '22:00', duration: '15h', price: 249.9, availableSeats: 26, busType: 'Executivo', date: '2026-06-15' },
  { id: 27, origin: 'Fortaleza', destination: 'Brasília', company: 'Expresso SP-RJ', departureTime: '20:00', arrivalTime: '11:00', duration: '15h', price: 289.9, availableSeats: 24, busType: 'Leito', date: '2026-06-15' },
  { id: 28, origin: 'Vitória', destination: 'São Paulo', company: 'Viação RotaVIX', departureTime: '20:00', arrivalTime: '06:00', duration: '10h', price: 189.9, availableSeats: 40, busType: 'Leito', date: '2026-06-15' },
  { id: 29, origin: 'Vitória', destination: 'Rio de Janeiro', company: 'Expresso VIX', departureTime: '07:30', arrivalTime: '15:00', duration: '7h30m', price: 129.9, availableSeats: 36, busType: 'Leito', date: '2026-06-15' },
  { id: 30, origin: 'Vitória', destination: 'Belo Horizonte', company: 'Viação RotaVIX', departureTime: '09:00', arrivalTime: '17:00', duration: '8h', price: 149.9, availableSeats: 40, busType: 'Executivo', date: '2026-06-15' },
];

const SEED_RANGE: [string, string] = ['2026-01-01', '2026-12-31'];
const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Brasília', 'Fortaleza', 'Florianópolis', 'Vitória'];
const COMPANIES = ['Viação RotaVIX', 'Expresso SP-RJ', 'Buser', 'Catarinense', 'Expresso VIX'];
const BUS_TYPES: BusRoute['busType'][] = ['Leito', 'Executivo', 'Convencional'];

function generateRoutes(): BusRoute[] {
  const pairs: [string, string, number][] = [
    ['São Paulo', 'Rio de Janeiro', 6], ['Rio de Janeiro', 'São Paulo', 6],
    ['São Paulo', 'Belo Horizonte', 8], ['Belo Horizonte', 'São Paulo', 8],
    ['São Paulo', 'Curitiba', 6.5], ['Curitiba', 'São Paulo', 6.5],
    ['São Paulo', 'Florianópolis', 10], ['Florianópolis', 'São Paulo', 10],
    ['São Paulo', 'Brasília', 12], ['Brasília', 'São Paulo', 12],
    ['São Paulo', 'Salvador', 16], ['Salvador', 'São Paulo', 16],
    ['Rio de Janeiro', 'Belo Horizonte', 7], ['Belo Horizonte', 'Rio de Janeiro', 7],
    ['Rio de Janeiro', 'Brasília', 12], ['Brasília', 'Rio de Janeiro', 12],
    ['Rio de Janeiro', 'Salvador', 14], ['Salvador', 'Rio de Janeiro', 14],
    ['Rio de Janeiro', 'Vitória', 7.5], ['Vitória', 'Rio de Janeiro', 7.5],
    ['Belo Horizonte', 'Brasília', 9], ['Brasília', 'Belo Horizonte', 9],
    ['Belo Horizonte', 'Salvador', 12], ['Salvador', 'Belo Horizonte', 12],
    ['Belo Horizonte', 'Vitória', 8], ['Vitória', 'Belo Horizonte', 8],
    ['Curitiba', 'Florianópolis', 4], ['Florianópolis', 'Curitiba', 4],
    ['Curitiba', 'Belo Horizonte', 10], ['Belo Horizonte', 'Curitiba', 10],
    ['Salvador', 'Brasília', 13], ['Brasília', 'Salvador', 13],
    ['Salvador', 'Fortaleza', 15], ['Fortaleza', 'Salvador', 15],
    ['Brasília', 'Fortaleza', 15], ['Fortaleza', 'Brasília', 15],
    ['Vitória', 'São Paulo', 10], ['São Paulo', 'Vitória', 10],
    ['Vitória', 'Salvador', 14], ['Salvador', 'Vitória', 14],
    ['Vitória', 'Brasília', 16], ['Brasília', 'Vitória', 16],
    ['Florianópolis', 'Rio de Janeiro', 12], ['Rio de Janeiro', 'Florianópolis', 12],
  ];

  const routes: BusRoute[] = [];
  let id = 1;

  for (const [origin, destination, hours] of pairs) {
    const stagger = id % 3;
    for (let doy = stagger; doy <= 365; doy += 3) {
      const d = new Date(2026, 0, doy);
      if (d.getFullYear() !== 2026) { continue; }
      const date = `2026-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const basePrice = Math.round(hours * 15 + (id % 11) * 5);
      const departHour = (6 + id * 7) % 24;
      const departMin: 0 | 30 = id % 2 === 0 ? 0 : 30;
      const totalMins = departHour * 60 + departMin + Math.round(hours * 60);
      const arrHour = Math.floor(totalMins / 60) % 24;
      const arrMin = totalMins % 60;

      const durH = Math.floor(hours);
      const durM = Math.round((hours % 1) * 60);
      const duration = durM > 0 ? `${durH}h${durM}m` : `${durH}h`;

      routes.push({
        id: id++,
        origin,
        destination,
        company: COMPANIES[id % COMPANIES.length],
        departureTime: `${String(departHour).padStart(2, '0')}:${String(departMin).padStart(2, '0')}`,
        arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
        duration,
        price: basePrice + 0.9,
        availableSeats: 22 + (id % 31),
        busType: BUS_TYPES[id % 3],
        date,
      });
    }
  }

  const seen = new Set<string>();
  return routes
    .filter((r) => {
      const k = `${r.date}|${r.origin}|${r.destination}|${r.departureTime}`;
      if (seen.has(k)) { return false; }
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.origin.localeCompare(b.origin))
    .map((r, i) => ({ ...r, id: i + 1 }));
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  db!: Database.Database;

  onModuleInit(): void {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.migrate();
    this.seedIfEmpty();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        company TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration TEXT NOT NULL,
        price REAL NOT NULL,
        available_seats INTEGER NOT NULL,
        bus_type TEXT NOT NULL CHECK(bus_type IN ('Leito','Executivo','Convencional')),
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL REFERENCES routes(id),
        passenger_name TEXT NOT NULL,
        passenger_document TEXT NOT NULL,
        seat_number INTEGER NOT NULL,
        booking_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        username TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_routes_search ON routes(origin, destination, date);
      CREATE INDEX IF NOT EXISTS idx_bookings_route ON bookings(route_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_username ON bookings(username);
    `);
  }

  private seedIfEmpty(): void {
    const count = this.db.prepare('SELECT COUNT(*) as cnt FROM routes').get() as { cnt: number };
    if (count.cnt > 0) { return; }

    const routes = generateRoutes();
    const insert = this.db.prepare(`
      INSERT INTO routes (id, origin, destination, company, departure_time, arrival_time, duration, price, available_seats, bus_type, date)
      VALUES (@id, @origin, @destination, @company, @departureTime, @arrivalTime, @duration, @price, @availableSeats, @busType, @date)
    `);

    const seedAll = this.db.transaction((items: BusRoute[]) => {
      for (const r of items) {
        insert.run(r);
      }
    });

    seedAll(routes);
  }
}
