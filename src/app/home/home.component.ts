import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {

  }

  siderCollapsed = true;
  userInfo: any;
  currentPath = '';

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(res => {
      this.userInfo = res.data;
    });
    this.currentPath = window.location.pathname.replace('/', '');
  }

  optionsClick(type) {
    if (type == 'setting') {
      this.siderCollapsed = !this.siderCollapsed;
    } else {
      this.siderCollapsed = true;
      if (this.currentPath != '')
        this.router.navigateByUrl('');
      this.currentPath = '';
    }
  }

  siderCilck(path) {
    this.siderCollapsed = true;
    this.currentPath = path;
    this.router.navigateByUrl(path);
  }

  itemClick(tag) {
    if (tag == 'logout') {
      this.userService.logout();
      this.router.navigateByUrl('login');
    }
  }

}
