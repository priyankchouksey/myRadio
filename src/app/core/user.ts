export class User {
  loggedIn: boolean;
  userIcon: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  provider: Provider;
  providerName: string;
  providerUrl: string;

  constructor(id?: string, loggedIn?: boolean, name?: string, firstName?: string, lastName?: string,
    email?: string, userIcon?: string, provider?: string) {
    this.id = id ? id : null;
    this.loggedIn = loggedIn ? loggedIn : null;
    this.name = name ? name : null;
    this.firstName = firstName ? firstName : null;
    this.lastName = lastName ? lastName : null;
    this.email = email ? email : null;
    this.userIcon = userIcon ? userIcon  : '/assets/images/activeuser.png';
    this.provider = provider ? this.getProviderEnum(provider) : Provider.UNKNOWN;
    this.providerName = this.getProviderName();
    this.providerUrl = this.getProviderWebsite();
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
  getProviderName() {
    let retVal: string;
    switch (this.provider) {
      case Provider.GOOGLE:
        retVal = 'Google';
        break;
      case Provider.FACEBOOK:
        retVal = 'Facebook';
        break;
      case Provider.TWITTER:
        retVal = 'Twitter';
        break;
      case Provider.EMAIL:
        retVal = 'email';
        break;
    }
    return retVal;
  }
  getProviderWebsite() {
    let retVal: string;
    switch (this.provider) {
      case Provider.GOOGLE:
        retVal = 'https://myaccount.google.com/';
        break;
      case Provider.FACEBOOK:
        retVal = 'https://www.facebook.com/';
        break;
      case Provider.TWITTER:
        retVal = 'https://twitter.com/';
        break;
      default:
        retVal = 'unknown';
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
