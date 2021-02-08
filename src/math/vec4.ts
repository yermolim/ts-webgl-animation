import { Vec, Mat } from "./common";
import { Vec3 } from "./vec3";

export class Vec4 implements Vec {
  readonly length = 4;
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static fromVec3(v: Vec3): Vec4 {
    return new Vec4(v.x, v.y, v.z);
  }

  static multiplyByScalar(v: Vec4, s: number): Vec4 {
    return new Vec4(v.x * s, v.y * s, v.z * s, v.w * s);
  }

  static addScalar(v: Vec4, s: number): Vec4 {
    return new Vec4(v.x + s, v.y + s, v.z + s, v.w + s);
  }

  static normalize(v: Vec4): Vec4 {
    return new Vec4().setFromVec4(v).normalize();
  }  

  static add(v1: Vec4, v2: Vec4): Vec4 {
    return new Vec4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
  }

  static substract(v1: Vec4, v2: Vec4): Vec4 {
    return new Vec4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
  }  

  static dotProduct(v1: Vec4, v2: Vec4): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
  }

  static applyMat4(v: Vec4, m: Mat): Vec4 {
    return v.clone().applyMat4(m);
  }

  static lerp(v1: Vec4, v2: Vec4, t: number): Vec4 {
    return v1.clone().lerp(v2, t);
  }

  static equals(v1: Vec4, v2: Vec4, precision = 6): boolean {
    return v1.equals(v2, precision);
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): Vec4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  } 

  setFromVec3(v: Vec3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = 1;
  }
  
  setFromVec4(v: Vec4): Vec4 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  multiplyByScalar(s: number): Vec4 {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
    return this;
  }

  addScalar(s: number): Vec4 {
    this.x += s;
    this.y += s;
    this.z += s;
    this.w += s;
    return this;
  }  

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize(): Vec4 {
    const m = this.getMagnitude();
    if (m) {
      this.x /= m;
      this.y /= m;
      this.z /= m;
      this.w /= m;
    }
    return this;
  }

  add(v: Vec4): Vec4 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  substract(v: Vec4): Vec4 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  } 

  dotProduct(v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }
  
  applyMat4(m: Mat): Vec4 {
    if (m.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    
    const {x, y, z, w} = this; 
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;  

    this.x = x * x_x + y * y_x + z * z_x + w * w_x;
    this.y = x * x_y + y * y_y + z * z_y + w * w_y;
    this.z = x * x_z + y * y_z + z * z_z + w * w_z;
    this.w = x * x_w + y * y_w + z * z_w + w * w_w;

    return this;
  }  
  
  lerp(v: Vec4, t: number): Vec4 {
    this.x += t * (v.x - this.x);
    this.y += t * (v.y - this.y);
    this.z += t * (v.z - this.z);
    this.w += t * (v.w - this.w);
    return this;
  }

  equals(v: Vec4, precision = 6): boolean {
    return +this.x.toFixed(precision) === +v.x.toFixed(precision)
      && +this.y.toFixed(precision) === +v.y.toFixed(precision)
      && +this.z.toFixed(precision) === +v.z.toFixed(precision)
      && +this.w.toFixed(precision) === +v.w.toFixed(precision);
  }  

  toArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }

  toTypedArray(): Float32Array {
    return new Float32Array(this);
  }

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.w;
  }
}
