import { Mat, getDistance3D } from "./common";
import { Vec3 } from "./vec3";

export class Segment {
  a: Vec3;
  b: Vec3;

  constructor(a: Vec3, b: Vec3) {
    this.a = a.clone();
    this.b = b.clone();
  }

  static fromLine(s: Segment) {
    return new Segment(s.a, s.b);
  }

  static applyMat4(s: Segment, m: Mat): Segment {
    return new Segment(
      Vec3.applyMat4(s.a, m),
      Vec3.applyMat4(s.b, m),
    );
  }

  static equals(s1: Segment, s2: Segment): boolean {
    return s1.equals(s2);
  }

  clone(): Segment {
    return new Segment(this.a, this.b);
  }

  set(a: Vec3, b: Vec3): Segment {
    this.a = a.clone();
    this.b = b.clone();
    return this;
  }

  setFromLine(s: Segment): Segment {
    this.a = s.a.clone();
    this.b = s.b.clone();
    return this;
  }

  getCenter(): Vec3 {
    return Vec3.add(this.a, this.b).multiplyByScalar(0.5);
  }

  getDelta(): Vec3 {
    return Vec3.substract(this.b, this.a);
  }

  getLength(): number {
    return getDistance3D(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z);
  }
  
  applyMat4(m: Mat): Segment {
    this.a.applyMat4(m);
    this.b.applyMat4(m);
    return this;
  }
  
  equals(s: Segment, precision = 6): boolean {
    if (this.a.equals(s.a, precision)
      && this.b.equals(s.b, precision)) {
      return true;
    }
    return false;
  }
}
