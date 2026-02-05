import type {Canvas} from '../canvas/Canvas';

export type StyleControlsApi = {
    setVisible: (isVisible: boolean) => void;

    applyToActiveMode: () => void;

    syncFromActiveMode?: () => void;
};

function hexToRgba(hex: string, alpha: number): string {
    const normalized = hex.replace('#', '');
    const bigint = parseInt(normalized, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return `rgba(${red},${green},${blue},${alpha})`;
}

export function initStyleControls(canvas: Canvas): StyleControlsApi {
    const rootElement = document.getElementById(
        'styleControls',
    ) as HTMLElement | null;
    const elementFill = document.getElementById(
        'inputFillColor',
    ) as HTMLInputElement | null;
    const elementStroke = document.getElementById(
        'inputStrokeColor',
    ) as HTMLInputElement | null;
    const elementLineWidth = document.getElementById(
        'inputLineWidth',
    ) as HTMLInputElement | null;
    const elementSwatches = document.getElementById(
        'swatches',
    ) as HTMLElement | null;

    if (!rootElement || !elementFill || !elementStroke || !elementLineWidth) {
        throw new Error('StyleControls: required DOM elements not found.');
    }

    const applyCurrentValuesToActiveMode = () => {
        const finalLineWidth = Math.max(
            1,
            parseInt(elementLineWidth.value || '1', 10),
        );
        const finalFillColor = elementFill.value;
        const finalStrokeColor = elementStroke.value;

        const patch = {
            finalFillColor,
            finalStrokeColor,
            finalLineWidth,

            previewFillColor: hexToRgba(finalFillColor, 0.2),
            previewStrokeColor: finalStrokeColor,
            previewLineWidth: 2,
        };

        canvas.updateModeAttributes(patch);
    };

    elementFill.addEventListener('input', applyCurrentValuesToActiveMode);
    elementStroke.addEventListener('input', applyCurrentValuesToActiveMode);
    elementLineWidth.addEventListener('input', applyCurrentValuesToActiveMode);

    if (elementSwatches) {
        elementSwatches.addEventListener('click', (mouseEvent) => {
            const target = mouseEvent.target as HTMLElement;
            if (!(target instanceof HTMLButtonElement)) return;
            const fillHex = target.dataset.fill;
            const strokeHex = target.dataset.stroke;
            if (fillHex) elementFill.value = fillHex;
            if (strokeHex) elementStroke.value = strokeHex;
            applyCurrentValuesToActiveMode();
        });
    }

    const setVisible = (isVisible: boolean) => {
        rootElement.classList.toggle('hidden', !isVisible);
    };

    applyCurrentValuesToActiveMode();

    return {setVisible, applyToActiveMode: applyCurrentValuesToActiveMode};
}
