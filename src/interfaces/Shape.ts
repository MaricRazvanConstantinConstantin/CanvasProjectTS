import { type Point } from '../utils/geometry';

export interface Shape {
  fillColor?: string | null;
  lineColor?: string;
  lineWidth?: number;

  isInShape(point: Point, tolerance?: number): boolean;
  draw(canvasContext: CanvasRenderingContext2D): void;
  updateReferencePoint(distanceX: number, distanceY: number): void;
}

export type CircleOptions = {
  kind: 'circle';
  center: Point;
  radius: number;
  fillColor?: string;
  lineColor?: string;
  lineWidth?: number;
};

export type SquareOptions = {
  kind: 'square';
  topLeft: Point;
  size: number;
  stroke?: string;
  fill?: string;
  lineWidth?: number;
};

export type RectangleOptions = {
  kind: 'rectangle';
  topLeft: Point;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  lineWidth?: number;
};

export type ShapeOptions = CircleOptions | SquareOptions | RectangleOptions;
