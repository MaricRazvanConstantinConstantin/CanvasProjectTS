import {Circle} from '../../shapes/Circle';
import type {Point} from '../../utils/geometry';
import type {EventMap, ModeContext, CommonCreateAttributes} from '../types';
import {BaseMode} from './BaseMode';

export interface CreateCircleAttributes extends CommonCreateAttributes {
    name: 'create_circle';
}

export class CreateCircleMode extends BaseMode<CreateCircleAttributes> {
    private anchorPoint: Point | null = null;
    private isCreating = false;
    private previewRadius = 0;

    handlers(context: ModeContext): EventMap {
        const {
            requestRender,
            addShape,
            getCanvasPointFromMouseEvent,
            reportAction,
        } = context;

        return {
            mousedown: (mouseEvent: MouseEvent) => {
                this.anchorPoint = getCanvasPointFromMouseEvent(mouseEvent);
                this.isCreating = true;
                this.previewRadius = 0;
                reportAction?.(
                    `Start circle at (${Math.round(this.anchorPoint.x)}, ${Math.round(this.anchorPoint.y)})`,
                );
                requestRender();
            },

            mousemove: (mouseEvent: MouseEvent) => {
                if (!this.isCreating || !this.anchorPoint) return;
                const currentPoint = getCanvasPointFromMouseEvent(mouseEvent);
                const deltaX = currentPoint.x - this.anchorPoint.x;
                const deltaY = currentPoint.y - this.anchorPoint.y;
                this.previewRadius = Math.max(1, Math.hypot(deltaX, deltaY));
                requestRender();
            },

            mouseup: (mouseEvent: MouseEvent) => {
                if (!this.isCreating || !this.anchorPoint) return;
                const currentPoint = getCanvasPointFromMouseEvent(mouseEvent);
                const deltaX = currentPoint.x - this.anchorPoint.x;
                const deltaY = currentPoint.y - this.anchorPoint.y;
                const radius = Math.max(1, Math.hypot(deltaX, deltaY));

                const circle = new Circle(
                    this.anchorPoint,
                    radius,
                    this.attributes.finalFillColor,
                    this.attributes.finalStrokeColor,
                    this.attributes.finalLineWidth,
                );
                addShape(circle);

                reportAction?.(
                    `Created circle center=(${Math.round(this.anchorPoint.x)}, ${Math.round(this.anchorPoint.y)}) radius=${Math.round(radius)}`,
                );

                this.isCreating = false;
                this.anchorPoint = null;
                this.previewRadius = 0;
                requestRender();
            },

            mouseout: () => {
                if (this.isCreating)
                    reportAction?.('Circle creation cancelled');
                this.isCreating = false;
                this.anchorPoint = null;
                this.previewRadius = 0;
                requestRender();
            },
        };
    }

    renderOverlay(context: ModeContext): void {
        if (!this.isCreating || !this.anchorPoint || this.previewRadius <= 0)
            return;

        const canvasRenderingContext = context.getRenderingContext2D();
        canvasRenderingContext.save();
        canvasRenderingContext.beginPath();
        canvasRenderingContext.arc(
            this.anchorPoint.x,
            this.anchorPoint.y,
            this.previewRadius,
            0,
            Math.PI * 2,
        );

        canvasRenderingContext.fillStyle = this.attributes.previewFillColor;
        canvasRenderingContext.strokeStyle = this.attributes.previewStrokeColor;
        canvasRenderingContext.lineWidth = this.attributes.previewLineWidth;

        canvasRenderingContext.fill();
        canvasRenderingContext.stroke();
        canvasRenderingContext.restore();
    }

    onEnter(context: ModeContext): void {
        context.setCursor(this.attributes.cursor ?? 'crosshair');
    }
}
