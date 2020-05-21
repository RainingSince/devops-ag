import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      account: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.userService.login(this.validateForm.value)
      .subscribe(res => {
        this.userService.saveUserStatus(res.data);
        this.router.navigateByUrl('/');
      });
  }
}
