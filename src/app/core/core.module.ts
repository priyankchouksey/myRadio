import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';
import { EventsService } from './events.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../material.module';
import { PlayUrlParserService } from './play-url-parser.service';
export { User } from './user';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [ConfirmationDialogComponent, FooterComponent],
  providers: [AuthService, AuthGuardService, UserService, EventsService, PlayUrlParserService],
  exports: [FooterComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class CoreModule { }
