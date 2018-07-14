export class User {
  loggedIn: boolean;
  userIcon: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  provider: Provider;

  constructor(id?: string, loggedIn?: boolean, name?: string, firstName?: string, lastName?: string,
    email?: string, userIcon?: string, provider?: string) {
    this.id = id ? id : null;
    this.loggedIn = loggedIn ? loggedIn : null;
    this.name = name ? name : null;
    this.firstName = firstName ? firstName : null;
    this.lastName = lastName ? lastName : null;
    this.email = email ? email : null;
    this.userIcon = userIcon ? userIcon  : '/assets/user-icon.png';
    this.provider = provider ? this.getProviderEnum(provider) : Provider.UNKNOWN;
  }
  getProviderEnum(provider: string) {
    let retVal: Provider;
    switch (provider) {
      case 'google.com':
        retVal = Provider.GOOGLE;
        break;
      case 'facebook.com':
        retVal = Provider.FACEBOOK;
        break;
      case 'twitter.com':
        retVal = Provider.TWITTER;
        break;
      case 'github.com':
        retVal = Provider.GITHUB;
        break;
      case 'password':
        retVal = Provider.EMAIL;
        break;
      default:
        break;
    }
    return retVal;
  }
}

export enum Provider {
  GOOGLE,
  FACEBOOK,
  TWITTER,
  GITHUB,
  EMAIL,
  UNKNOWN
}
