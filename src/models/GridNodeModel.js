export class GridNodeModel {
  constructor(
    col,
    row,
    id,
    isStart,
    isFinish,
    distance,
    isVisited,
    isWall,
    previousNode,
    ref
  ) {
    this.col = col;
    this.row = row;
    this.id = id;
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.distance = distance;
    this.isVisited = isVisited;
    this.isWall = isWall;
    this.previousNode = previousNode;
    this.ref = ref;
  }
}
