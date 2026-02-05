import type {Shape} from '../shapes/interfaces/Shape';
import {Circle} from '../shapes/Circle';
import {Rectangle} from '../shapes/Rectangle';
import {Square} from '../shapes/Square';
import type {Point} from '../utils/geometry';

import type {CanvasMode, ModeContext} from './types';
import {EventDispatcher} from './events/EventDispatcher';
import {LogWindow, type LogSnapshot} from '../ui/LogWindow';

export class Canvas {
    public shapesList: Shape[] = [];
    public readonly canvasElement: HTMLCanvasElement;

    private currentMode: CanvasMode | null = null;
    private eventDispatcher: EventDispatcher;
    private needsRender = true;
    private animationFrameId = 0;

    private logWindow: LogWindow | null = null;
    private lastCursorPoint: Point | null = null;
    private lastActionMessage: string | undefined = undefined;

    constructor() {
        const foundCanvas = document.getElementById(
            'canvas',
        ) as HTMLCanvasElement | null;
        if (!foundCanvas) {
            throw new Error(
                'Canvas element with id="canvas" not found in the DOM.',
            );
        }
        this.canvasElement = foundCanvas;

        this.canvasElement.height = window.innerHeight / 1.5;
        this.canvasElement.width = window.innerWidth / 1.5;

        this.eventDispatcher = new EventDispatcher(this.canvasElement);
        this.startRenderLoop();
        this.initialiseShapesList();

        this.canvasElement.addEventListener('mousemove', (mouseEvent) => {
            this.lastCursorPoint =
                this.getCanvasPointFromMouseEvent(mouseEvent);
            this.requestRender();
        });
    }

    setMode(mode: CanvasMode): void {
        if (this.currentMode?.onExit) {
            this.currentMode.onExit(this.modeContext);
        }
        this.eventDispatcher.detach();

        this.currentMode = mode;
        this.eventDispatcher.attach(mode.handlers(this.modeContext));
        if (mode.onEnter) mode.onEnter(this.modeContext);

        this.requestRender();
    }

    getModeAttributes(): unknown {
        return this.currentMode?.attributes;
    }

    updateModeAttributes(patch: Record<string, unknown>): void {
        if (!this.currentMode || !this.currentMode.updateAttributes) return;
        this.currentMode.updateAttributes(patch as any);
        this.requestRender();
    }

    addShape(shape: Shape): void {
        this.shapesList.push(shape);
        this.requestRender();
    }

    requestRender = (): void => {
        this.needsRender = true;
    };

    private startRenderLoop(): void {
        const tick = () => {
            if (this.needsRender) {
                this.render();
                this.needsRender = false;
            }
            this.animationFrameId = requestAnimationFrame(tick);
        };
        this.animationFrameId = requestAnimationFrame(tick);
    }

    destroy(): void {
        cancelAnimationFrame(this.animationFrameId);
        this.eventDispatcher.detach();
    }

    private getRenderingContext2D(): CanvasRenderingContext2D {
        const renderingContext = this.canvasElement.getContext('2d');
        if (!renderingContext)
            throw new Error('2D rendering context not available.');
        return renderingContext;
    }

    private getCanvasPointFromMouseEvent(mouseEvent: MouseEvent): Point {
        const boundingRect = this.canvasElement.getBoundingClientRect();
        const scaleX = this.canvasElement.width / boundingRect.width;
        const scaleY = this.canvasElement.height / boundingRect.height;

        return {
            x: (mouseEvent.clientX - boundingRect.left) * scaleX,
            y: (mouseEvent.clientY - boundingRect.top) * scaleY,
        };
    }

    private get modeContext(): ModeContext {
        return {
            canvasElement: this.canvasElement,
            getRenderingContext2D: this.getRenderingContext2D.bind(this),
            getShapes: () => this.shapesList,
            addShape: (shape: Shape) => this.addShape(shape),
            requestRender: this.requestRender,
            getCanvasPointFromMouseEvent:
                this.getCanvasPointFromMouseEvent.bind(this),
            setCursor: (cursor: string) => {
                this.canvasElement.style.cursor = cursor;
            },
            reportAction: (message: string) => this.pushAction(message),
        };
    }

    initialiseShapesList(): void {
        this.shapesList = [
            new Circle({x: 100, y: 120}, 5, '#FF6B6B', '#FF6B6B', 5),
            new Circle({x: 220, y: 80}, 7, '#4D96FF', '#4D96FF', 3),
            new Square({x: 50, y: 200}, 60, '#6BCB77', '#FFD93D', 3),
            new Square({x: 140, y: 210}, 30, '#FFD93D', '#6BCB77', 2),
            new Rectangle({x: 220, y: 180}, 120, 60, '#845EC2', '#845EC2', 1),
            new Rectangle({x: 380, y: 60}, 80, 30, '#2C73D2', '#845EC2', 3),
        ];
        this.requestRender();
    }

    attachLogWindow(logWindow: LogWindow): void {
        this.logWindow = logWindow;
        this.requestRender();
    }

    pushAction(message: string): void {
        this.lastActionMessage = message;
        this.requestRender();
    }

    private render(): void {
        const renderingContext = this.getRenderingContext2D();
        renderingContext.clearRect(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height,
        );

        for (const shape of this.shapesList) {
            shape.draw(renderingContext);
        }

        if (this.currentMode?.renderOverlay) {
            this.currentMode.renderOverlay(this.modeContext);
        }

        if (this.logWindow) {
            const snapshot: LogSnapshot = {
                modeName: this.currentMode?.attributes?.name ?? '-',
                cursorX: this.lastCursorPoint?.x ?? null,
                cursorY: this.lastCursorPoint?.y ?? null,
                canvasBufferWidth: this.canvasElement.width,
                canvasBufferHeight: this.canvasElement.height,
                shapesCount: this.shapesList.length,
                lastAction: this.lastActionMessage!,
            };
            this.logWindow.render(snapshot);
        }
    }
}
