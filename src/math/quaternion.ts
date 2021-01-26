import { Mat, clamp } from "./common";
import { EulerAngles } from "./euler-angles";
import { Vec3 } from "./vec3";

export class Quaternion {  
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

  static fromRotationMatrix(m: Mat): Quaternion {
    return new Quaternion().setFromRotationMatrix(m);
  }

  static fromEuler(e: EulerAngles): Quaternion {
    return new Quaternion().setFromEuler(e);
  }
  
  static fromVec3Angle(v: Vec3, theta: number): Quaternion {
    return new Quaternion().setFromVec3Angle(v, theta);
  }
  
  static fromVec3s(v1: Vec3, v2: Vec3): Quaternion {
    return new Quaternion().setFromVec3s(v1, v2);
  }

  static normalize(q: Quaternion): Quaternion {
    return q.clone().normalize();
  } 

  static invert(q: Quaternion): Quaternion {
    return q.clone().normalize().invert();
  }
  
  static dotProduct(q1: Quaternion, q2: Quaternion): number {
    return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
  }

  static getAngle(q1: Quaternion, q2: Quaternion): number {
    return q1.getAngle(q2);
  }

  static multiply(q1: Quaternion, q2: Quaternion): Quaternion {
    return q1.clone().multiply(q2);
  }

