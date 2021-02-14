/* eslint-disable no-bitwise */
export function getRandomInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

export function degToRad(deg: number) {
  return deg * Math.PI / 180;
}

export function getDistance2D(x1: number, y1: number, x2: number, y2: number): number {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

export function getDistance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  const x = x2 - x1;
  const y = y2 - y1;
  const z = z2 - z1;
  return Math.sqrt(x * x + y * y + z * z);
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

export function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

export function smoothstep(v: number, min: number, max: number, perlin: false) {
  v = clamp((v - min) / (max - min), 0, 1);
  return perlin
    ? v * v * v * (v * (v * 6 - 15) + 10)
    : v * v * (3 - 2 * v);
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}

export interface NumberElements extends Iterable<number> {  
  readonly length: number;
  toArray(): number[];
  toIntArray(): Int32Array;
  toFloatArray(): Float32Array;
}

export interface Vec extends NumberElements {
  clone(): Vec;
  addScalar(s: number): Vec;
  multiplyByScalar(s: number): Vec;
  normalize(): Vec;
  getMagnitude(): number;
}

export interface Mat extends NumberElements {
  clone(): Mat;
  invert(): Mat;
  transpose(): Mat;
  getDeterminant(): number;
}
