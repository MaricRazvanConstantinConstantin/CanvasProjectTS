import { type Shape } from '../interfaces/Shape';
import { Circle } from '../shapes/Circle';
import { Rectangle } from '../shapes/Rectangle';
import { Square } from '../shapes/Square';
import { type Point } from '../utils/geometry';

export class Canvas {
  mousePosition: Point = { x: 0, y: 0 };
  shapesList: Shape[] = [];
  canvas: HTMLCanvasElement = document.getElementById(
    'canvas',
  ) as HTMLCanvasElement;
  #startPoint: Point = { x: 0, y: 0 };
  #currentShape?: Shape | null;
  #isDragging?: boolean;

  constructor() {
    this.canvas.height = window.innerHeight / 1.5;
    this.canvas.width = window.innerWidth / 1.5;
    this.configure();
    this.initialiseShapesList();
  }

  configure() {
    this.canvas.onmousedown = this.mouseDown.bind(this);
    this.canvas.onmouseup = this.mouseUp.bind(this);
    this.canvas.onmouseout = this.mouseOut.bind(this);
    this.canvas.onmousemove = this.mouseMove.bind(this);
  }

  private getCanvasPoint(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  mouseDown(event: MouseEvent) {
    event.preventDefault();

    this.#startPoint = this.getCanvasPoint(event);

    for (let shape of this.shapesList) {
      if (shape.isInShape(this.#startPoint)) {
        this.#currentShape = shape;
        this.#isDragging = true;
        return;
      }
    }

    this.#currentShape = null;
    this.#isDragging = false;
  }

  mouseUp(event: MouseEvent) {
    event.preventDefault();
    if (!this.#isDragging) {
      return;
    }
    event.preventDefault();
    this.#isDragging = false;
  }

  mouseOut(event: MouseEvent) {
    event.preventDefault();
    if (!this.#isDragging) {
      return;
    }
    event.preventDefault();
    this.#isDragging = false;
    this.#currentShape = null;
  }

  mouseMove(event: MouseEvent) {
    if (!this.#isDragging) {
      return;
    }

    this.mousePosition = this.getCanvasPoint(event);

    let distanceX = this.mousePosition.x - this.#startPoint.x;
    let distanceY = this.mousePosition.y - this.#startPoint.y;

    this.#currentShape!.updateReferencePoint(distanceX, distanceY);
    this.drawShapes();
    this.#startPoint = { ...this.mousePosition };
  }

  addShape(shape: Shape) {
    this.shapesList.push(shape);
    this.drawShapes();
  }

  drawShapes() {
    this.canvas
      .getContext('2d')!
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapesList.forEach((shape: Shape) =>
      shape.draw(this.canvas.getContext('2d')!),
    );
  }

  initialiseShapesList() {
    this.shapesList = [
      new Circle({ x: 100, y: 120 }, 5, '#FF6B6B', '#FF6B6B', 5),
      new Circle({ x: 220, y: 80 }, 7, '#4D96FF', '#4D96FF', 3),
      new Square({ x: 50, y: 200 }, 60, '#6BCB77', '#FFD93D', 3),
      new Square({ x: 140, y: 210 }, 30, '#FFD93D', '#6BCB77', 2),
      new Rectangle({ x: 220, y: 180 }, 120, 60, '#845EC2', '#845EC2'),
      new Rectangle({ x: 380, y: 60 }, 80, 30, '#2C73D2', '#845EC2', 3),
    ];
    this.drawShapes();
  }
}
