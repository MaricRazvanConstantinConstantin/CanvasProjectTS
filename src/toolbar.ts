export type ToolName = 'select' | 'circle' | 'square' | 'rectangle';

function isToolName(value: unknown): value is ToolName {
    return (
        typeof value === 'string' &&
        ['select', 'circle', 'square', 'rectangle'].includes(value)
    );
}

export interface ToolbarOptions {
    root: HTMLElement;
    initial?: ToolName;
    onChange?: (tool: ToolName) => void;
    enableShortcuts?: boolean;
}

export class Toolbar {
    private root: HTMLElement;
    private buttons: HTMLButtonElement[] = [];
    private current: ToolName = 'select';
    private onChange?: (tool: ToolName) => void;
    private keyHandler?: (e: KeyboardEvent) => void;

    constructor(opts: ToolbarOptions) {
        this.root = opts.root;
        this.onChange = opts.onChange;
        this.buttons = Array.from(
            this.root.querySelectorAll<HTMLButtonElement>('button[data-tool]'),
        );
        this.current = opts.initial ?? 'select';

        this.root.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
                'button[data-tool]',
            );
            if (!btn) return;
            const tool = btn.dataset.tool;

            if (!isToolName(tool)) return;

            this.setActive(tool);
        });

        if (opts.enableShortcuts !== false) {
            this.keyHandler = (e: KeyboardEvent) => {
                if (
                    ['INPUT', 'TEXTAREA'].includes(
                        document.activeElement?.tagName ?? '',
                    )
                )
                    return;
                const key = e.key.toLowerCase();
                if (key === 'v') this.setActive('select');
                if (key === 'c') this.setActive('circle');
                if (key === 's') this.setActive('square');
                if (key === 'r') this.setActive('rectangle');
            };
            window.addEventListener('keydown', this.keyHandler);
        }

        this.setActive(this.current, true);
    }

    destroy() {
        if (this.keyHandler) {
            window.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = undefined;
        }
    }

    get value(): ToolName {
        return this.current;
    }

    setActive(tool: ToolName, silent = false) {
        this.current = tool;
        this.buttons.forEach((btn) => {
            const active = btn.dataset.tool === tool;
            btn.setAttribute('aria-pressed', String(active));
            btn.classList.toggle('bg-blue-600', active);
            btn.classList.toggle('text-white', active);
            btn.classList.toggle('bg-white', !active);
            btn.classList.toggle('text-gray-700', !active);
            btn.classList.toggle('hover:bg-gray-50', !active);
            btn.classList.toggle('focus-visible:ring-2', true);
            btn.classList.toggle('focus-visible:ring-blue-500', true);
        });

        if (!silent && this.onChange) {
            this.onChange(tool);
        }
    }
}
