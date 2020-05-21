import {Component, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  isLogin: string;

  constructor(private userService: UserService, private router: Router) {
    this.isLogin = userService.getLoginStatus();
    if (!this.isLogin) this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {

  }


}
