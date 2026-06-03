import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import type { RouteSearchParams } from '../../services/route.service';
import { RouteService } from '../../services/route.service';

/** Validator: date must be today or in the future */
function notInPast(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today ? { past: true } : null;
}

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
    date: ['', [Validators.required, notInPast]],
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

  private nextPickField: 'origin' | 'destination' = 'origin';

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
        } else {
          this.routeService.error.set({
            summary: 'Nenhuma rota encontrada.',
            details: ['Tente outras cidades ou uma data diferente.'],
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

  quickPickCity(city: string): void {
    if (this.nextPickField === 'origin') {
      this.searchForm.controls.origin.setValue(city);
      this.searchForm.controls.origin.markAsTouched();
      this.nextPickField = 'destination';
    } else {
      this.searchForm.controls.destination.setValue(city);
      this.searchForm.controls.destination.markAsTouched();
      this.nextPickField = 'origin';
    }
  }

  quickPickOrigin(city: string): void {
    this.searchForm.controls.origin.setValue(city);
    this.searchForm.controls.origin.markAsTouched();
    this.nextPickField = 'destination';
  }

  quickPickDestination(city: string): void {
    this.searchForm.controls.destination.setValue(city);
    this.searchForm.controls.destination.markAsTouched();
    this.nextPickField = 'origin';
  }
}
