import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';

export interface Reasons {
  title: string;
  value: string;
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formData: FormGroup;
  reasons: Reasons[] = [
    {title: 'Feedback', value: 'feedback'},
    {title: 'Found an Issue', value: 'bug'},
    {title: 'I have a suggestion', value: 'suggestion'},
    {title: 'I want to know more', value: 'request'}
  ];
  constructor(fb: FormBuilder) {
    this.formData = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.formData.controls.reason.setValue('feedback');
  }
  sendMail() {
    const from = '"' + this.formData.controls.name.value + '" <' + this.formData.controls.email.value + '>';
    const to = 'getintouch@myradio.live';
    const sub = this.formData.controls.subject.value;
    const body = this.formData.controls.body.value;
    console.log(from);
    console.log(to);
    console.log(sub);
    console.log(body);
  }
}
