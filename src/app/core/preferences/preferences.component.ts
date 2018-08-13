import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Option } from '../../core/core.module';
import { UserService } from '../user.service';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  settings: FormGroup;
  groupOptions: Option[] = [
    {title: 'No, Do not group',
      value: 'none'},
    {title: 'by City State, Country',
      value: 'city'},
    {title: 'by State, Country',
      value: 'state'},
    {title: 'by Country',
      value: 'country'},
    {title: 'by Language',
      value: 'language'},
    {title: 'by Genre',
      value: 'genre'}
  ];
  constructor(private usrSrvc: UserService, fb: FormBuilder, private dialogRef: MatDialogRef<PreferencesComponent>) {
    this.settings = fb.group({
      playlastplayed: false,
      groupby: 'none'
    });
  }

  ngOnInit() {
    this.settings.controls.playlastplayed.setValue(this.usrSrvc.currentUser.userPreferences.playlastplayed);
    this.settings.controls.groupby.setValue(this.usrSrvc.currentUser.userPreferences.groupby);
  }
  closeDialog(isSave: boolean) {
    if (isSave) {
      this.usrSrvc.saveUserPref(this.settings.value);
    }
    this.dialogRef.close();
  }
}
