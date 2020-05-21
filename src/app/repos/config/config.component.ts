import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReposService} from '../../services/repos.service';

@Component({
  selector: 'repos-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less']
})
export class ConfigComponent implements OnInit {

  validateForm: FormGroup;
  initData: any;

  constructor(private fb: FormBuilder, private reposService: ReposService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      reposPrefix: ['http://'],
      reposUrl: [null, [Validators.required]],
      token: [null, [Validators.required]],
      version: ['4', [Validators.required]],
    });
    this.reposService.getReposConfig().subscribe(res => {
      this.initData = res.data;
      this.initConfig(res.data);
    });
  }

  initConfig(data) {
    if (data) {
      let prefix = data.url.split('://');
      let rp = prefix[0] + '://';
      let url = prefix [1];
      this.validateForm.setValue({
        reposPrefix: rp,
        reposUrl: url,
        token: data.token,
        version: data.version,
        // account: data.account,
        // password: data.password
      });
    }
  }

  submitForm(resolve): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let data = {
      token: this.validateForm.value.token,
      url: this.validateForm.value.reposPrefix + this.validateForm.value.reposUrl,
      version: this.validateForm.value.version,
      // account: this.validateForm.value.account,
      // password: this.validateForm.value.password,
    };

    if (this.initData) {
      data['id'] = this.initData.id;
      this.reposService.updateReposConfig(data).subscribe(res => {
        resolve(res.data);
      });
    } else {
      this.reposService.saveReposConfig(data).subscribe(res => {
        resolve(res.data);
      });
    }

  }


}
