import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/part-lookup/part-form-page.component').then(m => m.PartFormPageComponent),
  },
];
