import { DatePipe } from '@angular/common';
import { Component, inject, type OnDestroy, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Subscription } from 'rxjs';
import { type RouteResult, RouteService } from '../../services/route.service';

type SortOption = 'price' | 'duration' | 'departure';

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

  /** Filter/sort state */
  readonly sortBy = signal<SortOption>('departure');
  readonly filterBusType = signal<string | null>(null);
  readonly filterMaxPrice = signal<number | null>(null);
  readonly showFilters = signal(false);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams.subscribe((params) => {
      const origin = params['origin'] ?? '';
      const destination = params['destination'] ?? '';
      const date = params['date'] ?? '';

      this.queryOrigin.set(origin);
      this.queryDestination.set(destination);
      this.queryDate.set(date);

      if (origin && destination && date && this.routes().length === 0) {
        this.routeService.searchRoutes({ origin, destination, date }).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Computed: sorted & filtered routes */
  get filteredRoutes(): RouteResult[] {
    let list = [...this.routes()];

    // Filter by bus type
    const busType = this.filterBusType();
    if (busType) {
      list = list.filter((r) => r.busType.toLowerCase().includes(busType.toLowerCase()));
    }

    // Filter by max price
    const maxPrice = this.filterMaxPrice();
    if (maxPrice !== null) {
      list = list.filter((r) => r.price <= maxPrice);
    }

    // Sort
    const sort = this.sortBy();
    list.sort((a, b) => {
      switch (sort) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return this.parseDurationMinutes(a.duration) - this.parseDurationMinutes(b.duration);
        default:
          return a.departureTime.localeCompare(b.departureTime);
      }
    });

    return list;
  }

  /** Unique bus types for filtering */
  get uniqueBusTypes(): string[] {
    const types = new Set(this.routes().map((r) => r.busType));
    return [...types];
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

  setSort(option: SortOption): void {
    this.sortBy.set(option);
  }

  toggleBusType(type: string): void {
    this.filterBusType.set(this.filterBusType() === type ? null : type);
  }

  clearFilters(): void {
    this.filterBusType.set(null);
    this.filterMaxPrice.set(null);
    this.sortBy.set('departure');
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  private parseDurationMinutes(duration: string): number {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return Number.parseInt(parts[0], 10) * 60 + Number.parseInt(parts[1], 10);
    }
    // Try "Xh Ymin" format
    const hMatch = duration.match(/(\d+)h/);
    const mMin = duration.match(/(\d+)min/);
    const h = hMatch ? Number.parseInt(hMatch[1], 10) : 0;
    const m = mMin ? Number.parseInt(mMin[1], 10) : 0;
    return h * 60 + m;
  }
}
