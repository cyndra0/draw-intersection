export class UnionSet {
  private tree: number[] = [];

  findRoot(x: number) {
    let p = x;
    while (this.tree[p] != null) {
      p = this.tree[p];
    }
    return p;
  }

  private join(rootX: number, rootY: number) {
    if (rootX !== rootY) {
      // 顺序无所谓，join() 满足交换律
      this.tree[rootX] = rootY;
    }
  }

  union(x: number, y: number) {
    this.join(this.findRoot(x), this.findRoot(y));
  }
}

export function groupWith(
  el: number,
  records: number[][],
  set: UnionSet,
  origin?: number[][][]
) {
  if (el <= 0) {
    return [];
  }
  const root = set.findRoot(el);
  const result: (Point2D & { alpha: number })[] = [];
  records.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (set.findRoot(col) === root) {
        const alpha = origin?.[rowIdx]?.[colIdx][3];
        result.push({
          x: colIdx,
          y: rowIdx,
          alpha: alpha == null ? 255 : alpha
        });
      }
    });
  });
  return result;
}

export function chunk<T>(arr: T[], num: number) {
  const result: T[][] = [];
  let group: T[] = [];
  arr.forEach((it) => {
    group.push(it);
    if (group.length >= num) {
      result.push(group);
      group = [];
    }
  });
  if (group.length) {
    result.push(group);
  }
  return result;
}

export function isPointInArea(p: Point2D, area: number[][]) {
  return area.some(([x, y]) => x === p.x && y === p.y);
}

type Point2D = { x: number; y: number };
