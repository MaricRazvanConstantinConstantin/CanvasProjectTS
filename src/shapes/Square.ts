import { type Point } from '../utils/geometry.ts';
import { Rectangle } from './Rectangle.ts';

export class Square extends Rectangle {
  constructor(
    topLeftCorner: Point,
    side: number,
    fillColor: string | undefined,
    lineColor: string,
    lineWidth: number,
  ) {
    super(topLeftCorner, side, side, fillColor, lineColor, lineWidth);
  }
}
