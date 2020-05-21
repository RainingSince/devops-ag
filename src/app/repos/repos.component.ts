import {Component, OnInit} from '@angular/core';
import {ConfigComponent} from './config/config.component';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {UserService} from '../services/user.service';
import {ReposService} from '../services/repos.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.less']
})
export class ReposComponent implements OnInit {

  configModal: NzModalRef;
  userInfo: any = {};
  projects;


  constructor(private modal: NzModalService,
              private userService: UserService,
              private reposService: ReposService) {
  }

  ngOnInit(): void {
    if (this.userService.userInfo) {
      this.userInfo = this.userService.userInfo;
      this.loadProjects();
    } else
      this.userService.getUserInfo().subscribe(res => {
        this.userInfo = res.data;
        this.loadProjects();
      });
  }

  loadProjects() {
    if (this.userInfo && this.userInfo['repos'])
      this.reposService.getReposProjects({repos: this.userInfo.repos}).subscribe(res => {
        this.projects = JSON.parse(res.data);
      });
  }

  setting() {
    this.configModal = this.modal.create({
      nzTitle: '仓库配置',
      nzContent: ConfigComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: (instance) => new Promise(resolve => instance.submitForm(resolve))
    });
  }

}
