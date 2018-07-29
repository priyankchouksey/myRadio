import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../core/core.module';
import { UserService } from '../core/user.service';
import { Provider } from '../core/user';

@Injectable()
export class StationResolver implements Resolve<User> {

  constructor(public userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Promise<User> {

    const user = new User();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(res => {
        if (res.provider === Provider.EMAIL) {
          // user.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
          // user.name = res.displayName;
          // user.provider = res.providerData[0].providerId;
          return resolve(user);
        } else {
          // user.image = res.photoURL;
          // user.name = res.displayName;
          // user.provider = res.providerData[0].providerId;
          return resolve(user);
        }
      })
      .catch( err => {
        this.router.navigate(['/home']);
        return reject(err);
      });
    });
  }
}
