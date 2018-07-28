import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { PicUploaderComponent } from './pic-uploader/pic-uploader.component';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { AuthGuardService } from '../core/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { DrawerMenuComponent } from './drawer-menu/drawer-menu.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TosComponent } from './tos/tos.component';
import { PicSelectorComponent } from './pic-uploader/pic-selector.component';
import { SaperatorLabelComponent } from './saperator-label/saperator-label.component';
import { FileDropDirective } from './pic-uploader/file-drop.directive';
// import { Station } from './station';

export { Station } from './station';
export { Share } from './station-share';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'privacy', component: HomeComponent, canActivate: [AuthGuardService] }
];
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
    CoreModule,
    ReactiveFormsModule
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
    CoreModule,
    ReactiveFormsModule
  ],
  declarations: [NavbarComponent, PicUploaderComponent, HomeComponent,
    PlayerComponent, SectionHeaderComponent, LoginComponent, DrawerMenuComponent,
    PrivacyComponent, TosComponent, PicSelectorComponent, SaperatorLabelComponent, FileDropDirective],
    entryComponents: [LoginComponent, PrivacyComponent, TosComponent, PicSelectorComponent]
})
export class SharedModule { }
