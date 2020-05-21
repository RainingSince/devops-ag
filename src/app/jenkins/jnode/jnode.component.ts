import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-jnode',
  templateUrl: './jnode.component.html',
  styleUrls: ['./jnode.component.less']
})
export class JnodeComponent implements OnInit, OnChanges {

  constructor() {
  }

  @ViewChild('nodeContainer')
  nodeContainer;

  @Input() updateFlag;
  @Input() node;
  @Input() active;
  @Output() nodeClick = new EventEmitter<any>();

  ngOnInit(): void {

  }

  nameClick() {
    this.nodeClick.emit({
      type: 'node',
      data: this.node
    });
  }

  stepClick() {
    this.nodeClick.emit({
      type: 'step',
      data: this.node
    });
  }

  soltClick() {
    this.nodeClick.emit({
      type: 'solt',
      data: this.node
    });
  }


  ngOnChanges(): void {
    if (!this.nodeContainer) return;
    setTimeout(() => {
      let height = this.nodeContainer.nativeElement.offsetHeight + 30;
      if (height > this.node.height + 10) {
        this.node.height = height;
        this.nodeClick.emit({
          type: 'update',
          data: this.node
        });
      }
    }, 10);
  }

}
