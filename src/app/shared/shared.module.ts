import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { PicUploaderComponent } from './pic-uploader/pic-uploader.component';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
// import { Station } from './station';

export { Station } from './station';

const routes: Routes = [
  { path: 'home', component: HomeComponent}
];
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
    CoreModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    NavbarComponent,
    PicUploaderComponent,
    PlayerComponent,
    HomeComponent,
    SectionHeaderComponent,
    RouterModule,
    FormsModule,
    CoreModule
  ],
  declarations: [NavbarComponent, PicUploaderComponent, HomeComponent, PlayerComponent, SectionHeaderComponent]
})
export class SharedModule { }
