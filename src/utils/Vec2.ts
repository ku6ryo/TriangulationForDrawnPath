
export class Vec2 {
  constructor(public x: number, public y: number) { }

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y
  }

  squaredLength(): number {
    return this.x * this.x + this.y * this.y
  }

  length(): number {
    return Math.sqrt(this.squaredLength())
  }

  normalize(): Vec2 {
    const l = this.length()
    return new Vec2(this.x / l, this.y / l)
  }

  equals(v: Vec2): boolean {
    return this.x === v.x && this.y === v.y
  }
}