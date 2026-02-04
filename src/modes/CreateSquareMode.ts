import {Square} from '../shapes/Square';
import type {Point} from '../utils/geometry';
import type {EventMap, ModeContext, ModeAttributes} from '../canvas/types';
import {BaseMode} from './BaseMode';

export interface CreateSquareAttributes extends ModeAttributes {
    name: 'create_square';
    previewFillColor: string;
    previewStrokeColor: string;
    previewLineWidth: number;

    finalFillColor: string;
    finalStrokeColor: string;
    finalLineWidth: number;

    cursor?: string;
}

export class CreateSquareMode extends BaseMode<CreateSquareAttributes> {
    private anchorPoint: Point | null = null;
    private isCreating = false;
    private previewTopLeft: Point | null = null;
    private previewSide = 0;

    handlers(context: ModeContext): EventMap {
        const {requestRender, addShape, getCanvasPointFromMouseEvent} = context;

        return {
            mousedown: (mouseEvent: MouseEvent) => {
                this.anchorPoint = getCanvasPointFromMouseEvent(mouseEvent);
                this.isCreating = true;
                this.previewTopLeft = this.anchorPoint;
                this.previewSide = 0;
                requestRender();
            },

            mousemove: (mouseEvent: MouseEvent) => {
                if (!this.isCreating || !this.anchorPoint) return;
                const currentPoint = getCanvasPointFromMouseEvent(mouseEvent);
                const side = Math.max(
                    2,
                    Math.max(
                        Math.abs(currentPoint.x - this.anchorPoint.x),
                        Math.abs(currentPoint.y - this.anchorPoint.y),
                    ) * 2,
                );
                this.previewSide = side;
                this.previewTopLeft = {
                    x: this.anchorPoint.x - side / 2,
                    y: this.anchorPoint.y - side / 2,
                };
                requestRender();
            },

            mouseup: () => {
                if (
                    !this.isCreating ||
                    !this.anchorPoint ||
                    !this.previewTopLeft
                )
                    return;
                const square = new Square(
                    this.previewTopLeft,
                    this.previewSide,
                    this.attributes.finalFillColor,
                    this.attributes.finalStrokeColor,
                    this.attributes.finalLineWidth,
                );
                addShape(square);

                this.isCreating = false;
                this.anchorPoint = null;
                this.previewTopLeft = null;
                this.previewSide = 0;
                requestRender();
            },

            mouseout: () => {
                this.isCreating = false;
                this.anchorPoint = null;
                this.previewTopLeft = null;
                this.previewSide = 0;
                requestRender();
            },
        };
    }

    renderOverlay(context: ModeContext): void {
        if (!this.isCreating || !this.previewTopLeft || this.previewSide <= 0)
            return;

        const canvasRenderingContext = context.getRenderingContext2D();
        canvasRenderingContext.save();

        if (this.attributes.previewFillColor) {
            canvasRenderingContext.fillStyle = this.attributes.previewFillColor;
            canvasRenderingContext.fillRect(
                this.previewTopLeft.x,
                this.previewTopLeft.y,
                this.previewSide,
                this.previewSide,
            );
        }

        canvasRenderingContext.strokeStyle = this.attributes.previewStrokeColor;
        canvasRenderingContext.lineWidth = this.attributes.previewLineWidth;
        canvasRenderingContext.strokeRect(
            this.previewTopLeft.x,
            this.previewTopLeft.y,
            this.previewSide,
            this.previewSide,
        );

        canvasRenderingContext.restore();
    }

    onEnter(context: ModeContext): void {
        context.setCursor(this.attributes.cursor ?? 'crosshair');
    }
}
