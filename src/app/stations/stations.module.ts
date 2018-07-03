import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StationsPageComponent } from './stations-page/stations-page.component';
import { StationsService } from './stations.service';
import { StationPageComponent } from './station-page/station-page.component';

const routes: Routes = [
  { path: 'station', component: StationPageComponent},
  { path: 'station:id', component: StationPageComponent},
  { path: 'myStations', component: StationsPageComponent}
];
@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  exports: [StationPageComponent, StationsPageComponent],
  declarations: [StationsPageComponent, StationPageComponent],
  providers: [StationsService]
})
export class StationsModule { }