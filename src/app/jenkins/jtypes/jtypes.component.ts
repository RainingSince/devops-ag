import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';
import {JgitComponent} from '../jgit/jgit.component';
import {JeditorComponent} from '../jeditor/jeditor.component';

@Component({
  selector: 'app-jtypes',
  templateUrl: './jtypes.component.html',
  styleUrls: ['./jtypes.component.less']
})
export class JtypesComponent implements OnInit {
  gitModal: NzModalRef;
  shModal: NzModalRef;
  radioValue = '';

  @Output() itemClick = new EventEmitter<any>();

  constructor(private modal: NzModalService) {
  }

  ngOnInit(): void {
  }

  typeSelect(type) {
    this.radioValue = type;
  }

  typeItemClick(item) {
    if (item == 'git')
      this.gitForm();
    else if (item == 'sh')
      this.shEditor();
  }

  gitForm() {
    this.gitModal = this.modal.create({
      nzTitle: '添加步骤 - git',
      nzContent: JgitComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        url: ''
      },
      nzClosable: false,
      nzOnOk: (instance) => new Promise(resolve => instance.submitForm(resolve)).then(res => {
        this.itemClick.emit(res);
      })
    });
  }

  shEditor() {
    this.shModal = this.modal.create({
      nzTitle: '添加步骤 - sh',
      nzContent: JeditorComponent,
      nzWidth: 650,
      nzComponentParams: {
        content: ''
      },
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: (instance) => new Promise(resolve => instance.submitForm(resolve)).then(res => {
        this.itemClick.emit(res);
      })
    });
  }

}
