import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
export { User } from './user';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService]
})
export class CoreModule { }
