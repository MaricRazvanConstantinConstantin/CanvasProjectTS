export type LogSnapshot = {
    modeName: string;
    cursorX: number | null;
    cursorY: number | null;
    canvasBufferWidth: number;
    canvasBufferHeight: number;
    shapesCount: number;
    lastAction: string;
};

export class LogWindow {
    private fields: Record<string, HTMLElement>;

    constructor() {
        const byId = (id: string) => {
            const element = document.getElementById(id);
            if (!element)
                throw new Error(`LogWindow: element #${id} not found`);
            return element;
        };

        this.fields = {
            mode: byId('logMode'),
            cursorX: byId('logCursorX'),
            cursorY: byId('logCursorY'),
            canvasBuffer: byId('logCanvasBuffer'),
            shapes: byId('logShapes'),
            lastAction: byId('lastAction'),
        };
    }

    render(snapshot: LogSnapshot): void {
        this.fields.mode.textContent = snapshot.modeName;

        this.fields.cursorX.textContent =
            snapshot.cursorX == null
                ? '-'
                : String(Math.round(snapshot.cursorX));

        this.fields.cursorY.textContent =
            snapshot.cursorY == null
                ? '-'
                : String(Math.round(snapshot.cursorY));

        this.fields.canvasBuffer.textContent = `${snapshot.canvasBufferWidth} × ${snapshot.canvasBufferHeight} px`;

        this.fields.shapes.textContent = String(snapshot.shapesCount);

        this.fields.lastAction.textContent = String(snapshot.lastAction);
    }
}
