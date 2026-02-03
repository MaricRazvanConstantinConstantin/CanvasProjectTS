import { type Point } from '../utils/geometry';

export interface Shape {
  fillColor?: string | null;
  lineColor?: string;
  lineWidth?: number;

  isInShape(point: Point, tolerance?: number): boolean;
  draw(canvasContext: CanvasRenderingContext2D): void;
  updateReferencePoint(distanceX: number, distanceY: number): void;
}
