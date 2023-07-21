import { Vec2 } from "./utils/Vec2"
import { hasIntersection } from "./utils/hasIntersection";
import { isClockwisePath } from "./utils/isClockwizePath";
import { triangulate } from "./utils/triangulate";

export type OnCompleteCallback = (error?: Error) => void

export class CanvasController {
  private ctx: CanvasRenderingContext2D;
  private points: Vec2[] = [];
  private prevDrawTime = 0;
  private onComplete: OnCompleteCallback | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    canvas.width = 600;
    canvas.height = 600;
    this.ctx = canvas.getContext("2d")!
  }

  setCallbacks(onComplete: OnCompleteCallback) {
    this.onComplete = onComplete
  }

  setup() {
    this.canvas.addEventListener("mousemove", (e) => {
      const point = new Vec2(e.offsetX + Math.random() - 1, e.offsetY + Math.random() - 1);
      if (e.buttons === 1 && performance.now() - this.prevDrawTime > 10) {
        if (this.points.length > 0) {
          const lastPoint = this.points[this.points.length - 1]
          if (lastPoint.equals(point)) return
        }
        if (this.points.length > 1) {
          const lastLastPoint = this.points[this.points.length - 2]
          if (lastLastPoint.equals(point)) return
        }
        // draw a circle
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        // draw a line
        if (this.points.length > 0) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = "black";
          this.ctx.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
          this.ctx.lineTo(point.x, point.y);
          this.ctx.stroke();
        }
        this.points.push(point)
        this.prevDrawTime = performance.now()
      }
    })
    this.canvas.addEventListener("mousedown", () => {
      this.points = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    })
    this.canvas.addEventListener("mouseup", () => {
      const intersects = hasIntersection(this.points)
      if (intersects) {
        this.onComplete?.(new Error("The path has an intersection"))
        return
      }
      const clockwise = isClockwisePath(this.points)
      const points = clockwise ? this.points.reverse() : [...this.points]
      if (points.length >= 3) {
        {
          const triangles = triangulate(this.points)
          triangles.forEach((t, i) => {
            this.ctx.beginPath();
            this.ctx.moveTo(points[t[0]].x, points[t[0]].y);
            this.ctx.lineTo(points[t[1]].x, points[t[1]].y);
            this.ctx.lineTo(points[t[2]].x, points[t[2]].y);
            this.ctx.closePath();
            this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"
            this.ctx.stroke();
            const hue = i / triangles.length * 300
            this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
            this.ctx.fill();
          })
          points.forEach((p, i) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = "red";
            this.ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = "black";
            this.ctx.fillText(`${i}`, p.x, p.y)
          })
          this.onComplete?.()
        }
        {
          const start = performance.now()
          console.log("clockwise: ", isClockwisePath(this.points))
          const end = performance.now()
          console.log("time: ", end - start)
        }
        {
          const start = performance.now()
          console.log("hasCrossing: ", hasIntersection(this.points))
          const end = performance.now()
          console.log("time: ", end - start)
        }
      }
    })
  }

}