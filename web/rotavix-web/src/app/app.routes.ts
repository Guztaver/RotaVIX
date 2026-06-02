import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'RotaVIX — Busque passagens',
  },
  {
    path: 'routes',
    loadComponent: () => import('./pages/routes/routes.component').then((m) => m.RoutesComponent),
    title: 'RotaVIX — Rotas disponíveis',
  },
  {
    path: 'booking/:id',
    loadComponent: () =>
      import('./pages/booking/booking.component').then((m) => m.BookingComponent),
    title: 'RotaVIX — Reserva',
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/bookings/bookings.component').then((m) => m.BookingsPage),
    title: 'RotaVIX — Minhas reservas',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
