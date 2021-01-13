function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

function degToRad(deg: number) {
  return deg * Math.PI / 180;
}

function getDistance2D(x1: number, y1: number, x2: number, y2: number): number {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

function getDistance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  const x = x2 - x1;
  const y = y2 - y1;
  const z = z2 - z1;
  return Math.sqrt(x * x + y * y + z * z);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

interface IMat {
  matrix: number[];
}

type EulerRotationOrder = "XYZ" | "ZYX" | "YZX" | "XZY" | "ZXY" | "YXZ";

class EulerAngles {  
  x: number;
  y: number;
  z: number;
  order: EulerRotationOrder;

  constructor(x = 0, y = 0, z = 0, order: EulerRotationOrder = "XYZ") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  static fromRotationMatrix(m: IMat, order: EulerRotationOrder): EulerAngles {
    return new EulerAngles().setFromRotationMatrix(m, order);
  }

  static equals(ea1: EulerAngles, ea2: EulerAngles): boolean {
    return ea1.equals(ea2);
  }
  
  copy(q: EulerAngles): EulerAngles {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.order = q.order;
    return this;
  }

  set(x: number, y: number, z: number, order: EulerRotationOrder = "XYZ"): EulerAngles {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  } 
  
  equals(ea: EulerAngles): boolean {
    return this.x === ea.x
      && this.y === ea.y
      && this.z === ea.z
      && this.order === ea.order;
  }

  setFromRotationMatrix(m: IMat, order: EulerRotationOrder): EulerAngles {
    if (m.matrix.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m.matrix;  

    switch (order) {
      case "XYZ":
				this.y = Math.asin(clamp(z_x, -1, 1));
				if (Math.abs(z_x) < 0.999999) {
					this.x = Math.atan2(-z_y, z_z);
					this.z = Math.atan2(-y_x, x_x);
				} else {
					this.x = Math.atan2(y_z, y_y);
					this.z = 0;
				}
        break;
      case "XZY":
				this.z = Math.asin(-clamp(y_x, -1, 1));
				if (Math.abs(y_x) < 0.999999) {
					this.x = Math.atan2(y_z, y_y);
					this.y = Math.atan2(z_x, x_x);
				} else {
					this.x = Math.atan2(-z_y, z_z);
					this.y = 0;
				}
        break;
      case "YXZ":
				this.x = Math.asin(-clamp(z_y, -1, 1));
				if (Math.abs(z_y) < 0.999999) {
					this.y = Math.atan2(z_x, z_z);
					this.z = Math.atan2(x_y, y_y);
				} else {
					this.y = Math.atan2(-x_z, x_x);
					this.z = 0;
				}
        break;
      case "YZX":
				this.z = Math.asin(clamp(x_y, -1, 1));
				if (Math.abs(x_y) < 0.999999) {
					this.x = Math.atan2(-z_y, y_y);
					this.y = Math.atan2(-x_z, x_x);
				} else {
					this.x = 0;
					this.y = Math.atan2(z_x, z_z);
				}
        break;
      case "ZXY":
				this.x = Math.asin(clamp(y_z, -1, 1));
				if (Math.abs(y_z) < 0.999999) {
					this.y = Math.atan2(-x_z, z_z);
					this.z = Math.atan2(-y_x, y_y);
				} else {
					this.y = 0;
					this.z = Math.atan2(x_y, x_x);
				}
        break;
      case "ZYX":
				this.y = Math.asin(-clamp(x_z, -1, 1));
				if (Math.abs(x_z) < 0.999999) {
					this.x = Math.atan2(y_z, z_z);
					this.z = Math.atan2(x_y, x_x);
				} else {
					this.x = 0;
					this.z = Math.atan2(-y_x, y_y);
				}
        break;
    }
    this.order = order;

    return this;
  }
}

class Vec2 {
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

  static applyMat3(v: Vec2, m: IMat): Vec2 {
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

  applyMat3(m: IMat): Vec2 {
    if (m.matrix.length !== 9) {
      throw new Error("Matrix must contain 9 elements");
    }

    const {x, y} = this;
    const [x_x, x_y,, y_x, y_y,, z_x, z_y,] = m.matrix;

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
    return this.x.toFixed(precision) === v.x.toFixed(precision)
      && this.y.toFixed(precision) === v.y.toFixed(precision);
  }
}

class Vec3 {
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

  static applyMat3(v: Vec3, m: IMat): Vec3 {
    return v.clone().applyMat3(m);
  }

  static applyMat4(v: Vec3, m: IMat): Vec3 {
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
  
  applyMat3(m: IMat): Vec3 {
    if (m.matrix.length !== 9) {
      throw new Error("Matrix must contain 9 elements");
    }

    const {x, y, z} = this;
    const [x_x, x_y, x_z, y_x, y_y, y_z, z_x, z_y, z_z] = m.matrix;

    this.x = x * x_x + y * y_x + z * z_x;
    this.y = x * x_y + y * y_y + z * z_y;
    this.z = x * x_z + y * y_z + z * z_z;

    return this;
  }

  applyMat4(m: IMat): Vec3 {
    if (m.matrix.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }

    const {x, y, z} = this;    
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m.matrix;
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
    return this.x.toFixed(precision) === v.x.toFixed(precision)
      && this.y.toFixed(precision) === v.y.toFixed(precision)
      && this.z.toFixed(precision) === v.z.toFixed(precision);
  }
}

class Vec4 {
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

  static applyMat4(v: Vec4, m: IMat): Vec4 {
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
  
  applyMat4(m: IMat): Vec4 {
    if (m.matrix.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    
    const {x, y, z, w} = this; 
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m.matrix;  

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
    return this.x.toFixed(precision) === v.x.toFixed(precision)
      && this.y.toFixed(precision) === v.y.toFixed(precision)
      && this.z.toFixed(precision) === v.z.toFixed(precision)
      && this.w.toFixed(precision) === v.w.toFixed(precision);
  }
}

class Quaternion {  
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

  static fromRotationMatrix(m: IMat): Quaternion {
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

  setFromRotationMatrix(m: IMat): Quaternion {
    if (m.matrix.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m.matrix;  

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
    return this.x.toFixed(precision) === q.x.toFixed(precision)
      && this.y.toFixed(precision) === q.y.toFixed(precision)
      && this.z.toFixed(precision) === q.z.toFixed(precision)
      && this.w.toFixed(precision) === q.w.toFixed(precision);
  }
}

class Mat3 implements IMat {
  matrix: number[] = new Array(9);
  
  //#region components
  get x_x(): number {
    return this.matrix[0];
  }
  get x_y(): number {
    return this.matrix[1];
  }
  get x_z(): number {
    return this.matrix[2];
  }
  get y_x(): number {
    return this.matrix[4];
  }
  get y_y(): number {
    return this.matrix[5];
  }
  get y_z(): number {
    return this.matrix[6];
  }
  get z_x(): number {
    return this.matrix[8];
  }
  get z_y(): number {
    return this.matrix[9];
  }
  get z_z(): number {
    return this.matrix[10];
  }
  //#endregion

  constructor() {
    this.matrix[0] = 1;
    this.matrix[1] = 0;
    this.matrix[2] = 0;

    this.matrix[3] = 0;
    this.matrix[4] = 1;
    this.matrix[5] = 0;

    this.matrix[6] = 0;
    this.matrix[7] = 0;
    this.matrix[8] = 1;
  }

  static fromMat3(m: Mat3): Mat3 {
    return new Mat3().setFromMat3(m);
  }

  static multiply(m1: Mat3, m2: Mat3): Mat3 {    
    const m = new Mat3();
    m.set(
      m1.x_x * m2.x_x + m1.x_y * m2.y_x + m1.x_z * m2.z_x,
      m1.x_x * m2.x_y + m1.x_y * m2.y_y + m1.x_z * m2.z_y,
      m1.x_x * m2.x_z + m1.x_y * m2.y_z + m1.x_z * m2.z_z,
      m1.y_x * m2.x_x + m1.y_y * m2.y_x + m1.y_z * m2.z_x,
      m1.y_x * m2.x_y + m1.y_y * m2.y_y + m1.y_z * m2.z_y,
      m1.y_x * m2.x_z + m1.y_y * m2.y_z + m1.y_z * m2.z_z,
      m1.z_x * m2.x_x + m1.z_y * m2.y_x + m1.z_z * m2.z_x,
      m1.z_x * m2.x_y + m1.z_y * m2.y_y + m1.z_z * m2.z_y,
      m1.z_x * m2.x_z + m1.z_y * m2.y_z + m1.z_z * m2.z_z
    );
    return m;
  }

  static multiplyScalar(m: Mat3, s: number): Mat3 {
    const res = new Mat3();
    for (let i = 0; i < 9; i++) {
      res.matrix[i] = m.matrix[i] * s;
    }
    return res;
  }

  static transpose(m: Mat3): Mat3 {
    const res = new Mat3();
    res.set(
      m.x_x, m.y_x, m.z_x,
      m.x_y, m.y_y, m.z_y,
      m.x_z, m.y_z, m.z_z
    )
    return res;
  }
  
  static inverse(m: Mat3): Mat3 {
    const mTemp = new Mat3();
    // calculate minors matrix
    mTemp.set(
      m.y_y * m.z_z - m.z_y * m.y_z,
      m.y_x * m.z_z - m.z_x * m.y_z,
      m.y_x * m.z_y - m.z_x * m.y_y,

      m.x_y * m.z_z - m.z_y * m.x_z,
      m.x_x * m.z_z - m.z_x * m.x_z,
      m.x_x * m.z_y - m.z_x * m.x_y,

      m.x_y * m.y_z - m.y_y * m.x_z,
      m.x_x * m.y_z - m.y_x * m.x_z,
      m.x_x * m.y_y - m.y_x * m.x_y
    );
    // calculate cofactor matrix
    mTemp.set(
      mTemp.x_x, -mTemp.x_y, mTemp.x_z,
      -mTemp.y_x, mTemp.y_y, -mTemp.y_z,
      mTemp.z_x, -mTemp.z_y, mTemp.z_z
    );
    // calculate determinant
    const det = m.x_x * mTemp.x_x + m.x_y * mTemp.x_y + m.x_z * mTemp.x_z;
    const inversed = new Mat3()
    if (!det) {
      inversed.set(0,0,0,0,0,0,0,0,0);
    } else {
      // calculate adjugate multiplied by inversed determinant
      const detInv = 1/10;
      inversed.set(
        detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x,
        detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y,
        detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z
      );
    }

    return inversed;
  }

  static buildScale(x: number, y: number = undefined): Mat3 {
    y ??= x;
    return new Mat3().set(
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    );
  } 

  static buildRotation(theta: number): Mat3 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat3().set(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
  }
  
  static buildTranslate(x: number, y: number): Mat3 {
    return new Mat3().set(
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    );
  }

  static equals(m1: Mat3, m2: Mat3, precision = 6): boolean {
    return m1.equals(m2, precision);
  }

  clone(): Mat3 {
    return new Mat3().set(
      this.x_x, this.x_y, this.x_z,
      this.y_x, this.y_y, this.y_z,
      this.z_x, this.z_y, this.z_z
    );
  }
  
  set(...elements: number[]): Mat3;
  set(x_x: number, x_y: number, x_z: number,
    y_x: number, y_y: number, y_z: number,
    z_x: number, z_y: number, z_z: number): Mat3 {
    this.matrix[0] = x_x;
    this.matrix[1] = x_y;
    this.matrix[2] = x_z;
    this.matrix[3] = y_x;
    this.matrix[4] = y_y;
    this.matrix[5] = y_z;
    this.matrix[6] = z_x;
    this.matrix[7] = z_y;
    this.matrix[8] = z_z;
    return this;
  }

  setFromMat3(m: Mat3): Mat3 {
    for (let i = 0; i < 9; i++) {
      this.matrix[i] = m.matrix[i];
    }
    return this;
  }  

  multiply(m: Mat3): Mat3 {
    this.matrix[0] = this.x_x * m.x_x + this.x_y * m.y_x + this.x_z * m.z_x;
    this.matrix[1] = this.x_x * m.x_y + this.x_y * m.y_y + this.x_z * m.z_y;
    this.matrix[2] = this.x_x * m.x_z + this.x_y * m.y_z + this.x_z * m.z_z;
    this.matrix[4] = this.y_x * m.x_x + this.y_y * m.y_x + this.y_z * m.z_x;
    this.matrix[5] = this.y_x * m.x_y + this.y_y * m.y_y + this.y_z * m.z_y;
    this.matrix[6] = this.y_x * m.x_z + this.y_y * m.y_z + this.y_z * m.z_z;
    this.matrix[7] = this.z_x * m.x_x + this.z_y * m.y_x + this.z_z * m.z_x;
    this.matrix[8] = this.z_x * m.x_y + this.z_y * m.y_y + this.z_z * m.z_y;

    return this;
  }

  multiplyScalar(s: number): Mat3 {
    for (let i = 0; i < 9; i++) {
      this.matrix[i] *= s;
    }
    return this;
  }

  transpose(): Mat3 {
    const temp = new Mat3().setFromMat3(this);
    this.set(
      temp.x_x, temp.y_x, temp.z_x,
      temp.x_y, temp.y_y, temp.z_y,
      temp.x_z, temp.y_z, temp.z_z
    )
    return this;
  }

  inverse(): Mat3 {
    const mTemp = new Mat3();
    // calculate minors matrix
    mTemp.set(
      this.y_y * this.z_z - this.z_y * this.y_z,
      this.y_x * this.z_z - this.z_x * this.y_z,
      this.y_x * this.z_y - this.z_x * this.y_y,

      this.x_y * this.z_z - this.z_y * this.x_z,
      this.x_x * this.z_z - this.z_x * this.x_z,
      this.x_x * this.z_y - this.z_x * this.x_y,

      this.x_y * this.y_z - this.y_y * this.x_z,
      this.x_x * this.y_z - this.y_x * this.x_z,
      this.x_x * this.y_y - this.y_x * this.x_y
    );
    // calculate cofactor matrix
    mTemp.set(
      mTemp.x_x, -mTemp.x_y, mTemp.x_z,
      -mTemp.y_x, mTemp.y_y, -mTemp.y_z,
      mTemp.z_x, -mTemp.z_y, mTemp.z_z
    );
    // calculate determinant
    const det = this.x_x * mTemp.x_x + this.x_y * mTemp.x_y + this.x_z * mTemp.x_z;
    if (!det) {
      this.set(0,0,0,0,0,0,0,0,0);
    } else {
      // calculate adjugate multiplied by inversed determinant
      const detInv = 1/10;
      this.set(
        detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x,
        detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y,
        detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z
      );
    }

    return this;
  }

  getDeterminant(): number {
    const [a,b,c,d,e,f,g,h,i] = this.matrix;
    return a*e*i-a*f*h + b*f*g-b*d*i + c*d*h-c*e*g;
  }

  equals(m: Mat3, precision = 6): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.matrix[i].toFixed(precision) !== m.matrix[i].toFixed(precision)) {
        return false;
      }
    }
    return true;
  }

  applyScaling(x: number, y: number = undefined): Mat3 {
    const m = Mat3.buildScale(x, y);
    return this.multiply(m);
  }

  applyTranslation(x: number, y: number): Mat3 {
    const m = Mat3.buildTranslate(x, y);
    return this.multiply(m);
  }

  applyRotation(theta: number): Mat3 {
    const m = Mat3.buildRotation(theta);
    return this.multiply(m);
  }
}

class Mat4 implements IMat {
  matrix: number[] = new Array(16);

  //#region components
  get x_x(): number {
    return this.matrix[0];
  }
  get x_y(): number {
    return this.matrix[1];
  }
  get x_z(): number {
    return this.matrix[2];
  }
  get x_w(): number {
    return this.matrix[3];
  }
  get y_x(): number {
    return this.matrix[4];
  }
  get y_y(): number {
    return this.matrix[5];
  }
  get y_z(): number {
    return this.matrix[6];
  }
  get y_w(): number {
    return this.matrix[7];
  }
  get z_x(): number {
    return this.matrix[8];
  }
  get z_y(): number {
    return this.matrix[9];
  }
  get z_z(): number {
    return this.matrix[10];
  }
  get z_w(): number {
    return this.matrix[11];
  }
  get w_x(): number {
    return this.matrix[12];
  }
  get w_y(): number {
    return this.matrix[13];
  }
  get w_z(): number {
    return this.matrix[14];
  }
  get w_w(): number {
    return this.matrix[15];
  }
  //#endregion

  constructor() {
    this.matrix[0] = 1;
    this.matrix[1] = 0;
    this.matrix[2] = 0;    
    this.matrix[3] = 0;

    this.matrix[4] = 0;
    this.matrix[5] = 1;
    this.matrix[6] = 0;
    this.matrix[7] = 0;

    this.matrix[8] = 0;
    this.matrix[9] = 0;
    this.matrix[10] = 1;
    this.matrix[11] = 0;

    this.matrix[12] = 0;
    this.matrix[13] = 0;
    this.matrix[14] = 0;
    this.matrix[15] = 1;
    
  }

  static fromMat4(m: Mat4): Mat4 {
    return new Mat4().setFromMat4(m);
  }

  static fromTRS(t: Vec3, r: Quaternion, s: Vec3): Mat4 {
    return new Mat4().setFromTRS(t, r, s);
  }

  static fromQuaternion(q: Quaternion): Mat4 {
    return new Mat4().setFromQuaternion(q);
  } 

  static multiply(m1: Mat4, m2: Mat4): Mat4 {    
    const m = new Mat4();
    m.set(
      m1.x_x * m2.x_x + m1.x_y * m2.y_x + m1.x_z * m2.z_x + m1.x_w * m2.w_x,
      m1.x_x * m2.x_y + m1.x_y * m2.y_y + m1.x_z * m2.z_y + m1.x_w * m2.w_y,
      m1.x_x * m2.x_z + m1.x_y * m2.y_z + m1.x_z * m2.z_z + m1.x_w * m2.w_z,
      m1.x_x * m2.x_w + m1.x_y * m2.y_w + m1.x_z * m2.z_w + m1.x_w * m2.w_w,
      m1.y_x * m2.x_x + m1.y_y * m2.y_x + m1.y_z * m2.z_x + m1.y_w * m2.w_x,
      m1.y_x * m2.x_y + m1.y_y * m2.y_y + m1.y_z * m2.z_y + m1.y_w * m2.w_y,
      m1.y_x * m2.x_z + m1.y_y * m2.y_z + m1.y_z * m2.z_z + m1.y_w * m2.w_z,
      m1.y_x * m2.x_w + m1.y_y * m2.y_w + m1.y_z * m2.z_w + m1.y_w * m2.w_w,
      m1.z_x * m2.x_x + m1.z_y * m2.y_x + m1.z_z * m2.z_x + m1.z_w * m2.w_x,
      m1.z_x * m2.x_y + m1.z_y * m2.y_y + m1.z_z * m2.z_y + m1.z_w * m2.w_y,
      m1.z_x * m2.x_z + m1.z_y * m2.y_z + m1.z_z * m2.z_z + m1.z_w * m2.w_z,
      m1.z_x * m2.x_w + m1.z_y * m2.y_w + m1.z_z * m2.z_w + m1.z_w * m2.w_w,
      m1.w_x * m2.x_x + m1.w_y * m2.y_x + m1.w_z * m2.z_x + m1.w_w * m2.w_x,
      m1.w_x * m2.x_y + m1.w_y * m2.y_y + m1.w_z * m2.z_y + m1.w_w * m2.w_y,
      m1.w_x * m2.x_z + m1.w_y * m2.y_z + m1.w_z * m2.z_z + m1.w_w * m2.w_z,
      m1.w_x * m2.x_w + m1.w_y * m2.y_w + m1.w_z * m2.z_w + m1.w_w * m2.w_w
    );
    return m;
  }

  static multiplyScalar(m: Mat4, s: number): Mat4 {
    const res = new Mat4();
    for (let i = 0; i < 16; i++) {
      res.matrix[i] = m.matrix[i] * s;
    }
    return res;
  }

  static transpose(m: Mat4): Mat4 {
    const res = new Mat4();
    res.set(
      m.x_x, m.y_x, m.z_x, m.w_x,
      m.x_y, m.y_y, m.z_y, m.w_y,
      m.x_z, m.y_z, m.z_z, m.w_z,
      m.x_w, m.y_w, m.z_w, m.w_w,
    )
    return res;
  }

  static inverse(m: Mat4): Mat4 {
    const s = 1/m.getDeterminant();
    const [x_x,x_y,x_z,x_w,y_x,y_y,y_z,y_w,z_x,z_y,z_z,z_w,w_x,w_y,w_z,w_w] = m.matrix;
    const res = new Mat4().set(
      (y_z*z_w*w_y - y_w*z_z*w_y + y_w*z_y*w_z - y_y*z_w*w_z - y_z*z_y*w_w + y_y*z_z*w_w) * s,
      (x_w*z_z*w_y - x_z*z_w*w_y - x_w*z_y*w_z + x_y*z_w*w_z + x_z*z_y*w_w - x_y*z_z*w_w) * s,
      (x_z*y_w*w_y - x_w*y_z*w_y + x_w*y_y*w_z - x_y*y_w*w_z - x_z*y_y*w_w + x_y*y_z*w_w) * s,
      (x_w*y_z*z_y - x_z*y_w*z_y - x_w*y_y*z_z + x_y*y_w*z_z + x_z*y_y*z_w - x_y*y_z*z_w) * s,
      (y_w*z_z*w_x - y_z*z_w*w_x - y_w*z_x*w_z + y_x*z_w*w_z + y_z*z_x*w_w - y_x*z_z*w_w) * s,
      (x_z*z_w*w_x - x_w*z_z*w_x + x_w*z_x*w_z - x_x*z_w*w_z - x_z*z_x*w_w + x_x*z_z*w_w) * s,
      (x_w*y_z*w_x - x_z*y_w*w_x - x_w*y_x*w_z + x_x*y_w*w_z + x_z*y_x*w_w - x_x*y_z*w_w) * s,
      (x_z*y_w*z_x - x_w*y_z*z_x + x_w*y_x*z_z - x_x*y_w*z_z - x_z*y_x*z_w + x_x*y_z*z_w) * s,
      (y_y*z_w*w_x - y_w*z_y*w_x + y_w*z_x*w_y - y_x*z_w*w_y - y_y*z_x*w_w + y_x*z_y*w_w) * s,
      (x_w*z_y*w_x - x_y*z_w*w_x - x_w*z_x*w_y + x_x*z_w*w_y + x_y*z_x*w_w - x_x*z_y*w_w) * s,
      (x_y*y_w*w_x - x_w*y_y*w_x + x_w*y_x*w_y - x_x*y_w*w_y - x_y*y_x*w_w + x_x*y_y*w_w) * s,
      (x_w*y_y*z_x - x_y*y_w*z_x - x_w*y_x*z_y + x_x*y_w*z_y + x_y*y_x*z_w - x_x*y_y*z_w) * s,
      (y_z*z_y*w_x - y_y*z_z*w_x - y_z*z_x*w_y + y_x*z_z*w_y + y_y*z_x*w_z - y_x*z_y*w_z) * s,
      (x_y*z_z*w_x - x_z*z_y*w_x + x_z*z_x*w_y - x_x*z_z*w_y - x_y*z_x*w_z + x_x*z_y*w_z) * s,
      (x_z*y_y*w_x - x_y*y_z*w_x - x_z*y_x*w_y + x_x*y_z*w_y + x_y*y_x*w_z - x_x*y_y*w_z) * s,
      (x_y*y_z*z_x - x_z*y_y*z_x + x_z*y_x*z_y - x_x*y_z*z_y - x_y*y_x*z_z + x_x*y_y*z_z) * s
    );
    return res;
  }

  static lookAt(source: Vec3, target: Vec3, up: Vec3): Mat4 {
    // check if source and target are same positions
    const vZ = Vec3.equals(source, target)
      ? new Vec3(0, 0, 1)
      : Vec3.substract(source, target).normalize();

    let vX = Vec3.crossProduct(up, vZ).normalize();
    // check if vZ and up are parallel
    if (!vX.getMagnitude()) {
      if (Math.abs(up.z) === 1) {
        vZ.x += 0.00001
      } else {
        vZ.z += 0.00001
      }
      vZ.normalize();
      vX = Vec3.crossProduct(up, vZ).normalize();
    }

    const vY = Vec3.crossProduct(vZ, vX).normalize();

    return new Mat4().set(
      vX.x, vX.y, vX.z, 0,
      vY.x, vY.y, vY.z, 0,
      vZ.x, vZ.y, vZ.z, 0,
      source.x, source.y, source.z, 1
    );
  }

  static buildScale(x: number, y: number = undefined, z: number = undefined): Mat4 {
    y ??= x;
    z ??= x;
    return new Mat4().set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    );
  } 

  static buildRotationX(theta: number): Mat4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat4().set(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );
  }

  static buildRotationY(theta: number): Mat4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat4().set(
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  static buildRotationZ(theta: number): Mat4 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat4().set(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }
  
  static buildTranslate(x: number, y: number, z: number): Mat4 {
    return new Mat4().set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    );
  }

  static buildOrthographic(near: number, far: number,
    left: number, right: number, 
    bottom: number, top: number,): Mat4 {
    return new Mat4().set(
      2 / (right - left),               0,                                0,                            0,
      0,                                2 / (top - bottom),               0,                            0,
      0,                                0,                                2 / (near - far),             0,
      (left + right) / (left - right),  (bottom + top) / (bottom - top),  (near + far) / (near - far),  1
    );
  }

  static buildPerspective(near: number, far: number,
    fov: number, aspectRatio: number): Mat4;
  static buildPerspective(near: number, far: number,
    left: number, right: number, 
    bottom: number, top: number): Mat4;
  static buildPerspective(near: number, far: number,
    ...args: number[]): Mat4 {
    if (args.length === 4) {
      const [left, right, bottom, top] = args;
      return new Mat4().set(
        2 * near / (right - left),        0,                              0,                              0,
        0,                                2 * near / (top - bottom),      0,                              0,
        (right + left) / (right - left), (top + bottom) / (top - bottom), (near + far) / (near - far),   -1,
        0,                                0,                              2 * near * far / (near - far),  0
      );
    } else if (args.length === 2) {      
      const [fov, aspectRatio] = args;
      const f = Math.tan(0.5 * Math.PI - 0.5 * fov);   
      return new Mat4().set(
        f / aspectRatio,  0,  0,                              0,
        0,                f,  0,                              0,
        0,                0,  (near + far) / (near - far),   -1,
        0,                0,  2 * near * far / (near - far),  0
      );
    } else {
      throw new Error("Incorrect args quantity");
    }
  }

  static equals(m1: Mat4, m2: Mat4, precision = 6): boolean {
    return m1.equals(m2, precision);
  }

  clone(): Mat4 {
    return new Mat4().set(
      this.x_x, this.x_y, this.x_z, this.x_w,
      this.y_x, this.y_y, this.y_z, this.y_w,
      this.z_x, this.z_y, this.z_z, this.z_w,
      this.w_x, this.w_y, this.w_z, this.w_w
    );
  }

  set(...elements: number[]): Mat4;
  set(x_x: number, x_y: number, x_z: number, x_w: number,
    y_x: number, y_y: number, y_z: number, y_w:number,
    z_x: number, z_y: number, z_z: number, z_w:number,
    w_x: number, w_y: number, w_z: number, w_w:number): Mat4 {
    this.matrix[0] = x_x;
    this.matrix[1] = x_y;
    this.matrix[2] = x_z;
    this.matrix[3] = x_w;
    this.matrix[4] = y_x;
    this.matrix[5] = y_y;
    this.matrix[6] = y_z;
    this.matrix[7] = y_w;
    this.matrix[8] = z_x;
    this.matrix[9] = z_y;
    this.matrix[10] = z_z;
    this.matrix[11] = z_w;
    this.matrix[12] = w_x;
    this.matrix[13] = w_y;
    this.matrix[14] = w_z;
    this.matrix[15] = w_w;
    return this;
  }

  setFromMat4(m: Mat4): Mat4 {
    for (let i = 0; i < 16; i++) {
      this.matrix[i] = m.matrix[i];
    }
    return this;
  } 

  setFromTRS(t: Vec3, r: Quaternion, s: Vec3): Mat4 {
    const x_x = 2 * r.x * r.x;
    const x_y = 2 * r.y * r.x;
    const x_z = 2 * r.z * r.x;

    const y_y = 2 * r.y * r.y;
    const y_z = 2 * r.z * r.y;
    const z_z = 2 * r.z * r.z;   

    const w_x = 2 * r.x * r.w;
    const w_y = 2 * r.y * r.w;
    const w_z = 2 * r.z * r.w;

    this.set(
      (1 - y_y - z_z) * s.x, (x_y + w_z) * s.x, (x_z - w_y) * s.x, 0,
      (x_y - w_z) * s.y, (1 - x_x - z_z) * s.y, (y_z + w_x) * s.y, 0,
      (x_z + w_y) * s.z, (y_z - w_x) * s.z, (1 - x_x - y_y) * s.z, 0,
      t.x, t.y, t.z, 1
    );

    return this;
  }

  setFromQuaternion(q: Quaternion): Mat4 {
    return this.setFromTRS(new Vec3(0, 0, 0), q, new Vec3(1, 1, 1));
  }

  multiply(mat: Mat4): Mat4 {  
    const [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p] = this.matrix; 
    const [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P] = mat.matrix;  
    
    this.matrix[0] = a * A + b * E + c * I + d * M;
    this.matrix[1] = a * B + b * F + c * J + d * N;
    this.matrix[2] = a * C + b * G + c * K + d * O;
    this.matrix[3] = a * D + b * H + c * L + d * P;
    this.matrix[4] = e * A + f * E + g * I + h * M;
    this.matrix[5] = e * B + f * F + g * J + h * N;
    this.matrix[6] = e * C + f * G + g * K + h * O;
    this.matrix[7] = e * D + f * H + g * L + h * P;
    this.matrix[8] = i * A + j * E + k * I + l * M;
    this.matrix[9] = i * B + j * F + k * J + l * N;
    this.matrix[10] = i * C + j * G + k * K + l * O;
    this.matrix[11] = i * D + j * H + k * L + l * P;
    this.matrix[12] = m * A + n * E + o * I + p * M;
    this.matrix[13] = m * B + n * F + o * J + p * N;
    this.matrix[14] = m * C + n * G + o * K + p * O;
    this.matrix[15] = m * D + n * H + o * L + p * P;

    return this;
  }

  multiplyScalar(s: number): Mat4 {
    for (let i = 0; i < 16; i++) {
      this.matrix[i] *= s;
    }
    return this;
  }

  transpose(): Mat4 {
    const temp = new Mat4().setFromMat4(this);
    this.set(
      temp.x_x, temp.y_x, temp.z_x, temp.w_x,
      temp.x_y, temp.y_y, temp.z_y, temp.w_y,
      temp.x_z, temp.y_z, temp.z_z, temp.w_z,
      temp.x_w, temp.y_w, temp.z_w, temp.w_w,
    )
    return this;
  }  

  inverse(): Mat4 {
    const s = 1/this.getDeterminant();
    const [x_x,x_y,x_z,x_w,y_x,y_y,y_z,y_w,z_x,z_y,z_z,z_w,w_x,w_y,w_z,w_w] = this.matrix;
    this.set(
      (y_z*z_w*w_y - y_w*z_z*w_y + y_w*z_y*w_z - y_y*z_w*w_z - y_z*z_y*w_w + y_y*z_z*w_w) * s,
      (x_w*z_z*w_y - x_z*z_w*w_y - x_w*z_y*w_z + x_y*z_w*w_z + x_z*z_y*w_w - x_y*z_z*w_w) * s,
      (x_z*y_w*w_y - x_w*y_z*w_y + x_w*y_y*w_z - x_y*y_w*w_z - x_z*y_y*w_w + x_y*y_z*w_w) * s,
      (x_w*y_z*z_y - x_z*y_w*z_y - x_w*y_y*z_z + x_y*y_w*z_z + x_z*y_y*z_w - x_y*y_z*z_w) * s,
      (y_w*z_z*w_x - y_z*z_w*w_x - y_w*z_x*w_z + y_x*z_w*w_z + y_z*z_x*w_w - y_x*z_z*w_w) * s,
      (x_z*z_w*w_x - x_w*z_z*w_x + x_w*z_x*w_z - x_x*z_w*w_z - x_z*z_x*w_w + x_x*z_z*w_w) * s,
      (x_w*y_z*w_x - x_z*y_w*w_x - x_w*y_x*w_z + x_x*y_w*w_z + x_z*y_x*w_w - x_x*y_z*w_w) * s,
      (x_z*y_w*z_x - x_w*y_z*z_x + x_w*y_x*z_z - x_x*y_w*z_z - x_z*y_x*z_w + x_x*y_z*z_w) * s,
      (y_y*z_w*w_x - y_w*z_y*w_x + y_w*z_x*w_y - y_x*z_w*w_y - y_y*z_x*w_w + y_x*z_y*w_w) * s,
      (x_w*z_y*w_x - x_y*z_w*w_x - x_w*z_x*w_y + x_x*z_w*w_y + x_y*z_x*w_w - x_x*z_y*w_w) * s,
      (x_y*y_w*w_x - x_w*y_y*w_x + x_w*y_x*w_y - x_x*y_w*w_y - x_y*y_x*w_w + x_x*y_y*w_w) * s,
      (x_w*y_y*z_x - x_y*y_w*z_x - x_w*y_x*z_y + x_x*y_w*z_y + x_y*y_x*z_w - x_x*y_y*z_w) * s,
      (y_z*z_y*w_x - y_y*z_z*w_x - y_z*z_x*w_y + y_x*z_z*w_y + y_y*z_x*w_z - y_x*z_y*w_z) * s,
      (x_y*z_z*w_x - x_z*z_y*w_x + x_z*z_x*w_y - x_x*z_z*w_y - x_y*z_x*w_z + x_x*z_y*w_z) * s,
      (x_z*y_y*w_x - x_y*y_z*w_x - x_z*y_x*w_y + x_x*y_z*w_y + x_y*y_x*w_z - x_x*y_y*w_z) * s,
      (x_y*y_z*z_x - x_z*y_y*z_x + x_z*y_x*z_y - x_x*y_z*z_y - x_y*y_x*z_z + x_x*y_y*z_z) * s
    );
    return this;
  } 

  getDeterminant(): number {
    const [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p] = this.matrix;
    const det =
      d*g*j*m - c*h*j*m - d*f*k*m + b*h*k*m +
      c*f*l*m - b*g*l*m - d*g*i*n + c*h*i*n +
      d*e*k*n - a*h*k*n - c*e*l*n + a*g*l*n +
      d*f*i*o - b*h*i*o - d*e*j*o + a*h*j*o +
      b*e*l*o - a*f*l*o - c*f*i*p + b*g*i*p +
      c*e*j*p - a*g*j*p - b*e*k*p + a*f*k*p;
    return det;
  } 

  getTRS(): { t: Vec3; r: Quaternion, s: Vec3 } {
    const t = new Vec3(this.w_x, this.w_y, this.w_z);
    
    const d = this.getDeterminant();
    const s_x = new Vec3(this.x_x, this.x_y, this.x_z).getMagnitude() * (d < 0 ? -1 : 1); 
    const s_y = new Vec3(this.y_x, this.y_y, this.y_z).getMagnitude(); 
    const s_z = new Vec3(this.z_x, this.z_y, this.z_z).getMagnitude(); 
    const s = new Vec3(s_x, s_y, s_z);

    const rm = new Mat4().set(
      this.x_x / s_x, this.x_y / s_x, this.x_z / s_x, 0,
      this.y_x / s_y, this.y_y / s_y, this.y_z / s_y, 0,
      this.z_x / s_z, this.z_y / s_z, this.z_z / s_z, 0,
      0, 0, 0, 1
    );

    const r = Quaternion.fromRotationMatrix(rm);

    return {t, r, s};
  }
  
  equals(m: Mat4, precision = 6): boolean {
    for (let i = 0; i < 16; i++) {
      if (this.matrix[i].toFixed(precision) !== m.matrix[i].toFixed(precision)) {
        return false;
      }
    }
    return true;
  }

  applyScaling(x: number, y: number = undefined, z: number = undefined): Mat4 {
    const m = Mat4.buildScale(x, y, z);
    return this.multiply(m);
  }

  applyTranslation(x: number, y: number, z: number): Mat4 {
    const m = Mat4.buildTranslate(x, y, z);
    return this.multiply(m);
  }

  applyRotation(axis: "x" | "y" | "z", theta: number): Mat4 {
    let m: Mat4;
    switch (axis) {
      case "x":
      default:
        m = Mat4.buildRotationX(theta);
        break;
      case "y":
        m = Mat4.buildRotationY(theta);
        break;
      case "z":
        m = Mat4.buildRotationZ(theta);
        break;
    }
    return this.multiply(m);
  }
}

export { radToDeg, degToRad, getDistance2D, getDistance3D, clamp, lerp, Vec2, Vec3, Vec4, Mat3, Mat4, Quaternion, EulerAngles };
