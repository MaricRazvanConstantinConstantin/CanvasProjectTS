// src/Canvas.ts
import { type Shape } from '../interfaces/Shape';
import { Circle } from '../shapes/Circle';
import { Rectangle } from '../shapes/Rectangle';
import { Square } from '../shapes/Square';
import { type Point } from '../utils/geometry';
import type { CanvasMode } from './CanvasMode';

export class Canvas {
  mousePosition: Point = { x: 0, y: 0 };
  shapesList: Shape[] = [];
  canvas: HTMLCanvasElement = document.getElementById(
    'canvas',
  ) as HTMLCanvasElement;

  #startPoint: Point = { x: 0, y: 0 };
  #currentShape?: Shape | null;
  #isDragging = false;

  #mode: CanvasMode = 'select';
  #isCreating = false;
  #createAnchor?: Point;
  #previewShape?: Shape | null; //

  constructor() {
    this.canvas.height = window.innerHeight / 1.5;
    this.canvas.width = window.innerWidth / 1.5;
    this.configure();
    this.initialiseShapesList();
  }

  setMode(mode: CanvasMode) {
    this.#mode = mode;
    this.#isCreating = false;
    this.#previewShape = null;
    this.#createAnchor = undefined;
    this.drawShapes();
  }

  get mode(): CanvasMode {
    return this.#mode;
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
    const p = this.getCanvasPoint(event);

    switch (this.#mode) {
      case 'select': {
        this.#startPoint = p;
        for (const shape of this.shapesList) {
          if (shape.isInShape(this.#startPoint)) {
            this.#currentShape = shape;
            this.#isDragging = true;
            return;
          }
        }
        this.#currentShape = null;
        this.#isDragging = false;
        return;
      }

      case 'create_circle':
      case 'create_square':
      case 'create_rectangle': {
        this.#createAnchor = p;
        this.#isCreating = true;
        this.#previewShape = this.#makePreviewForMode(this.#mode, p, p);
        this.drawShapesWithPreview();
        return;
      }
    }
  }

  mouseMove(event: MouseEvent) {
    const p = this.getCanvasPoint(event);

    switch (this.#mode) {
      case 'select': {
        if (!this.#isDragging || !this.#currentShape) return;

        this.mousePosition = p;
        const dx = this.mousePosition.x - this.#startPoint.x;
        const dy = this.mousePosition.y - this.#startPoint.y;

        this.#currentShape.updateReferencePoint(dx, dy);
        this.drawShapes();
        this.#startPoint = { ...this.mousePosition };
        return;
      }

      case 'create_circle':
      case 'create_square':
      case 'create_rectangle': {
        if (!this.#isCreating || !this.#createAnchor) return;

        this.#previewShape = this.#makePreviewForMode(
          this.#mode,
          this.#createAnchor,
          p,
        );
        this.drawShapesWithPreview();
        return;
      }
    }
  }

  mouseUp(event: MouseEvent) {
    event.preventDefault();

    switch (this.#mode) {
      case 'select': {
        if (!this.#isDragging) return;
        this.#isDragging = false;
        return;
      }

      case 'create_circle':
      case 'create_square':
      case 'create_rectangle': {
        if (!this.#isCreating || !this.#createAnchor) return;

        const p = this.getCanvasPoint(event);
        const shape = this.#finalizeCreate(this.#mode, this.#createAnchor, p);
        if (shape) this.addShape(shape);

        this.#isCreating = false;
        this.#createAnchor = undefined;
        this.#previewShape = null;
        this.drawShapes();
        return;
      }
    }
  }

  mouseOut(event: MouseEvent) {
    event.preventDefault();

    switch (this.#mode) {
      case 'select': {
        if (!this.#isDragging) return;
        this.#isDragging = false;
        this.#currentShape = null;
        return;
      }

      case 'create_circle':
      case 'create_square':
      case 'create_rectangle': {
        if (!this.#isCreating) return;
        this.#isCreating = false;
        this.#createAnchor = undefined;
        this.#previewShape = null;
        this.drawShapes();
        return;
      }
    }
  }

  #makePreviewForMode(
    mode: CanvasMode,
    anchor: Point,
    current: Point,
  ): Shape | null {
    const dx = current.x - anchor.x;
    const dy = current.y - anchor.y;

    switch (mode) {
      case 'create_circle': {
        const radius = Math.max(1, Math.hypot(dx, dy));
        return new Circle(anchor, radius, 'rgba(77,150,255,0.2)', '#4D96FF', 2);
      }

      case 'create_square': {
        const side = Math.max(2, Math.max(Math.abs(dx), Math.abs(dy)) * 2);
        const topLeft = { x: anchor.x - side / 2, y: anchor.y - side / 2 };
        return new Square(topLeft, side, 'rgba(255,217,61,0.2)', '#6BCB77', 2);
      }

      case 'create_rectangle': {
        const width = Math.max(2, Math.abs(dx) * 2);
        const height = Math.max(2, Math.abs(dy) * 2);
        const topLeft = { x: anchor.x - width / 2, y: anchor.y - height / 2 };
        return new Rectangle(
          topLeft,
          width,
          height,
          'rgba(132,94,194,0.2)',
          '#845EC2',
          2,
        );
      }

      default:
        return null;
    }
  }

  #finalizeCreate(
    mode: CanvasMode,
    anchor: Point,
    current: Point,
  ): Shape | null {
    const dx = current.x - anchor.x;
    const dy = current.y - anchor.y;

    switch (mode) {
      case 'create_circle': {
        const radius = Math.max(1, Math.hypot(dx, dy));
        return new Circle(anchor, radius, '#4D96FF', '#4D96FF', 3);
      }
      case 'create_square': {
        const side = Math.max(2, Math.max(Math.abs(dx), Math.abs(dy)) * 2);
        const topLeft = { x: anchor.x - side / 2, y: anchor.y - side / 2 };
        return new Square(topLeft, side, '#FFD93D', '#6BCB77', 3);
      }
      case 'create_rectangle': {
        const width = Math.max(2, Math.abs(dx) * 2);
        const height = Math.max(2, Math.abs(dy) * 2);
        const topLeft = { x: anchor.x - width / 2, y: anchor.y - height / 2 };
        return new Rectangle(topLeft, width, height, '#845EC2', '#845EC2', 3);
      }
      default:
        return null;
    }
  }

  addShape(shape: Shape) {
    this.shapesList.push(shape);
    this.drawShapes();
  }

  drawShapes() {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapesList.forEach((shape) => shape.draw(ctx));
  }

  private drawShapesWithPreview() {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapesList.forEach((shape) => shape.draw(ctx));
    if (this.#previewShape) {
      this.#previewShape.draw(ctx);
    }
  }

  initialiseShapesList() {
    this.shapesList = [
      new Circle({ x: 100, y: 120 }, 5, '#FF6B6B', '#FF6B6B', 5),
      new Circle({ x: 220, y: 80 }, 7, '#4D96FF', '#4D96FF', 3),
      new Square({ x: 50, y: 200 }, 60, '#6BCB77', '#FFD93D', 3),
      new Square({ x: 140, y: 210 }, 30, '#FFD93D', '#6BCB77', 2),
      new Rectangle({ x: 220, y: 180 }, 120, 60, '#845EC2', '#845EC2', 1),
      new Rectangle({ x: 380, y: 60 }, 80, 30, '#2C73D2', '#845EC2', 3),
    ];
    this.drawShapes();
  }
}
