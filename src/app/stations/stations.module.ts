import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StationsPageComponent } from './stations-page/stations-page.component';
import { StationsService } from './stations.service';
import { StationComponent } from './station/station.component';
import { FavStationsPipe } from './fav-stations.pipe';
import { AuthService } from '../core/auth.service';
import { AuthGuardService } from '../core/auth-guard.service';
import { StationResolver } from './station.resolver';

const routes: Routes = [
  { path: 'station', component: StationComponent, resolve: {data: StationResolver}},
  { path: 'station:id', component: StationComponent, resolve: {data: StationResolver}},
  { path: 'myStations', component: StationsPageComponent, resolve: {data: StationResolver}}
];
@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  exports: [StationComponent, StationsPageComponent],
  declarations: [StationsPageComponent, StationComponent, FavStationsPipe],
  providers: [StationsService, StationResolver],
  entryComponents: [StationComponent]
})
export class StationsModule { }
