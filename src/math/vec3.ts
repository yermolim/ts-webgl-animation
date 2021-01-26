import { Vec, Mat, clamp } from "./common";

export class Vec3 implements Vec {
  readonly length = 3;
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  static multiplyByScalar(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x * s, v.y * s, v.z * s);
  }
  
  static addScalar(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x + s, v.y + s, v.z + s);
  }

  static normalize(v: Vec3): Vec3 {
    return new Vec3().setFromVec3(v).normalize();
  }  

  static add(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static substract(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static dotProduct(v1: Vec3, v2: Vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static crossProduct(v1: Vec3, v2: Vec3): Vec3 {
    return new Vec3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    );
  }  

  static onVector(v1: Vec3, v2: Vec3): Vec3 {
    return v1.clone().onVector(v2);
  }  

  static onPlane(v: Vec3, planeNormal: Vec3): Vec3 {
    return v.clone().onPlane(planeNormal);
  }  

  static applyMat3(v: Vec3, m: Mat): Vec3 {
    return v.clone().applyMat3(m);
  }

  static applyMat4(v: Vec3, m: Mat): Vec3 {
    return v.clone().applyMat4(m);
  }

  static lerp(v1: Vec3, v2: Vec3, t: number): Vec3 {
    return v1.clone().lerp(v2, t);
  }

  static equals(v1: Vec3, v2: Vec3, precision = 6): boolean {
    return v1.equals(v2, precision);
  }

  static getDistance(v1: Vec3, v2: Vec3): number {
    const x = v2.x - v1.x;
    const y = v2.y - v1.y;
    const z = v2.z - v1.z;
    return Math.sqrt(x * x + y * y + z * z);
  }

  static getAngle(v1: Vec3, v2: Vec3): number {
    return v1.getAngle(v2);
  }
  
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  set(x: number, y: number, z: number): Vec3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  } 
  
  setFromVec3(v: Vec3): Vec3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  } 

  multiplyByScalar(s: number): Vec3 {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  
  addScalar(s: number): Vec3 {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  }

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  getAngle(v: Vec3): number {
    const d = this.getMagnitude() * v.getMagnitude();
    if (!d) {
      return Math.PI / 2;
    }
    const cos = this.dotProduct(v) / d;
    return Math.acos(clamp(cos, -1, 1));
  }

  normalize(): Vec3 {
    const m = this.getMagnitude();
    if (m) {
      this.x /= m;
      this.y /= m;
      this.z /= m;
    }
    return this;
  }
  
  add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  substract(v: Vec3): Vec3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  dotProduct(v: Vec3): number {
    return Vec3.dotProduct(this, v);
  }

  crossProduct(v: Vec3): Vec3 {
    this.x = this.y * v.z - this.z * v.y;
    this.y = this.z * v.x - this.x * v.z;
    this.z = this.x * v.y - this.y * v.x;
    return this;
  }

  onVector(v: Vec3): Vec3 {
    const magnitude = this.getMagnitude();
    if (!magnitude) {
      return this.set(0, 0, 0);
    }

    return v.clone().multiplyByScalar(v.clone().dotProduct(this) / (magnitude * magnitude));
  }

  onPlane(planeNormal: Vec3): Vec3 {
    return this.substract(this.clone().onVector(planeNormal));
  }
  
  applyMat3(m: Mat): Vec3 {
    if (m.length !== 9) {
      throw new Error("Matrix must contain 9 elements");
    }

    const {x, y, z} = this;
    const [x_x, x_y, x_z, y_x, y_y, y_z, z_x, z_y, z_z] = m;

    this.x = x * x_x + y * y_x + z * z_x;
    this.y = x * x_y + y * y_y + z * z_y;
    this.z = x * x_z + y * y_z + z * z_z;

    return this;
  }

  applyMat4(m: Mat): Vec3 {
    if (m.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }

    const {x, y, z} = this;    
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
    const w = 1 / (x * x_w + y * y_w + z * z_w + w_w);

    this.x = (x * x_x + y * y_x + z * z_x + w_x) * w;
    this.y = (x * x_y + y * y_y + z * z_y + w_y) * w;
    this.z = (x * x_z + y * y_z + z * z_z + w_z) * w;

    return this;
  }
  
  lerp(v: Vec3, t: number): Vec3 {
    this.x += t * (v.x - this.x);
    this.y += t * (v.y - this.y);
    this.z += t * (v.z - this.z);
    return this;
  }
  
  equals(v: Vec3, precision = 6): boolean {
    return +this.x.toFixed(precision) === +v.x.toFixed(precision)
      && +this.y.toFixed(precision) === +v.y.toFixed(precision)
      && +this.z.toFixed(precision) === +v.z.toFixed(precision);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }  

  *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
  }
}
