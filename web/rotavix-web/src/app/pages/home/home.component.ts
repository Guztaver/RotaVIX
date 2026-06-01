import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import type { RouteSearchParams } from '../../services/route.service';

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

  /** Minimum date for the date picker (today) */
  readonly minDate = new Date().toISOString().split('T')[0];

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
}
