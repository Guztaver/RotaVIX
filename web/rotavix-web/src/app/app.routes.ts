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
    path: 'meus-dados',
    loadComponent: () =>
      import('./pages/info/meus-dados.component').then((m) => m.MeusDadosComponent),
    title: 'RotaVIX — Meus dados',
  },
  {
    path: 'ajuda',
    loadComponent: () => import('./pages/info/ajuda.component').then((m) => m.AjudaComponent),
    title: 'RotaVIX — Ajuda',
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/info/sobre.component').then((m) => m.SobreComponent),
    title: 'RotaVIX — Sobre nós',
  },
  {
    path: 'termos',
    loadComponent: () => import('./pages/info/termos.component').then((m) => m.TermosComponent),
    title: 'RotaVIX — Termos de uso',
  },
  {
    path: 'privacidade',
    loadComponent: () =>
      import('./pages/info/privacidade.component').then((m) => m.PrivacidadeComponent),
    title: 'RotaVIX — Política de privacidade',
  },
  {
    path: 'contato',
    loadComponent: () => import('./pages/info/contato.component').then((m) => m.ContatoComponent),
    title: 'RotaVIX — Contato',
  },
  {
    path: 'empresas/cadastro',
    loadComponent: () =>
      import('./pages/info/empresas-cadastro.component').then((m) => m.EmpresasCadastroComponent),
    title: 'RotaVIX — Cadastre sua viação',
  },
  {
    path: 'empresas/painel',
    loadComponent: () =>
      import('./pages/info/empresas-painel.component').then((m) => m.EmpresasPainelComponent),
    title: 'RotaVIX — Painel do parceiro',
  },
  {
    path: 'empresas/api',
    loadComponent: () =>
      import('./pages/info/empresas-api.component').then((m) => m.EmpresasApiComponent),
    title: 'RotaVIX — API para integração',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
