import type {Point} from '../../utils/geometry';

type BaseStyle = {
    lineColor?: string;
    fillColor?: string | undefined;
    lineWidth?: number;
};

export type CircleOptions = BaseStyle & {
    kind: 'circle';
    center: Point;
    radius: number;
};

export type RectangleOptions = BaseStyle & {
    kind: 'rectangle';
    topLeftCorner: Point;
    width: number;
    height: number;
};

export type SquareOptions = BaseStyle & {
    kind: 'square';
    topLeftCorner: Point;
    side: number;
};

export type ShapeOptions = CircleOptions | RectangleOptions | SquareOptions;
