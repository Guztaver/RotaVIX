import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { RouteSearchParams } from '../../services/route.service';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly routeService = inject(RouteService);
  private readonly router = inject(Router);

  readonly loading = this.routeService.loading;
  readonly error = this.routeService.error;

  readonly searchForm = inject(FormBuilder).nonNullable.group({
    origin: ['', [Validators.required, Validators.minLength(3)]],
    destination: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
  });

  readonly minDate = new Date().toISOString().split('T')[0];

  /** Popular destinations for quick-pick chips */
  readonly popularDestinations = [
    { city: 'São Paulo', state: 'SP' },
    { city: 'Rio de Janeiro', state: 'RJ' },
    { city: 'Belo Horizonte', state: 'MG' },
    { city: 'Curitiba', state: 'PR' },
    { city: 'Salvador', state: 'BA' },
    { city: 'Brasília', state: 'DF' },
    { city: 'Fortaleza', state: 'CE' },
    { city: 'Florianópolis', state: 'SC' },
  ];

  async onSubmit(): Promise<void> {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const params = this.searchForm.getRawValue() as RouteSearchParams;

    this.routeService.searchRoutes(params).subscribe({
      next: (routes) => {
        if (routes.length > 0) {
          this.router.navigate(['/routes'], {
            queryParams: {
              origin: params.origin,
              destination: params.destination,
              date: params.date,
            },
          });
        }
      },
    });
  }

  swapLocations(): void {
    const origin = this.searchForm.controls.origin.value;
    const destination = this.searchForm.controls.destination.value;
    this.searchForm.patchValue({
      origin: destination,
      destination: origin,
    });
  }

  quickPickOrigin(city: string): void {
    this.searchForm.controls.origin.setValue(city);
    this.searchForm.controls.origin.markAsTouched();
  }

  quickPickDestination(city: string): void {
    this.searchForm.controls.destination.setValue(city);
    this.searchForm.controls.destination.markAsTouched();
  }
}
