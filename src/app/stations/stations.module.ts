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
import { ShareStationComponent } from './share-station/share-station.component';
import { ShareStationService } from './share-station.service';
import { ImportShareComponent } from './import-share/import-share.component';
import { ManageSharesComponent } from './manage-shares/manage-shares.component';

const routes: Routes = [
  { path: 'myStations', component: StationsPageComponent, resolve: {data: StationResolver}},
  { path: 'shared/:id', component: ImportShareComponent }
];
@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  exports: [StationComponent, StationsPageComponent],
  declarations: [StationsPageComponent,
    StationComponent,
    FavStationsPipe,
    ShareStationComponent,
    ImportShareComponent,
    ManageSharesComponent],
  providers: [StationsService, StationResolver, ShareStationService],
  entryComponents: [StationComponent, ShareStationComponent, ManageSharesComponent]
})
export class StationsModule { }
