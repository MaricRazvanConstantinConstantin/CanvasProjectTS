import type {EventMap} from '../types';

export class EventDispatcher {
    private readonly canvasElement: HTMLCanvasElement;
    private boundListeners: Partial<Record<keyof EventMap, EventListener>> = {};

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvasElement = canvasElement;
    }

    attach(eventMap: EventMap): void {
        this.detach();

        const bind = <K extends keyof EventMap>(
            eventType: K,
            handler?: EventMap[K],
        ) => {
            if (!handler) return;
            const listener: EventListener = (domEvent: Event) =>
                handler(domEvent as MouseEvent);
            this.boundListeners[eventType] = listener;
            this.canvasElement.addEventListener(eventType, listener as any);
        };

        bind('mousedown', eventMap.mousedown);
        bind('mousemove', eventMap.mousemove);
        bind('mouseup', eventMap.mouseup);
        bind('mouseout', eventMap.mouseout);
    }

    detach(): void {
        for (const [eventType, listener] of Object.entries(
            this.boundListeners,
        )) {
            if (!listener) continue;
            this.canvasElement.removeEventListener(eventType, listener as any);
        }
        this.boundListeners = {};
    }
}
