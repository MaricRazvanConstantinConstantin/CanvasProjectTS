import { type Shape } from '../interfaces/Shape';
import { type Point, DEFAULT_TOL, between } from '../utils/geometry';

export class Rectangle implements Shape {
  constructor(
    public topLeftCorner: Point,
    public width: number,
    public height: number,

    public fillColor: string | undefined,
    public lineColor: string,
    public lineWidth: number = 1,
  ) {}

  isInShape(point: Point): boolean {
    const left = this.topLeftCorner.x;
    const right = this.topLeftCorner.x + this.width;
    const top = this.topLeftCorner.y;
    const bottom = this.topLeftCorner.y + this.height;

    const onVertical = between(point.y, top, bottom);

    const onHorizontal = between(point.x, left, right);

    return onVertical && onHorizontal;
  }

  draw(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.save();
    if (this.fillColor) {
      canvasContext.fillStyle = this.fillColor;
      canvasContext.fillRect(
        this.topLeftCorner.x,
        this.topLeftCorner.y,
        this.width,
        this.height,
      );
    }
    canvasContext.lineWidth = this.lineWidth ?? 1;
    canvasContext.strokeStyle = this.lineColor ?? '#000';
    canvasContext.strokeRect(
      this.topLeftCorner.x,
      this.topLeftCorner.y,
      this.width,
      this.height,
    );
    canvasContext.restore();
  }

  updateReferencePoint(distanceX: number, distanceY: number): void {
    this.topLeftCorner.x += distanceX;
    this.topLeftCorner.y += distanceY;
  }
}
