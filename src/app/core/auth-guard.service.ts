import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userService: UserService, private router: Router, private msgSrvc: EventsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(user => {
        console.log(route);
        console.log(state);
        this.router.navigate(['/myStations']);
        if (state.url === '/privacy') { this.msgSrvc.publish('showprivacy'); }
        if (state.url === '/tos') { this.msgSrvc.publish('showtos'); }
        return resolve(false);
      }, err => {
        if (state.url === '/privacy') { this.msgSrvc.publish('showprivacy'); }
        if (state.url === '/tos') { this.msgSrvc.publish('showtos'); }
        return resolve(true);
      });
    });
  }
}
