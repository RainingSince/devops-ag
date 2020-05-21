import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-jform',
  templateUrl: './jform.component.html',
  styleUrls: ['./jform.component.less']
})
export class JformComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  @Input() node;

  @Output() submit = new EventEmitter<any>();


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [this.node.title]
    });
  }

  formSubmit() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.node.title = this.validateForm.value.title;
    this.submit.emit(this.node);
  }

  formCancel() {
    this.submit.emit('cancel');
  }

}
