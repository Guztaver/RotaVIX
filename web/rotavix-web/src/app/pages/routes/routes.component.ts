import { DatePipe } from '@angular/common';
import { Component, inject, type OnDestroy, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Subscription } from 'rxjs';
import { type RouteResult, RouteService } from '../../services/route.service';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
})
export class RoutesComponent implements OnInit, OnDestroy {
  private readonly routeService = inject(RouteService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = this.routeService.loading;
  readonly error = this.routeService.error;
  readonly routes = this.routeService.routes;

  readonly queryOrigin = signal('');
  readonly queryDestination = signal('');
  readonly queryDate = signal('');

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams.subscribe((params) => {
      const origin = params['origin'] ?? '';
      const destination = params['destination'] ?? '';
      const date = params['date'] ?? '';

      this.queryOrigin.set(origin);
      this.queryDestination.set(destination);
      this.queryDate.set(date);

      // Re-run search if we have params but no routes yet
      if (origin && destination && date && this.routes().length === 0) {
        this.routeService.searchRoutes({ origin, destination, date }).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  handleRefresh(): void {
    const o = this.queryOrigin();
    const d = this.queryDestination();
    const dt = this.queryDate();
    if (o && d && dt) {
      this.routeService.searchRoutes({ origin: o, destination: d, date: dt }).subscribe();
    }
  }

  selectRoute(route: RouteResult): void {
    this.routeService.selectedRoute.set(route);
    this.router.navigate(['/booking', route.id]);
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
}
