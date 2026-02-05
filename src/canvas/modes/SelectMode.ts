import type {Shape} from '../../shapes/interfaces/Shape';
import type {Point} from '../../utils/geometry';
import type {EventMap, ModeContext, ModeAttributes} from '../types';
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
        const {
            requestRender,
            getShapes,
            getCanvasPointFromMouseEvent,
            reportAction,
        } = context;

        return {
            mousedown: (mouseEvent: MouseEvent) => {
                const canvasPoint = getCanvasPointFromMouseEvent(mouseEvent);

                this.dragStartPoint = canvasPoint;
                this.isDragging = false;
                this.currentShape = null;

                for (const shape of getShapes()) {
                    if (shape.isInShape(canvasPoint)) {
                        this.currentShape = shape;
                        this.isDragging = true;
                        reportAction?.(
                            `Picked shape for dragging at (${Math.round(canvasPoint.x)}, ${Math.round(canvasPoint.y)})`,
                        );
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
                if (this.isDragging && this.currentShape) {
                    reportAction?.('Finished dragging shape');
                }
                this.isDragging = false;
            },

            mouseout: () => {
                if (this.isDragging) {
                    reportAction?.('Drag cancelled (mouse left canvas)');
                }
                this.isDragging = false;
                this.currentShape = null;
            },
        };
    }

    onEnter(context: ModeContext): void {
        context.setCursor(this.attributes.cursor ?? 'default');
        context.reportAction?.('Entered Select mode');
    }
}
