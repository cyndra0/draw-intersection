import { chunk, groupWith, UnionSet } from "./helper";
const scan = (input: number[][][]) => {
  // 用于标记 label 值
  const record = Array(input.length)
    .fill(0)
    .map(() => Array(input[0].length).fill(0));
  // 1 遍历每个像素，边标记边构建并查集
  let label = 0;
  const unionSet = new UnionSet();
  input.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (col[3] !== 0) {
        const left = record[rowIdx][colIdx - 1];
        const top = record[rowIdx - 1]?.[colIdx];
        if (!left && !top) {
          record[rowIdx][colIdx] = ++label;
        } else if (left && top) {
          // label 值不相等时设置连通域
          const cur = Math.min(left, top);
          unionSet.union(cur, left);
          record[rowIdx][colIdx] = cur;
        } else {
          record[rowIdx][colIdx] = left || top;
        }
      }
    });
  });
  return { record, unionSet };
};

export const nearestIntersection = (
  paths: Path2D[],
  { x, y }: { x: number; y: number }
) => {
  const oCanvas = document.createElement("canvas");
  // apply canvas styles from source canvas...
  const ctx = oCanvas.getContext("2d") as CanvasRenderingContext2D;
  paths.forEach((path) => {
    ctx.clip(path);
  });
  // fill composed path
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);
  const imageData = ctx.getImageData(0, 0, oCanvas.width, oCanvas.height);
  // image.data.length === imageData.width * imageData.height * 4
  const colorDataChunks = chunk(
    chunk((imageData.data as unknown) as number[], 4),
    imageData.width
  );
  const { record, unionSet } = scan(colorDataChunks);
  const label = record[y]?.[x];
  if (!label) {
    return [];
  }
  return groupWith(label, record, unionSet, colorDataChunks);
};
