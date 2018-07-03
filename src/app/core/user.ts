export class User {
  loggedIn: boolean;
  userIcon: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;

  constructor(id?: string, loggedIn?: boolean, name?: string, firstName?: string, lastName?: string, email?: string, userIcon?: string) {
    this.id = id ? id : null;
    this.loggedIn = loggedIn ? loggedIn : null;
    this.name = name ? name : null;
    this.firstName = firstName ? firstName : null;
    this.lastName = lastName ? lastName : null;
    this.email = email ? email : null;
    this.userIcon = userIcon ? userIcon  : '/assets/user-icon.png';
  }
}
