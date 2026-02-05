import {type Shape} from './interfaces/Shape';
import {type Point} from '../utils/geometry';

export class Circle implements Shape {
    constructor(
        public center: Point,
        public radius: number,
        public fillColor: string | undefined,
        public lineColor: string,
        public lineWidth: number = 1,
    ) {
        if (radius < 0) throw new Error('Radius must be >= 0');
    }

    isInShape(point: Point): boolean {
        const distance = Math.hypot(
            point.x - this.center.x,
            point.y - this.center.y,
        );
        return distance - this.radius <= 2;
    }

    draw(canvasContext: CanvasRenderingContext2D) {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(
            this.center.x,
            this.center.y,
            this.radius,
            0,
            Math.PI * 2,
        );

        if (this.fillColor) {
            canvasContext.fillStyle = this.fillColor;
            canvasContext.fill();
        }

        canvasContext.lineWidth = this.lineWidth;
        canvasContext.strokeStyle = this.lineColor;
        canvasContext.stroke();
        canvasContext.restore();
    }

    updateReferencePoint(distanceX: number, distanceY: number): void {
        this.center.x += distanceX;
        this.center.y += distanceY;
    }
}
