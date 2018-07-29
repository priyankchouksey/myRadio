import {AbstractControl} from '@angular/forms';
export class PasswordValidator {

    static MatchPassword(AC: AbstractControl) {
       const password = AC.get('password').value; // to get value in input tag
       const confirmPassword = AC.get('repassword').value; // to get value in input tag
        if ( password !== confirmPassword) {
            // console.log('false');
            AC.get('repassword').setErrors( {MatchPassword: true} );
        } else {
            // console.log('true');
            return null;
        }
    }
}
