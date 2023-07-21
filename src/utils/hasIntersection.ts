import { Vec2 } from "./Vec2";

/**
 * Checks if the given points of a closed path has at least one intersection.
 */
export function hasIntersection(points: Vec2[]): boolean {
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      const p3 = points[j];
      const p4 = points[(j + 1) % n];
      if (doIntersect([p1, p2], [p3, p4])) {
        return true;
      }
    }
  }
  return false;
}

function doIntersect(line0: [Vec2, Vec2], line1: [Vec2, Vec2]) {
  const [p1, p2] = line0;
  const [p3, p4] = line1;
  const demom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (demom === 0) return false;
  const t = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / demom;
  const u = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / demom;
  return t > 0 && t < 1 && u > 0 && u < 1;
}