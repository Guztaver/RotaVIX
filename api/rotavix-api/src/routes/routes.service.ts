import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateBookingDto } from './dto/create-booking.dto';

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

const mockRoutes: BusRoute[] = [
  {
    id: 1,
    origin: 'Vitória',
    destination: 'São Paulo',
    company: 'Viação RotaVIX',
    departureTime: '08:00',
    arrivalTime: '18:00',
    duration: '10h',
    price: 189.9,
    availableSeats: 42,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 2,
    origin: 'Vitória',
    destination: 'São Paulo',
    company: 'Expresso VIX',
    departureTime: '21:00',
    arrivalTime: '06:00',
    duration: '9h',
    price: 159.9,
    availableSeats: 38,
    busType: 'Executivo',
    date: '2026-06-15',
  },
  {
    id: 3,
    origin: 'Vitória',
    destination: 'Rio de Janeiro',
    company: 'Viação RotaVIX',
    departureTime: '07:30',
    arrivalTime: '15:00',
    duration: '7h30m',
    price: 129.9,
    availableSeats: 36,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 4,
    origin: 'Vitória',
    destination: 'Rio de Janeiro',
    company: 'Expresso VIX',
    departureTime: '14:00',
    arrivalTime: '21:30',
    duration: '7h30m',
    price: 109.9,
    availableSeats: 44,
    busType: 'Convencional',
    date: '2026-06-15',
  },
  {
    id: 5,
    origin: 'Vitória',
    destination: 'Belo Horizonte',
    company: 'Viação RotaVIX',
    departureTime: '09:00',
    arrivalTime: '17:00',
    duration: '8h',
    price: 149.9,
    availableSeats: 40,
    busType: 'Executivo',
    date: '2026-06-15',
  },
  {
    id: 6,
    origin: 'Vitória',
    destination: 'Belo Horizonte',
    company: 'Expresso VIX',
    departureTime: '22:30',
    arrivalTime: '06:30',
    duration: '8h',
    price: 139.9,
    availableSeats: 35,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 7,
    origin: 'Vitória',
    destination: 'Salvador',
    company: 'Viação RotaVIX',
    departureTime: '18:00',
    arrivalTime: '08:00',
    duration: '14h',
    price: 249.9,
    availableSeats: 30,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 8,
    origin: 'Vitória',
    destination: 'Brasília',
    company: 'Expresso VIX',
    departureTime: '16:00',
    arrivalTime: '08:00',
    duration: '16h',
    price: 279.9,
    availableSeats: 28,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 9,
    origin: 'Vitória',
    destination: 'São Paulo',
    company: 'Viação RotaVIX',
    departureTime: '08:00',
    arrivalTime: '18:00',
    duration: '10h',
    price: 199.9,
    availableSeats: 45,
    busType: 'Leito',
    date: '2026-06-16',
  },
  {
    id: 10,
    origin: 'Vitória',
    destination: 'Rio de Janeiro',
    company: 'Viação RotaVIX',
    departureTime: '07:30',
    arrivalTime: '15:00',
    duration: '7h30m',
    price: 134.9,
    availableSeats: 25,
    busType: 'Executivo',
    date: '2026-06-16',
  },
  {
    id: 11,
    origin: 'Vitória',
    destination: 'Belo Horizonte',
    company: 'Expresso VIX',
    departureTime: '23:00',
    arrivalTime: '07:00',
    duration: '8h',
    price: 144.9,
    availableSeats: 50,
    busType: 'Convencional',
    date: '2026-06-16',
  },
  {
    id: 12,
    origin: 'Vitória',
    destination: 'Salvador',
    company: 'Expresso VIX',
    departureTime: '20:00',
    arrivalTime: '10:00',
    duration: '14h',
    price: 229.9,
    availableSeats: 32,
    busType: 'Executivo',
    date: '2026-06-16',
  },
  {
    id: 13,
    origin: 'São Paulo',
    destination: 'Vitória',
    company: 'Viação RotaVIX',
    departureTime: '20:00',
    arrivalTime: '06:00',
    duration: '10h',
    price: 189.9,
    availableSeats: 40,
    busType: 'Leito',
    date: '2026-06-15',
  },
  {
    id: 14,
    origin: 'Rio de Janeiro',
    destination: 'Vitória',
    company: 'Expresso VIX',
    departureTime: '08:00',
    arrivalTime: '15:30',
    duration: '7h30m',
    price: 129.9,
    availableSeats: 33,
    busType: 'Executivo',
    date: '2026-06-15',
  },
  {
    id: 15,
    origin: 'Belo Horizonte',
    destination: 'Vitória',
    company: 'Viação RotaVIX',
    departureTime: '22:00',
    arrivalTime: '06:00',
    duration: '8h',
    price: 149.9,
    availableSeats: 37,
    busType: 'Leito',
    date: '2026-06-15',
  },
];

@Injectable()
export class RoutesService {
  private routes: BusRoute[] = [...mockRoutes];
  private bookings: Booking[] = [];
  private nextBookingId = 1;

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
