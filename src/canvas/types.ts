import type {Shape} from '../interfaces/Shape';
import type {Point} from '../utils/geometry';

export type CanvasMouseEventHandler = (mouseEvent: MouseEvent) => void;

export type EventMap = {
    mousedown?: CanvasMouseEventHandler;
    mousemove?: CanvasMouseEventHandler;
    mouseup?: CanvasMouseEventHandler;
    mouseout?: CanvasMouseEventHandler;
};

export interface ModeAttributes {
    name: string;
    cursor?: string;
}

export interface ModeContext {
    canvasElement: HTMLCanvasElement;
    getRenderingContext2D: () => CanvasRenderingContext2D;
    getShapes: () => Shape[];
    addShape: (shape: Shape) => void;

    requestRender: () => void;

    getCanvasPointFromMouseEvent: (mouseEvent: MouseEvent) => Point;

    setCursor: (cursor: string) => void;
}

export interface CanvasMode<A extends ModeAttributes = ModeAttributes> {
    readonly attributes: A;

    onEnter?(context: ModeContext): void;
    onExit?(context: ModeContext): void;

    handlers(context: ModeContext): EventMap;

    renderOverlay?(context: ModeContext): void;

    updateAttributes?(patch: Partial<A>): void;
}
