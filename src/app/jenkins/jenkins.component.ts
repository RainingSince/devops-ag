import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GraphService} from '../services/graph.service';
import panzoom from 'panzoom';

@Component({
  selector: 'app-jenkins',
  templateUrl: './jenkins.component.html',
  styleUrls: ['./jenkins.component.less']
})
export class JenkinsComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer')
  drawer;

  nodes = [];
  drawerVisible = false;
  drawerWidth = 500;
  drawerCurrent;
  currentName = '';
  drawerType = '';
  edges: { points: string }[] = [];
  zoomInstance;
  count = 0;

  constructor(private graphServcie: GraphService) {

  }

  ngOnInit(): void {
    this.initGraph();
  }

  savePipeline() {
    this.graphServcie.save().subscribe(res => {
      console.log(res);
    });
  }

  typeItemClick(item) {
    if (this.drawerCurrent['steps']) {
      this.drawerCurrent.steps.push(item);
    } else
      this.drawerCurrent['steps'] = [item];
    let node = this.graphServcie.uploadNode(this.drawerCurrent, false);
    this.refunshLayout(node);
    this.drawerCurrent = '';
    this.drawerVisible = false;
    this.drawerType = '';
  }

  formSubmit(data) {

    if (data != 'cancel') {
      let node = this.graphServcie.uploadNode(data, false);
      this.refunshLayout(node);
    }
    this.drawerCurrent = '';
    this.drawerVisible = false;
    this.drawerType = '';
  }

  initGraph() {
    const data = {
      nodes: [],
      edges: []
    };
    const node = this.graphServcie.initGraph(data);
    this.refunshLayout(node);
  }

  formatStyle(node) {
    return {
      width: node.width + 'px',
      height: node.height + 'px',
      top: node.y + 'px',
      left: node.x + 'px'
    };
  }

  formatPathL(node) {
    let bx = node.begin.x + 5;
    let ex = node.end.x - 5;
    let by = node.begin.y + 30;
    let ey = node.end.y + 30;
    let bw = node.begin.width;
    let cw = Math.abs((ex - bx - bw) / 2);
    let ch = (ey - by);

    if (ey >= by)
      return 'M'
        + (bx + bw)
        + ' '
        + (by)
        + 'L'
        + (bx + bw + cw - 18)
        + ' '
        + (by);
    else
      return 'M'
        + (bx + bw)
        + ' '
        + (by)
        + 'L'
        + (bx + bw + cw - 12)
        + ' '
        + (by)
        + 'A 10 10 0 0 0 '
        + (bx + bw + cw - 2)
        + ' '
        + (by - 10)
        + 'L'
        + (bx + bw + cw - 2)
        + ' '
        + (by + ch + 15);
  }

  formatPathR(node) {
    let bx = node.begin.x + 5;
    let ex = node.end.x - 5;
    let by = node.begin.y + 30;
    let ey = node.end.y + 30;
    let bw = node.begin.width;
    let cw = Math.abs((ex - bx - bw) / 2);
    let ch = (ey - by);

    if (node.begin.y == node.end.y)
      return `M${(bx + bw + cw + 12)} ${by}L${ex} ${ey}`;
    else {
      return 'M'
        + (bx + bw + cw - 2)
        + ' '
        + (by + 15)
        + 'L'
        + (bx + bw + cw - 2)
        + ' '
        + (by + ch - 10)
        + 'A 10 10 0 0 0 '
        + (bx + bw + cw + 8)
        + ' '
        + (by + ch)
        + 'L'
        + (ex)
        + ' '
        + (by + ch);
    }
  }

  formatPathC(node) {
    let bx = node.begin.x + 5;
    let ex = node.end.x - 5;
    let bw = node.begin.width;
    let cw = Math.abs((ex - bx - bw) / 2);
    return (bx + bw + cw - 3);
  }

  formatPath(node) {

    let bx = node.begin.x + 5;
    let ex = node.end.x - 5;
    let by = node.begin.y + 30;
    let ey = node.end.y + 30;
    let bw = node.begin.width;
    let bh = node.begin.height;
    let ew = node.end.width;
    let wh = node.end.height;
    let cw = Math.abs((ex - bx - bw) / 2);
    let ch = (ey - by);

    if (node.begin.y == node.end.y)
      return `M${bx + bw} ${by}L${ex} ${ey}`;
    else {
      // M 230 185 Q 275 80 320 80
      // return 'M'
      //   + (bx + bw)
      //   + ' '
      //   + (by)
      //   + 'Q'
      //   + (bx + bw + cw)
      //   + ' '
      //   + (by + ch)
      //   + ' '
      //   + (ex)
      //   + ' '
      //   + (by + ch);

      // M230 185L427.5 185L427.5 237.5L427.5 80
      return 'M'
        + (bx + bw)
        + ' '
        + (by)
        + 'L'
        + (bx + bw + cw)
        + ' '
        + (by)
        + 'L'
        + (bx + bw + cw)
        + ' '
        + (by + ch)
        + 'L'
        + (ex)
        + ' '
        + (by + ch);
    }
  }

  zoomClick(type) {
    // 1 big 2 small 3 reset
    if (type == 1) {
      this.zoomInstance.smoothZoom(0.5, 0.5, 1.25);
    } else if (type == 2) {
      this.zoomInstance.smoothZoom(0.5, 0.5, 0.75);
    } else {
      this.zoomInstance.smoothZoomAbs(0.5, 0.5, 1);
    }
  }

  nodeClick(e) {
    this.currentName = e.data.name;
    if (e.type == 'node') {
      this.drawerType = '1';
      this.drawerVisible = true;
      this.drawerCurrent = e.data;
    } else if (e.type == 'step') {
      this.drawerType = '2';
      this.drawerVisible = true;
      this.drawerCurrent = e.data;

    } else if (e.type == 'solt') {
      let node = this.graphServcie.addCollNode(e.data, {
        name: 'empty' + this.count++,
        type: 'node',
        width: 300,
        height: 120,
        isLast: true,
        weight: e.data.weight,
        parent: e.data.parent
      });
      this.refunshLayout(node);
    } else if (e.type == 'update') {
      let node = this.graphServcie.uploadNode(e.data, true);
      this.refunshLayout(node);
    }
  }

  addNode(item) {
    let node = this.graphServcie.addNewNode(item, {
      name: 'empty' + this.count++,
      type: 'node',
      width: 300,
      height: 120,
      weight: 999,
      isLast: true,
      parent: ''
    });
    this.refunshLayout(node);
  }

  refunshLayout(node) {
    this.nodes = node.nodes;
    this.edges = node.edges;
  }

  ngAfterViewInit(): void {
    this.zoomInstance = panzoom(this.drawer.nativeElement, {
      beforeWheel: (e) => {
        return !e.ctrlKey;
      },
      beforeMouseDown: (e) => {
        return !e.ctrlKey;
      },
      zoomDoubleClickSpeed: 1,
      maxZoom: 2,
      minZoom: 0.1,
      zoomSpeed: 0.5
    });
  }
}
