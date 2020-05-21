import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {edit} from 'ace-builds';

@Component({
  selector: 'app-jeditor',
  templateUrl: './jeditor.component.html',
  styleUrls: ['./jeditor.component.less']
})
export class JeditorComponent implements OnInit, AfterViewInit {

  @ViewChild('editorContainer')
  editorContainer;

  editor;

  @Input()
  content;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!this.editorContainer) return;
    this.editor = edit(this.editorContainer.nativeElement, {
      value: this.content,
      mode: 'ace/mode/sh'
    });
    this.editor.setTheme('ace/theme/tomorrow_night');
  }

  submitForm(resolve) {
    let data = {
      type: 'sh',
      content: this.editor.getValue()
    };
    resolve(data);
  }
}
