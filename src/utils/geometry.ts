export const between = (v: number, min: number, max: number) =>
  v >= Math.min(min, max) && v <= Math.max(min, max);

export type Point = { x: number; y: number };
