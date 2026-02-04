import {Rectangle} from '../shapes/Rectangle';
import type {Point} from '../utils/geometry';
import type {EventMap, ModeContext, ModeAttributes} from '../canvas/types';
import {BaseMode} from './BaseMode';

export interface CreateRectangleAttributes extends ModeAttributes {
    name: 'create_rectangle';
    previewFillColor: string;
    previewStrokeColor: string;
    previewLineWidth: number;

    finalFillColor: string;
    finalStrokeColor: string;
    finalLineWidth: number;

    cursor?: string;
}

export class CreateRectangleMode extends BaseMode<CreateRectangleAttributes> {
    private anchorPoint: Point | null = null;
    private isCreating = false;
    private previewTopLeft: Point | null = null;
    private previewWidth = 0;
    private previewHeight = 0;

    handlers(context: ModeContext): EventMap {
        const {requestRender, addShape, getCanvasPointFromMouseEvent} = context;

        return {
            mousedown: (mouseEvent: MouseEvent) => {
                this.anchorPoint = getCanvasPointFromMouseEvent(mouseEvent);
                this.isCreating = true;
                this.previewTopLeft = this.anchorPoint;
                this.previewWidth = 0;
                this.previewHeight = 0;
                requestRender();
            },

            mousemove: (mouseEvent: MouseEvent) => {
                if (!this.isCreating || !this.anchorPoint) return;

                const currentPoint = getCanvasPointFromMouseEvent(mouseEvent);
                const width = Math.max(
                    2,
                    Math.abs(currentPoint.x - this.anchorPoint.x) * 2,
                );
                const height = Math.max(
                    2,
                    Math.abs(currentPoint.y - this.anchorPoint.y) * 2,
                );

                this.previewWidth = width;
                this.previewHeight = height;
                this.previewTopLeft = {
                    x: this.anchorPoint.x - width / 2,
                    y: this.anchorPoint.y - height / 2,
                };
                requestRender();
            },

            mouseup: () => {
                if (!this.isCreating || !this.previewTopLeft) return;

                const rectangle = new Rectangle(
                    this.previewTopLeft,
                    this.previewWidth,
                    this.previewHeight,
                    this.attributes.finalFillColor,
                    this.attributes.finalStrokeColor,
                    this.attributes.finalLineWidth,
                );
                // Rectangle constructor matches your original signature:
                // (topLeftCorner, width, height, fillColor, lineColor, lineWidth)

                addShape(rectangle);

                this.isCreating = false;
                this.anchorPoint = null;
                this.previewTopLeft = null;
                this.previewWidth = 0;
                this.previewHeight = 0;
                requestRender();
            },

            mouseout: () => {
                this.isCreating = false;
                this.anchorPoint = null;
                this.previewTopLeft = null;
                this.previewWidth = 0;
                this.previewHeight = 0;
                requestRender();
            },
        };
    }

    renderOverlay(context: ModeContext): void {
        if (!this.isCreating || !this.previewTopLeft) return;

        const canvasRenderingContext = context.getRenderingContext2D();
        canvasRenderingContext.save();

        if (this.attributes.previewFillColor) {
            canvasRenderingContext.fillStyle = this.attributes.previewFillColor;
            canvasRenderingContext.fillRect(
                this.previewTopLeft.x,
                this.previewTopLeft.y,
                this.previewWidth,
                this.previewHeight,
            );
        }

        canvasRenderingContext.strokeStyle = this.attributes.previewStrokeColor;
        canvasRenderingContext.lineWidth = this.attributes.previewLineWidth;
        canvasRenderingContext.strokeRect(
            this.previewTopLeft.x,
            this.previewTopLeft.y,
            this.previewWidth,
            this.previewHeight,
        );

        canvasRenderingContext.restore();
    }

    onEnter(context: ModeContext): void {
        context.setCursor(this.attributes.cursor ?? 'crosshair');
    }
}
