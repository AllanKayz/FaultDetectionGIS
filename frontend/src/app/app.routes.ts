import { Routes } from '@angular/router';
import { GisMapComponent } from './components/gis-map.component';
import { AuthViewComponent } from './pages/auth-view.component';
import { ForemanDashboardComponent } from './pages/foreman-dashboard.component';
import { ArtisanViewComponent } from './pages/artisan-view.component';
import { ReportsViewComponent } from './pages/reports-view.component';
import { SimulatorViewComponent } from './pages/simulator-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: GisMapComponent },
  { path: 'login', component: AuthViewComponent },
  { path: 'foreman', component: ForemanDashboardComponent },
  { path: 'artisan', component: ArtisanViewComponent },
  { path: 'reports', component: ReportsViewComponent },
  { path: 'simulator', component: SimulatorViewComponent },
  { path: '**', redirectTo: 'map' }
];
