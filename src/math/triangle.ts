import { Vec2 } from "./vec2";
import { Vec3 } from "./vec3";

export class Triangle {
  a: Vec3;
  b: Vec3;
  c: Vec3;

  constructor (a: Vec3, b: Vec3, c: Vec3) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  static fromTriangle(t: Triangle): Triangle {
    return new Triangle(t.a, t.b, t.c);
  }

  static equals(t1: Triangle, t2: Triangle, precision = 6) {
    return t1.equals(t2, precision);
  }

  clone(): Triangle {
    return new Triangle(this.a, this.b, this.c);
  }

  set(a: Vec3, b: Vec3, c: Vec3) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  setFromTriangle(t: Triangle): Triangle {
    this.a = t.a.clone();
    this.b = t.b.clone();
    this.c = t.c.clone();
    return this;
  }

  getArea(): number {    
    const u = this.b.clone().substract(this.a);
    const v = this.c.clone().substract(this.a);

    return u.crossProduct(v).getMagnitude() / 2;
  }

  getCenter(): Vec3 {    
    return this.a.clone().add(this.b).add(this.c).multiplyByScalar(1/3);
  }

  getNormal(): Vec3 {
    const u = this.b.clone().substract(this.a);
    const v = this.c.clone().substract(this.a);

    return u.crossProduct(v).normalize();
  }

  getBary(v: Vec3): Vec3 {
    const ac = this.c.clone().substract(this.a);
    const ab = this.b.clone().substract(this.a);
    const av = v.clone().substract(this.a);

    const acSqr = ac.dotProduct(ac);
    const acab = ac.dotProduct(ab);
    const acav = ac.dotProduct(av);
    const abSqr = ab.dotProduct(ab);
    const abav = ab.dotProduct(av);

    const d = acSqr * abSqr - acab * acab;
    if (!d) {
      // triangle is collinear or singular
      return null;
    }    

    const baryB = (acSqr * abav - acab * acav) / d;
    const baryC = (abSqr * acav - acab * abav) / d;
    const baryA = 1 - baryB - baryC;
    return new Vec3(baryA, baryB, baryC);
  }

  getUV(v: Vec3, uvA: Vec2, uvB: Vec2, uvC: Vec2): Vec2 {
    const bary = this.getBary(v);
    return new Vec2()
      .add(uvA.clone().multiplyByScalar(bary.x))
      .add(uvB.clone().multiplyByScalar(bary.y))
      .add(uvC.clone().multiplyByScalar(bary.z));
  }

  valid(v: Vec3): boolean {
    const bary = this.getBary(v);
    return !!bary;
  }

  contains(v: Vec3): boolean {
    const bary = this.getBary(v);
    return bary.x >= 0 
      && bary.y >= 0 
      && (bary.x + bary.y) <= 1;
  }
  
  equals(t: Triangle, precision = 6): boolean {
    if (this.a.equals(t.a, precision)
      && this.b.equals(t.b, precision)
      && this.c.equals(t.c, precision)) {
      return true;
    }
    return false;
  }
}
