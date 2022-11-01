import { nearestIntersection } from "./algs";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function linePath(points) {
  const path = new Path2D();
  const [first, ...rest] = points;
  path.moveTo(first.x, first.y);
  rest.forEach((p) => {
    path.lineTo(p.x, p.y);
  });
  path.closePath();
  return path;
}

function fillPath(path: Path2D, color = "red") {
  ctx.save();
  ctx.clip(path);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
const paths = [
  { path: path2(), color: "orange" },
  { path: path1(), color: "green" }
];
function drawLowerLayer() {
  paths.forEach(({ path, color }) => {
    fillPath(path, color);
  });
}

drawLowerLayer();

function path1() {
  return linePath([
    { x: 15, y: 115 },
    { x: 74, y: 0 },
    { x: 123, y: 154 },
    { x: 6, y: 66 },
    { x: 149, y: 72 }
  ]);
}

function path2() {
  const path = new Path2D();
  path.arc(200, 120, 100, 0, 2 * Math.PI);
  return path;
}

canvas.addEventListener("click", (e) => {
  const points = nearestIntersection(
    paths.map((it) => it.path),
    getMousePos(canvas, e)
  );
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLowerLayer();
  drawPixels(points);
});

function drawPixels(points) {
  if (!Array.isArray(points)) return;
  points.forEach((p) => {
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${p.alpha / 255})`;
    ctx.fillRect(p.x, p.y, 1, 1);
    ctx.restore();
  });
}

// 通过 PointerEvent 获取触发位置相对于 canvas 元素的坐标
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
