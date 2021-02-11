import { Mat, Vec } from "./common";

export class Vec2 implements Vec {
  readonly length = 2;
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static multiplyByScalar(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x * s, v.y * s);
  }
  
  static addScalar(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x + s, v.y + s);
  }

  static normalize(v: Vec2): Vec2 {
    return new Vec2().setFromVec2(v).normalize();
  }

  static add(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }

  static substract(v1: Vec2, v2: Vec2): Vec2 {
    return new Vec2(v1.x - v2.x, v1.y - v2.y);
  }

  static dotProduct(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static applyMat3(v: Vec2, m: Mat): Vec2 {
    return v.clone().applyMat3(m);
  }

  static lerp(v1: Vec2, v2: Vec2, t: number): Vec2 {
    return v1.clone().lerp(v2, t);
  }
  
  static rotate(v: Vec2, center: Vec2, theta: number): Vec2 {
    return v.clone().rotate(center, theta);
  }

  static equals(v1: Vec2, v2: Vec2, precision = 6): boolean {
    return v1.equals(v2);
  }
  
  static getDistance(v1: Vec2, v2: Vec2): number {
    const x = v2.x - v1.x;
    const y = v2.y - v1.y;
    return Math.sqrt(x * x + y * y);
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  set(x: number, y: number): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }
  
  setFromVec2(vec2: Vec2): Vec2 {
    this.x = vec2.x;
    this.y = vec2.y;
    return this;
  }

  multiplyByScalar(s: number): Vec2 {
    this.x *= s;
    this.y *= s;
    return this;
  }

  addScalar(s: number): Vec2 {
    this.x += s;
    this.y += s;
    return this;
  }

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vec2 {
    const m = this.getMagnitude();
    if (m) {
      this.x /= m;
      this.y /= m;      
    }
    return this;
  }  

  add(v: Vec2): Vec2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  substract(v: Vec2): Vec2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  dotProduct(v: Vec2): number {
    return Vec2.dotProduct(this, v);
  }

  applyMat3(m: Mat): Vec2 {
    if (m.length !== 9) {
      throw new Error("Matrix must contain 9 elements");
    }

    const {x, y} = this;
    const [x_x, x_y,, y_x, y_y,, z_x, z_y,] = m;

    this.x = x * x_x + y * y_x + z_x;
    this.y = x * x_y + y * y_y + z_y;

    return this;
  } 

  lerp(v: Vec2, t: number): Vec2 {
    this.x += t * (v.x - this.x);
    this.y += t * (v.y - this.y);
    return this;
  }
  
  rotate(center: Vec2, theta: number): Vec2 {
    const s = Math.sin(theta);
    const c = Math.cos(theta);

    const x = this.x - center.x;
    const y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;

    return this;
  }

  equals(v: Vec2, precision = 6): boolean {
    return +this.x.toFixed(precision) === +v.x.toFixed(precision)
      && +this.y.toFixed(precision) === +v.y.toFixed(precision);
  }  

  toArray(): number[] {
    return [this.x, this.y];
  }

  toIntArray(): Int32Array {
    return new Int32Array(this);
  } 
  
  toFloatArray(): Float32Array {
    return new Float32Array(this);
  } 

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
  }
}
