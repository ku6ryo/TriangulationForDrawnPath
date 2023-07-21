import { Vec2 } from "./Vec2"

/**
 * Calculate the angle between two vectors.
 */
function calcDiffAngle(v1: Vec2, v2: Vec2) {
  const sin = v1.normalize().cross(v2.normalize())
  const cos = v1.normalize().dot(v2.normalize())
  if (sin >= 0) {
    return Math.acos(cos)
  } else {
    return 2 * Math.PI - Math.acos(cos)
  }
}

function isSameSide(a: Vec2, b: Vec2, p1: Vec2, p2: Vec2) {
  const v1 = b.sub(a)
  const v2 = p1.sub(a)
  const v3 = p2.sub(a)
  const c1 = v1.cross(v2)
  const c2 = v1.cross(v3)
  return c1 * c2 >= 0
}

function isPointInTriangle(a: Vec2, b: Vec2, c: Vec2, p: Vec2) {
  return isSameSide(a, b, c, p) && isSameSide(b, c, a, p) && isSameSide(c, a, b, p)
}

export function triangulate(
  points: Vec2[],
): [number, number, number][] {
  const pointIndices = points.map((_, i) => i)
  const triangles: [number, number, number][] = []
  while (pointIndices.length > 3) {
    const res = (() => {
      for (let i = 0; i < pointIndices.length; i++) {
        const iP = pointIndices[i - 1] ?? pointIndices[pointIndices.length - 1]
        const iC = pointIndices[i]
        const iN = pointIndices[i + 1] ?? pointIndices[0]
        const pP = points[iP]
        const pC = points[iC]
        const pN = points[iN]
        const vCP = pP.sub(pC)
        const vCN = pN.sub(pC)
        const angle = calcDiffAngle(vCN, vCP)
        if (angle < Math.PI) {
          const inTriangle = pointIndices.some((index) => {
            if (index === iP || index === iC || index === iN) return false
            return isPointInTriangle(pP, pC, pN, points[index])
          })
          if (!inTriangle) return { index: i, triangle: [iP, iC, iN] }
        }
      }
      return null
    })()
    if (res === null) {
      throw new Error("Cannot find a triangle")
    }
    pointIndices.splice(res.index, 1)
    triangles.push(res.triangle as [number, number, number])
  }
  triangles.push([pointIndices[0], pointIndices[1], pointIndices[2]] as [number, number, number])
  return triangles
}