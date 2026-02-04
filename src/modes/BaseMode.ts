import type {
    CanvasMode,
    ModeAttributes,
    ModeContext,
    EventMap,
} from '../canvas/types';

export abstract class BaseMode<
    A extends ModeAttributes,
> implements CanvasMode<A> {
    public readonly attributes: A;

    constructor(attributes: A) {
        this.attributes = attributes;
    }

    onEnter?(context: ModeContext): void;
    onExit?(context: ModeContext): void;

    abstract handlers(context: ModeContext): EventMap;

    renderOverlay?(context: ModeContext): void;

    updateAttributes(patch: Partial<A>): void {
        Object.assign(this.attributes, patch);
    }
}
