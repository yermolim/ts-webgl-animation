import { clamp, Mat } from "./common";

export type EulerRotationOrder = "XYZ" | "ZYX" | "YZX" | "XZY" | "ZXY" | "YXZ";

export class EulerAngles {  
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

  static fromEuler(ea: EulerAngles): EulerAngles {
    return new EulerAngles().setFromEuler(ea);
  }

  static fromRotationMatrix(m: Mat, order: EulerRotationOrder): EulerAngles {
    return new EulerAngles().setFromRotationMatrix(m, order);
  }

  static equals(ea1: EulerAngles, ea2: EulerAngles): boolean {
    return ea1.equals(ea2);
  }

  clone(): EulerAngles {
    return new EulerAngles(this.x, this.y, this.z, this.order);
  }

  set(x: number, y: number, z: number, order: EulerRotationOrder = "XYZ"): EulerAngles {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  } 
  
  setFromEuler(ea: EulerAngles): EulerAngles {
    this.x = ea.x;
    this.y = ea.y;
    this.z = ea.z;
    this.order = ea.order;
    return this;
  }
  
  equals(ea: EulerAngles): boolean {
    return this.x === ea.x
      && this.y === ea.y
      && this.z === ea.z
      && this.order === ea.order;
  }

  setFromRotationMatrix(m: Mat, order: EulerRotationOrder): EulerAngles {
    const elements = m.toArray()
    if (elements.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = elements;  

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
