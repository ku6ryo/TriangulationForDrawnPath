import { Vec2 } from "./Vec2";

export function isClockwisePath(points: Vec2[]) {
  if (points.length < 3) throw new Error("Not enough points to determine path direction")
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    sum += (p2.x - p1.x) * (p2.y + p1.y);
  }
  return sum > 0;
}