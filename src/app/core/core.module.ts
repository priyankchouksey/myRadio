import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';
import { EventsService } from './events.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material.module';
import { PlayUrlParserService } from './play-url-parser.service';
import { PreferencesComponent } from './preferences/preferences.component';
export { User } from './user';
export * from './interfaces';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ConfirmationDialogComponent, FooterComponent, PreferencesComponent],
  providers: [AuthService, AuthGuardService, UserService, EventsService, PlayUrlParserService],
  exports: [FooterComponent],
  entryComponents: [ConfirmationDialogComponent, PreferencesComponent]
})
export class CoreModule { }
