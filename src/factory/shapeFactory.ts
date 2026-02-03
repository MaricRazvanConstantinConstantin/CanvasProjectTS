import type { Shape } from '../interfaces/Shape';
import type {
  ShapeOptions,
  CircleOptions,
  RectangleOptions,
  SquareOptions,
} from '../interfaces/ShapeOptions';
import { Circle } from '../shapes/Circle';
import { Rectangle } from '../shapes/Rectangle';
import { Square } from '../shapes/Square';

const DEFAULTS = {
  lineColor: '#111827',
  fillColor: undefined as string | undefined,
  lineWidth: 1,
};

export function createShape(options: ShapeOptions): Shape {
  switch (options.kind) {
    case 'circle': {
      const o = options as CircleOptions;
      return new Circle(
        o.center,
        o.radius,
        o.fillColor ?? DEFAULTS.fillColor,
        o.lineColor ?? DEFAULTS.lineColor,
        o.lineWidth ?? DEFAULTS.lineWidth,
      );
    }

    case 'rectangle': {
      const o = options as RectangleOptions;
      return new Rectangle(
        o.topLeftCorner,
        o.width,
        o.height,
        o.fillColor ?? DEFAULTS.fillColor,
        o.lineColor ?? DEFAULTS.lineColor,
        o.lineWidth ?? DEFAULTS.lineWidth,
      );
    }

    case 'square': {
      const o = options as SquareOptions;
      return new Square(
        o.topLeftCorner,
        o.side,
        o.fillColor ?? DEFAULTS.fillColor,
        o.lineColor ?? DEFAULTS.lineColor,
        o.lineWidth ?? DEFAULTS.lineWidth,
      );
    }

    default: {
      const _exhaustive: never = options;
      throw new Error(`Unsupported shape kind: ${String(_exhaustive)}`);
    }
  }
}
