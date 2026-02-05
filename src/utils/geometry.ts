export const between = (v: number, min: number, max: number) =>
    v + 2 >= Math.min(min, max) && v - 2 <= Math.max(min, max);

export type Point = {x: number; y: number};
