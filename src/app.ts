import {Canvas} from './canvas/Canvas';
import {Toolbar, type ToolName} from './toolbar';

import {SelectMode} from './modes/SelectMode';
import {CreateCircleMode} from './modes/CreateCircleMode';
import {CreateSquareMode} from './modes/CreateSquareMode';
import {CreateRectangleMode} from './modes/CreateRectangleMode';

function makeModeForTool(tool: ToolName) {
    switch (tool) {
        case 'select':
            return new SelectMode({
                name: 'select',
                cursor: 'default',
            });

        case 'circle':
            return new CreateCircleMode({
                name: 'create_circle',
                cursor: 'crosshair',
                previewFillColor: 'rgba(77,150,255,0.2)',
                previewStrokeColor: '#4D96FF',
                previewLineWidth: 2,
                finalFillColor: '#4D96FF',
                finalStrokeColor: '#4D96FF',
                finalLineWidth: 3,
            });

        case 'square':
            return new CreateSquareMode({
                name: 'create_square',
                cursor: 'crosshair',
                previewFillColor: 'rgba(255,217,61,0.2)',
                previewStrokeColor: '#6BCB77',
                previewLineWidth: 2,
                finalFillColor: '#FFD93D',
                finalStrokeColor: '#6BCB77',
                finalLineWidth: 3,
            });

        case 'rectangle':
            return new CreateRectangleMode({
                name: 'create_rectangle',
                cursor: 'crosshair',
                previewFillColor: 'rgba(132,94,194,0.2)',
                previewStrokeColor: '#845EC2',
                previewLineWidth: 2,
                finalFillColor: '#845EC2',
                finalStrokeColor: '#845EC2',
                finalLineWidth: 3,
            });
    }
}

function main() {
    const canvas = new Canvas();

    const toolbarRoot = document.getElementById('toolBar');
    if (!toolbarRoot) {
        console.error('Toolbar root #toolBar not found');
        return;
    }

    const toolbar = new Toolbar({
        root: toolbarRoot,
        initial: 'select',
        enableShortcuts: false,
        onChange: (tool) => {
            const mode = makeModeForTool(tool);
            if (mode) canvas.setMode(mode);
        },
    });

    const initialMode = makeModeForTool('select');
    if (initialMode) canvas.setMode(initialMode);
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
