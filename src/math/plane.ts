import { Mat } from "./common";
import { Vec3 } from "./vec3";

export class Plane {
  normal: Vec3;
  d: number;

  get point(): Vec3 {
    return this.normal.clone().multiplyByScalar(-this.d);
  }

  constructor(normal: Vec3 = new Vec3(0,0,1), d = 0) {
    if (!normal.getMagnitude()) {
      throw new Error("Normal length is zero. Cannot define direction");
    }

    this.normal = normal.clone().normalize();
    this.d = d;   
  }  

  static equals(p1: Plane, p2: Plane, precision = 6): boolean {
    return p1.equals(p2, precision);
  }

  static fromNormalAndPoint(normal: Vec3, pointOnPlane: Vec3): Plane {
    return new Plane().setFromNormalAndPoint(normal, pointOnPlane);
  }
  
  static fromVec3s(a: Vec3, b: Vec3, c: Vec3): Plane {
    return new Plane().setFromPoints(a, b, c);
  }
  
  static applyMat4(p: Plane, m: Mat): Plane {
    return p.clone().applyMat4(m);
  }

  static multiplyByScalar(p: Plane, s: number): Plane {
    return p.clone().multiplyByScalar(s);
  }
  
  static translate(p: Plane, v: Vec3): Plane {
    return p.clone().translate(v);
  }

  static projectPoint(p: Plane, v: Vec3): Vec3 {
    return p.projectPoint(v);
  }

  clone(): Plane {
    return new Plane(this.normal, this.d);
  }

  set(normal: Vec3, d: number): Plane {
    if (!normal.getMagnitude()) {
      throw new Error("Normal length is zero. Cannot define direction");
    }

    this.normal = normal.clone().normalize();
    this.d = d;   
    return this;
  }

  setFromNormalAndPoint(normal: Vec3, pointOnPlane: Vec3): Plane { 
    if (!normal.getMagnitude()) {
      throw new Error("Normal length is zero. Cannot define direction");
    }

    this.normal.setFromVec3(normal).normalize();
    this.d = -pointOnPlane.dotProduct(normal);
    return this;
  }

  setFromPoints(a: Vec3, b: Vec3, c: Vec3): Plane {
    const normal = Vec3.substract(b, a).crossProduct(Vec3.substract(c, a));    
    if (!normal.getMagnitude()) {      
      throw new Error("Normal length is zero. Points are equal or collinear");
    }

    this.setFromNormalAndPoint(normal, a);
    return this;
  }
  
  applyMat4(m: Mat): Plane {
    const normalMat = m.clone().invert().transpose();
    const transformedPoint = this.point.applyMat4(m);

    this.normal.applyMat4(normalMat).normalize();
    this.d = -transformedPoint.dotProduct(this.normal);
    return this;
  }

  normalize(): Plane {
    const inversedNormalMagnitude = 1 / this.normal.getMagnitude();
    return this.multiplyByScalar(inversedNormalMagnitude);
  }

  multiplyByScalar(s: number): Plane {
    this.normal.multiplyByScalar(s);
    this.d *= s;
    return this;
  }

  translate(v: Vec3): Plane {
    this.d -= v.dotProduct(this.normal);
    return this;
  }

  equals(p: Plane, precision = 6): boolean {
    return this.normal.equals(p.normal, precision)
      && +this.d.toFixed(precision) === +p.d.toFixed(precision);
  }

  getDistanceToPoint(v: Vec3): number {
    return this.normal.dotProduct(v) + this.d;
  }

  projectPoint(v: Vec3): Vec3 {
    return Vec3.multiplyByScalar(this.normal, -this.getDistanceToPoint(v)).add(v);
  }
}