  static slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    return q1.clone().slerp(q2, t);
  }

  static equals(q1: Quaternion, q2: Quaternion, precision = 6): boolean {
    return q1.equals(q2, precision);
  }
  
  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): Quaternion {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  } 

  setFromVec3s(v1: Vec3, v2: Vec3): Quaternion {
    v1 = v1.clone().normalize();
    v2 = v2.clone().normalize();

    let w = v1.dotProduct(v2) + 1;

    if (w < 0.000001) {
      w = 0;

      if (Math.abs(v1.x) > Math.abs(v1.z)) {
        this.x = -v1.y;
        this.y = v1.x;
        this.z = 0;
      } else {        
        this.x = 0;
        this.y = -v1.z;
        this.z = v1.y;
      }

    } else {
      const {x, y, z} = v1.crossProduct(v2);
      this.x = x;
      this.y = y;
      this.z = z;
    }

    this.w = w;
    return this.normalize();
  }
  
  setFromQ(q: Quaternion): Quaternion {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  } 

  setFromRotationMatrix(m: Mat): Quaternion {
    if (m.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;  

    const trace = x_x + y_y + z_z;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(1 + trace);
      this.set(
        (y_z - z_y) * s, 
        (z_x - x_z) * s, 
        (x_y - y_x) * s, 
        0.25 / s, 
      );
    } else if (x_x > y_y && x_x > z_z) {
      const s = 2 * Math.sqrt(1 + x_x - y_y - z_z)
      this.set(
        0.25 * s, 
        (y_x + x_y) / s, 
        (z_x + x_z) / s, 
        (y_z - z_y) / s, 
      );
    } else if (y_y > z_z) {
      const s = 2 * Math.sqrt(1 + y_y - x_x - z_z)
      this.set(
        (y_x + x_y) / s,
        0.25 * s,  
        (z_y + y_z) / s, 
        (z_x - x_z) / s, 
      );
    } else {
      const s = 2 * Math.sqrt(1 + z_z - x_x - y_y)
      this.set(
        (z_x + x_z) / s, 
        (z_y + y_z) / s, 
        0.25 * s,  
        (x_y - y_x) / s, 
      );
    } 

    return this;
  }
  
  setFromEuler(e: EulerAngles): Quaternion {
    const c_x = Math.cos(e.x / 2);
    const c_y = Math.cos(e.y / 2);
    const c_z = Math.cos(e.z / 2);

    const s_x = Math.sin(e.x / 2);
    const s_y = Math.sin(e.y / 2);
    const s_z = Math.sin(e.z / 2);

    switch (e.order) {
      case "XYZ":
				this.x = s_x * c_y * c_z + c_x * s_y * s_z;
				this.y = c_x * s_y * c_z - s_x * c_y * s_z;
				this.z = c_x * c_y * s_z + s_x * s_y * c_z;
				this.w = c_x * c_y * c_z - s_x * s_y * s_z;
        break;
      case "XZY":
				this.x = s_x * c_y * c_z - c_x * s_y * s_z;
				this.y = c_x * s_y * c_z - s_x * c_y * s_z;
				this.z = c_x * c_y * s_z + s_x * s_y * c_z;
				this.w = c_x * c_y * c_z + s_x * s_y * s_z;
        break;
      case "YXZ":
				this.x = s_x * c_y * c_z + c_x * s_y * s_z;
				this.y = c_x * s_y * c_z - s_x * c_y * s_z;
				this.z = c_x * c_y * s_z - s_x * s_y * c_z;
				this.w = c_x * c_y * c_z + s_x * s_y * s_z;
        break;
      case "YZX":
				this.x = s_x * c_y * c_z + c_x * s_y * s_z;
				this.y = c_x * s_y * c_z + s_x * c_y * s_z;
				this.z = c_x * c_y * s_z - s_x * s_y * c_z;
				this.w = c_x * c_y * c_z - s_x * s_y * s_z;
        break;
      case "ZXY":
				this.x = s_x * c_y * c_z - c_x * s_y * s_z;
				this.y = c_x * s_y * c_z + s_x * c_y * s_z;
				this.z = c_x * c_y * s_z + s_x * s_y * c_z;
				this.w = c_x * c_y * c_z - s_x * s_y * s_z;
        break;
      case "ZYX":
				this.x = s_x * c_y * c_z - c_x * s_y * s_z;
				this.y = c_x * s_y * c_z + s_x * c_y * s_z;
				this.z = c_x * c_y * s_z - s_x * s_y * c_z;
				this.w = c_x * c_y * c_z + s_x * s_y * s_z;
        break;
    }

    return this;
  }

  setFromVec3Angle(v: Vec3, theta: number): Quaternion {
    const vNorm = v.clone().normalize();
    const halfTheta = theta / 2;
    const halfThetaSin = Math.sin(halfTheta);

    this.x = vNorm.x * halfThetaSin;
    this.y = vNorm.y * halfThetaSin;
    this.z = vNorm.z * halfThetaSin;
    this.w = Math.cos(halfTheta);

    return this;
  }  

  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize(): Quaternion {    
    const m = this.getMagnitude();
    if (m) {
      this.x /= m;
      this.y /= m;
      this.z /= m;
      this.w /= m;
    }
    return this;
  }

  invert(): Quaternion {
    this.normalize();
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  dotProduct(q: Quaternion): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  getAngle(q: Quaternion): number {
    return 2 * Math.acos(Math.abs(clamp(this.dotProduct(q), -1, 1)));
  }

  multiply(q: Quaternion): Quaternion {    
    const {x, y, z, w} = this;
    const {x: X, y: Y, z: Z, w: W} = q;

    this.x = x*W + w*X + y*Z - z*Y;
    this.y = y*W + w*Y + z*X - x*Z;
    this.z = z*W + w*Z + x*Y - y*X;
    this.w = w*W - x*X - y*Y - z*Z;
    return this;
  }

  slerp(q: Quaternion, t: number): Quaternion {
    t = clamp(t, 0, 1);

    if (!t) {
      return this;
    } 
    if (t === 1) {
      return this.setFromQ(q);
    }

    const {x, y, z, w} = this;
    const {x: X, y: Y, z: Z, w: W} = q;

    const halfThetaCos = x*X + y*Y + z*Z + w*W;
    if (Math.abs(halfThetaCos) >= 1) {
      return this;
    }
    
    const halfTheta = Math.acos(halfThetaCos);
    const halfThetaSin = Math.sin(halfTheta);

    if (Math.abs(halfThetaSin) < 0.000001) {
      this.x = 0.5 * (x + X);
      this.y = 0.5 * (y + Y);
      this.z = 0.5 * (z + Z);
      this.w = 0.5 * (w + W);
      return this;
    }

    const a = Math.sin((1 - t) * halfTheta) / halfThetaSin;
    const b = Math.sin(t * halfTheta) / halfThetaSin;
    this.x = a * x + b * X;
    this.y = a * y + b * Y;
    this.z = a * z + b * Z;
    this.w = a * w + b * W;
    return this;
  }
  
  equals(q: Quaternion, precision = 6): boolean {
    return +this.x.toFixed(precision) === +q.x.toFixed(precision)
      && +this.y.toFixed(precision) === +q.y.toFixed(precision)
      && +this.z.toFixed(precision) === +q.z.toFixed(precision)
      && +this.w.toFixed(precision) === +q.w.toFixed(precision);
  }
}