import { Mat } from "./common";
import { Quaternion } from "./quaternion";
import { Vec3 } from "./vec3";

export class Mat4 implements Mat {
  readonly length = 16;
  private _matrix: number[] = new Array(this.length);

  //#region components
  get x_x(): number {
    return this._matrix[0];
  }
  get x_y(): number {
    return this._matrix[1];
  }
  get x_z(): number {
    return this._matrix[2];
  }
  get x_w(): number {
    return this._matrix[3];
  }
  get y_x(): number {
    return this._matrix[4];
  }
  get y_y(): number {
    return this._matrix[5];
  }
  get y_z(): number {
    return this._matrix[6];
  }
  get y_w(): number {
    return this._matrix[7];
  }
  get z_x(): number {
    return this._matrix[8];
  }
  get z_y(): number {
    return this._matrix[9];
  }
  get z_z(): number {
    return this._matrix[10];
  }
  get z_w(): number {
    return this._matrix[11];
  }
  get w_x(): number {
    return this._matrix[12];
  }
  get w_y(): number {
    return this._matrix[13];
  }
  get w_z(): number {
    return this._matrix[14];
  }
  get w_w(): number {
    return this._matrix[15];
  }
  //#endregion

  constructor() {
    this._matrix[0] = 1;
    this._matrix[1] = 0;
    this._matrix[2] = 0;    
    this._matrix[3] = 0;

    this._matrix[4] = 0;
    this._matrix[5] = 1;
    this._matrix[6] = 0;
    this._matrix[7] = 0;

    this._matrix[8] = 0;
    this._matrix[9] = 0;
    this._matrix[10] = 1;
    this._matrix[11] = 0;

    this._matrix[12] = 0;
    this._matrix[13] = 0;
    this._matrix[14] = 0;
    this._matrix[15] = 1;    
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
    for (let i = 0; i <this.length; i++) {
      res._matrix[i] = m._matrix[i] * s;
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
    );
    return res;
  }

  static invert(m: Mat4): Mat4 {
    const s = 1/m.getDeterminant();
    const [x_x,x_y,x_z,x_w,y_x,y_y,y_z,y_w,z_x,z_y,z_z,z_w,w_x,w_y,w_z,w_w] = m._matrix;
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
        vZ.x += 0.00001;
      } else {
        vZ.z += 0.00001;
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
    y_x: number, y_y: number, y_z: number, y_w: number,
    z_x: number, z_y: number, z_z: number, z_w: number,
    w_x: number, w_y: number, w_z: number, w_w: number): Mat4 {
    this._matrix[0] = x_x;
    this._matrix[1] = x_y;
    this._matrix[2] = x_z;
    this._matrix[3] = x_w;
    this._matrix[4] = y_x;
    this._matrix[5] = y_y;
    this._matrix[6] = y_z;
    this._matrix[7] = y_w;
    this._matrix[8] = z_x;
    this._matrix[9] = z_y;
    this._matrix[10] = z_z;
    this._matrix[11] = z_w;
    this._matrix[12] = w_x;
    this._matrix[13] = w_y;
    this._matrix[14] = w_z;
    this._matrix[15] = w_w;
    return this;
  }

  reset(): Mat4 {
    this._matrix[0] = 1;
    this._matrix[1] = 0;
    this._matrix[2] = 0;    
    this._matrix[3] = 0;

    this._matrix[4] = 0;
    this._matrix[5] = 1;
    this._matrix[6] = 0;
    this._matrix[7] = 0;

    this._matrix[8] = 0;
    this._matrix[9] = 0;
    this._matrix[10] = 1;
    this._matrix[11] = 0;

    this._matrix[12] = 0;
    this._matrix[13] = 0;
    this._matrix[14] = 0;
    this._matrix[15] = 1;
    return this;
  }

  setFromMat4(m: Mat4): Mat4 {
    for (let i = 0; i < this.length; i++) {
      this._matrix[i] = m._matrix[i];
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
    const [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p] = this._matrix; 
    const [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P] = mat._matrix;  
    
    this._matrix[0] = a * A + b * E + c * I + d * M;
    this._matrix[1] = a * B + b * F + c * J + d * N;
    this._matrix[2] = a * C + b * G + c * K + d * O;
    this._matrix[3] = a * D + b * H + c * L + d * P;
    this._matrix[4] = e * A + f * E + g * I + h * M;
    this._matrix[5] = e * B + f * F + g * J + h * N;
    this._matrix[6] = e * C + f * G + g * K + h * O;
    this._matrix[7] = e * D + f * H + g * L + h * P;
    this._matrix[8] = i * A + j * E + k * I + l * M;
    this._matrix[9] = i * B + j * F + k * J + l * N;
    this._matrix[10] = i * C + j * G + k * K + l * O;
    this._matrix[11] = i * D + j * H + k * L + l * P;
    this._matrix[12] = m * A + n * E + o * I + p * M;
    this._matrix[13] = m * B + n * F + o * J + p * N;
    this._matrix[14] = m * C + n * G + o * K + p * O;
    this._matrix[15] = m * D + n * H + o * L + p * P;

    return this;
  }

  multiplyScalar(s: number): Mat4 {
    for (let i = 0; i < this.length; i++) {
      this._matrix[i] *= s;
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
    );
    return this;
  }  

  invert(): Mat4 {
    const s = 1/this.getDeterminant();
    const [x_x,x_y,x_z,x_w,y_x,y_y,y_z,y_w,z_x,z_y,z_z,z_w,w_x,w_y,w_z,w_w] = this._matrix;
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
    const [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p] = this._matrix;
    const det =
      d*g*j*m - c*h*j*m - d*f*k*m + b*h*k*m +
      c*f*l*m - b*g*l*m - d*g*i*n + c*h*i*n +
      d*e*k*n - a*h*k*n - c*e*l*n + a*g*l*n +
      d*f*i*o - b*h*i*o - d*e*j*o + a*h*j*o +
      b*e*l*o - a*f*l*o - c*f*i*p + b*g*i*p +
      c*e*j*p - a*g*j*p - b*e*k*p + a*f*k*p;
    return det;
  } 

  getTRS(): { t: Vec3; r: Quaternion; s: Vec3 } {
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
    for (let i = 0; i < this.length; i++) {
      if (+this._matrix[i].toFixed(precision) !== +m._matrix[i].toFixed(precision)) {
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
  
  toArray(): number[] {
    return this._matrix.slice();
  }
  
  toIntArray(): Int32Array {
    return new Int32Array(this);
  } 

  toFloatArray(): Float32Array {
    return new Float32Array(this);
  } 

  *[Symbol.iterator](): Iterator<number> {
    for (let i = 0; i < this.length; i++) {      
      yield this._matrix[i];
    }
  }
}
