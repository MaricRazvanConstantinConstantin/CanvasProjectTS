import type {Shape} from '../interfaces/Shape';
import type {Point} from '../utils/geometry';
import type {EventMap, ModeContext, ModeAttributes} from '../canvas/types';
import {BaseMode} from './BaseMode';

export interface SelectModeAttributes extends ModeAttributes {
    name: 'select';
    cursor?: string;
}

export class SelectMode extends BaseMode<SelectModeAttributes> {
    private isDragging = false;
    private dragStartPoint: Point | null = null;
    private currentShape: Shape | null = null;

    handlers(context: ModeContext): EventMap {
        const {requestRender, getShapes, getCanvasPointFromMouseEvent} =
            context;

        return {
            mousedown: (mouseEvent: MouseEvent) => {
                const canvasPoint = getCanvasPointFromMouseEvent(mouseEvent);

                this.dragStartPoint = canvasPoint;
                this.isDragging = false;
                this.currentShape = null;

                for (const shape of getShapes()) {
                    // No tolerance — exact hit detection
                    if (shape.isInShape(canvasPoint)) {
                        this.currentShape = shape;
                        this.isDragging = true;
                        break;
                    }
                }
            },

            mousemove: (mouseEvent: MouseEvent) => {
                if (
                    !this.isDragging ||
                    !this.currentShape ||
                    !this.dragStartPoint
                )
                    return;

                const canvasPoint = getCanvasPointFromMouseEvent(mouseEvent);

                const deltaX = canvasPoint.x - this.dragStartPoint.x;
                const deltaY = canvasPoint.y - this.dragStartPoint.y;

                this.currentShape.updateReferencePoint(deltaX, deltaY);

                this.dragStartPoint = canvasPoint;
                requestRender();
            },

            mouseup: () => {
                this.isDragging = false;
            },

            mouseout: () => {
                this.isDragging = false;
                this.currentShape = null;
            },
        };
    }

    onEnter(context: ModeContext): void {
        context.setCursor(this.attributes.cursor ?? 'default');
    }
}
