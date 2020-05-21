import {Injectable} from '@angular/core';
import {remove} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private nodeMap: Map<string, any>;
  private edgeMap: Map<string, any>;
  private lineNode: any[];
  private layoutConfig = {
    xSpace: 200,
    ySpace: 0,
    padding: 100
  };

  constructor(private http: HttpClient) {

  }

  initGraph(data) {
    this.nodeMap = new Map<string, any>();
    this.edgeMap = new Map<string, any>();
    this.lineNode = [];
    this.addNode(data.nodes);
    this.addEdge(data.edges);
    this.addSoltNodes();
    this.layout();
    return this.getLayout();
  }

  addNewNode(edge, node) {
    node['change'] = 1;
    // 添加节点
    this.nodeMap.set(node.name, node);

    // 重新定义边
    let edges = this.resetEdges(edge, node);

    edges.forEach(item => {
      this.formatLine(item);
    });

    // 添加 占位节点
    let sEdges = this.addSoltSingle(node);

    sEdges.forEach(item => {
      this.formatLine(item);
    });

    this.layout();

    return this.getLayout();
  }

  addCollNode(solt, node) {
    // 修改节点 parent isLast 并更新节点
    let parent = this.nodeMap.get(solt.parent);
    parent.isLast = false;

    // 添加节点
    this.nodeMap.set(node.name, node);

    // copy 一份边并添加
    let edges = this.copyEdges(solt, node);

    // 删除 solt 节点
    this.deleteSolt(solt);

    // 更新主线流程
    edges.forEach(item => {
      this.formatLine(item);
    });

    // 添加 solt 节点
    let sEdges = this.addSoltSingle(node);

    sEdges.forEach(item => {
      this.formatLine(item);
    });

    this.layout();

    return this.getLayout();
  }

  uploadNode(node, isHeight) {
    if (!isHeight)
      node.change = node.change + 1;
    this.nodeMap.set(node.name, node);
    this.layout();
    return this.getLayout();
  }

  save(): Observable<any> {
    let node = this.getLayout();
    return this.http.post('/pipe', {
      line: this.lineNode.join('>'),
      ...node
    });
  }

  private deleteSolt(solt) {
    let edgeName = [];

    this.edgeMap.forEach((value, key) => {
      if (key.indexOf(solt.name) > -1) {
        edgeName.push(key);
      }
    });

    edgeName.forEach(item => {
      this.edgeMap.delete(item);
    });

    this.nodeMap.delete(solt.name);

    this.lineNode = this.lineNode.map((item: string) => {
      if (item.indexOf(solt.name) > -1) {
        let p = item.split(',');
        remove(p, (name) => name == solt.name);
        return p.join(',');
      }
      return item;
    });
  }

  private copyEdges(source, target) {
    let newEdges = [];

    this.edgeMap.forEach((value, key) => {

      // 找到需要copy 的 边
      if (key.indexOf(source.name) > -1) {
        // 左边 和 右边
        if (value.source == source.name) {
          let edge = {
            source: target.name,
            target: value.target
          };
          newEdges.push(edge);
        } else if (value.target == source.name) {
          let edge = {
            source: value.source,
            target: target.name
          };
          newEdges.push(edge);
        }
      }

    });

    newEdges.forEach(item => {
      this.edgeMap.set(item.source + '-' + item.target, item);
    });

    return newEdges;
  }

  private resetEdges(edge, node) {
    return this.addNewEdge(edge.v, edge.w, node);
  }

  private addNewEdge(source, target, node) {
    let newEdge = [];

    let sNodes;
    this.lineNode.forEach((item) => {
      if (item.indexOf(source) > -1) {
        sNodes = item;
      }
    });
    sNodes = sNodes.split(',');

    let tNodes;
    this.lineNode.forEach((item) => {
      if (item.indexOf(target) > -1) {
        tNodes = item;
      }
    });
    tNodes = tNodes.split(',');

    sNodes.forEach(item => {
      let cName = item + '-' + node.name;
      let cEdge = {source: item, target: node.name};
      this.edgeMap.set(cName, cEdge);
      newEdge.push(cEdge);
    });

    tNodes.forEach(item => {
      let cName = node.name + '-' + item;
      let cEdge = {source: node.name, target: item};
      this.edgeMap.set(cName, cEdge);
      newEdge.push(cEdge);
    });

    sNodes.forEach(s => {
      tNodes.forEach(t => {
        let name = s + '-' + t;
        if (this.edgeMap.has(name)) {
          this.edgeMap.delete(name);
        }
      });
    });
    return newEdge;
  }

  private getLayout() {
    let nodes = this.formatNodes();
    let edges = this.formatEdges();
    // 获取布局好并存在关系的 节点 和 边
    return {nodes, edges};
  }

  /*
  * 从头开始 顺着主线流程 到尾部结束
  * */
  private addSoltNodes() {
    // 没有数据节点 只有首尾节点
    if (this.nodeMap.size <= 2) return;

    this.nodeMap.forEach((key, item: any) => {
      // 排除首尾节点 只留下并行节点的最后一个节点
      if (item.isLast) {
        this.addSoltSingle(item,);
      }
    });

  }

  private addSoltSingle(item) {
    let newEdges = [];

    // 添加 并行占位节点
    let index = -1;
    this.lineNode.forEach((node, cout) => {
      if (node.indexOf(item.name) > -1) {
        index = cout;
      }
    });

    if (index != -1) {
      let nodeName = item.name + '-solt';
      let node = {
        name: nodeName,
        type: 'solt',
        label: '添加并行任务',
        parent: item.name,
        weight: Number(item.weight) - 1,
        width: 300,
        height: 90
      };
      this.nodeMap.set(nodeName, node);
      // 添加两条边
      let sIndex = index - 1;
      let name = this.lineNode[sIndex].split(',')[0];
      this.edgeMap.set(name + '-' + nodeName, {
        source: name,
        target: nodeName
      });
      newEdges.push({
        source: name,
        target: nodeName
      });
      sIndex = index + 1;
      name = this.lineNode[sIndex].split(',')[0];
      this.edgeMap.set(nodeName + '-' + name, {
        source: nodeName,
        target: name
      });
      newEdges.push({
        source: nodeName,
        target: name
      });

      return newEdges;
    }
  }

  /*
  * 将布局节点和数据节点合并
  * 返回后的数据节点 数组 和 Map 引用同一个合并后的节点
  * */
  private formatNodes() {
    let nodes = [];
    this.nodeMap.forEach(value => {
      nodes.push(value);
    });
    return nodes;
  }

  /*
  * 将边的布局数据整理 添加首尾节点信息
  * 更新节点的引用关系
  * */
  private formatEdges() {
    let edges = [];
    this.edgeMap.forEach(item => {
      edges.push({
        v: item.source,
        w: item.target,
        begin: this.nodeMap.get(item.source),
        end: this.nodeMap.get(item.target)
      });
    });
    return edges;
  }

  /*
  *  整理边 map存储
  *  source 源
  *  target 目标
  * */
  private addEdge(data) {

    // 首次进入 空白布局只存在首尾节点
    if (data.length <= 0) {
      let edge = {
        source: 'header',
        target: 'footer'
      };
      let name = 'header-footer';
      this.edgeMap.set(name, edge);
      this.formatLine(edge);
      return;
    }

    data.forEach(item => {
      let name = `${item.source}-${item.target}`;
      this.formatLine(item);
      this.edgeMap.set(name, item);
    });

  }

  /*
  * 整理主线
  **/
  private formatLine(item) {

    if (this.lineNode.length <= 0) {
      this.lineNode.push(item.source);
      this.lineNode.push(item.target);
      return;
    }

    let sIndex = -1;
    let tIndex = -1;

    this.lineNode.forEach((node, index) => {

      if (node.indexOf(item.source) > -1) {
        sIndex = index;
      }
      if (node.indexOf(item.target) > -1) {
        tIndex = index;
      }
    });


    let key;
    let value;

    // 主线中存在 源
    // 将 目标添加到后个位置
    if (sIndex != -1) {
      key = sIndex + 1;
      // 后一个不存在 直接添加
      if (key == this.lineNode.length) {
        this.lineNode.push(item.target);
      } else {
        // 获取后一个位置的值
        value = this.lineNode[key];

        if (value.indexOf(item.target) > -1) return;

        let parent = this.nodeMap.get(item.target);

        if (parent && parent.parent != '' && value.indexOf(parent.parent) > -1) {
          value += ',' + item.target;
          this.lineNode[key] = value;
        } else {
          this.lineNode.splice(key, 0, item.target);
        }
      }
      return;
    }

    if (tIndex != -1) {
      key = tIndex - 1;
      if (key < 0) {
        this.lineNode.splice(0, 0, item.source);
      } else {
        value = this.lineNode[key];
        if (value.indexOf(item.source) > -1) return;
        let parent = this.nodeMap.get(item.source);
        if (parent && parent.parent != '' && value.indexOf(parent.parent) > -1) {
          value += ',' + item.source;
          this.lineNode[key] = value;
        } else {
          this.lineNode.splice(tIndex, 0, item.source);
        }
      }
    }
  }

  /*
  *  整理节点 map 存储
  *  type 类型  首节点 尾节点 中间节点 平行节点 占位节点
  *  name 节点名称
  *  isLast 并行节点 是否是最后一个
  *  parent 并行节点的上一个节点名称
  *  label 提示
  *  width 宽 固定宽度 300 首尾 100
  *  height 高
  * */
  private addNode(data) {
    // 首次进入，空白布局，默认添加首节点和尾节点
    if (data.length <= 0) {
      let header = {
        type: 'header',
        label: '任务开始',
        name: 'header',
        width: 100,
        height: 80,
        weight: 999
      };
      let footer = {
        type: 'footer',
        label: '任务结束',
        name: 'footer',
        width: 100,
        height: 80,
        weight: 999
      };
      this.nodeMap.set('footer', footer);
      this.nodeMap.set('header', header);
      return;
    }

    data.forEach(item => {
      item['change'] = 1;
      this.nodeMap.set(item.name, item);
    });

  }

  /*
  * 将 node 和 edge 进行布局 遍历 node 和 线
  *
  * */
  private layout() {
    let padding = this.layoutConfig.padding;
    let offsetX = padding;

    this.lineNode.forEach((item: string) => {
      let nodes = item.split(',');
      let offsetY = padding;
      let clientX = 0;
      nodes.forEach(node => {
        if (this.nodeMap.has(node)) {
          let entity = this.nodeMap.get(node);
          this.nodeMap.set(node, Object.assign(entity, {x: offsetX, y: offsetY}));
          if (entity.width >= clientX)
            clientX = entity.width;
          offsetY += entity.height + this.layoutConfig.ySpace;
        }
      });
      offsetX += clientX + this.layoutConfig.xSpace;
    });
  }
}
