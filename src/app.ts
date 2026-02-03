// src/app.ts
import { Canvas } from './canvas/Canvas';
import { Toolbar, type ToolName } from './toolbar';
import type { CanvasMode } from './canvas/CanvasMode';

function mapToolToMode(tool: ToolName): CanvasMode {
  switch (tool) {
    case 'select':
      return 'select';
    case 'circle':
      return 'create_circle';
    case 'square':
      return 'create_square';
    case 'rectangle':
      return 'create_rectangle';
  }
}

function main() {
  const canvas = new Canvas();

  canvas.configure();
  canvas.initialiseShapesList();
  canvas.setMode('select');

  const barRoot = document.getElementById('toolBar');
  if (!barRoot) {
    console.error('Toolbar root #toolBar not found');
    return;
  }

  const toolbar = new Toolbar({
    root: barRoot,
    initial: 'select',
    enableShortcuts: true,
    onChange: (tool) => {
      const mode = mapToolToMode(tool);
      canvas.setMode(mode);
    },
  });

  (window as any).canvasApp = canvas;
  (window as any).toolbar = toolbar;
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
