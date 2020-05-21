import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-jgit',
  templateUrl: './jgit.component.html',
  styleUrls: ['./jgit.component.less']
})
export class JgitComponent implements OnInit {

  validateForm: FormGroup;

  @Input() url;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      url: [this.url]
    });
  }

  submitForm(resolve) {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let step = this.validateForm.value;
    step['type'] = 'git';
    resolve(step);
  }

}
