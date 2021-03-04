class SpriteAnimationOptions {
    constructor(item = null) {
        this.expectedFps = 60;
        this.fixedNumber = null;
        this.density = 0.0002;
        this.depth = 1000;
        this.fov = 120;
        this.size = [16, 64];
        this.velocityX = [-0.1, 0.1];
        this.velocityY = [-0.1, 0.1];
        this.velocityZ = [-0.1, 0.1];
        this.angularVelocity = [-0.001, 0.001];
        this.blur = 1;
        this.colors = [[255, 255, 255], [255, 244, 193], [250, 239, 219]];
        this.fixedOpacity = null;
        this.opacityMin = 0;
        this.opacityStep = 0;
        this.drawLines = true;
        this.lineColor = [113, 120, 146];
        this.lineLength = 150;
        this.lineWidth = 2;
        this.onClick = null;
        this.onHover = null;
        this.onClickCreateN = 10;
        this.onClickMoveR = 200;
        this.onHoverMoveR = 50;
        this.onHoverLineLength = 150;
        this.textureUrl = "animals-white.png";
        this.textureSize = 8;
        this.textureMap = [
            0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0,
            0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1,
            0, 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2,
            0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3,
        ];
        if (item) {
            Object.assign(this, item);
        }
    }
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function clamp(v, min, max) {
    return Math.max(min, Math.min(v, max));
}
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static fromRotationMatrix(m) {
        return new Quaternion().setFromRotationMatrix(m);
    }
    static fromEuler(e) {
        return new Quaternion().setFromEuler(e);
    }
    static fromVec3Angle(v, theta) {
        return new Quaternion().setFromVec3Angle(v, theta);
    }
    static fromVec3s(v1, v2) {
        return new Quaternion().setFromVec3s(v1, v2);
    }
    static normalize(q) {
        return q.clone().normalize();
    }
    static invert(q) {
        return q.clone().normalize().invert();
    }
    static dotProduct(q1, q2) {
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }
    static getAngle(q1, q2) {
        return q1.getAngle(q2);
    }
    static multiply(q1, q2) {
        return q1.clone().multiply(q2);
    }
    static slerp(q1, q2, t) {
        return q1.clone().slerp(q2, t);
    }
    static equals(q1, q2, precision = 6) {
        return q1.equals(q2, precision);
    }
    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    setFromVec3s(v1, v2) {
        v1 = v1.clone().normalize();
        v2 = v2.clone().normalize();
        let w = v1.dotProduct(v2) + 1;
        if (w < 0.000001) {
            w = 0;
            if (Math.abs(v1.x) > Math.abs(v1.z)) {
                this.x = -v1.y;
                this.y = v1.x;
                this.z = 0;
            }
            else {
                this.x = 0;
                this.y = -v1.z;
                this.z = v1.y;
            }
        }
        else {
            const { x, y, z } = v1.crossProduct(v2);
            this.x = x;
            this.y = y;
            this.z = z;
        }
        this.w = w;
        return this.normalize();
    }
    setFromQ(q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;
    }
    setFromRotationMatrix(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        const trace = x_x + y_y + z_z;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(1 + trace);
            this.set((y_z - z_y) * s, (z_x - x_z) * s, (x_y - y_x) * s, 0.25 / s);
        }
        else if (x_x > y_y && x_x > z_z) {
            const s = 2 * Math.sqrt(1 + x_x - y_y - z_z);
            this.set(0.25 * s, (y_x + x_y) / s, (z_x + x_z) / s, (y_z - z_y) / s);
        }
        else if (y_y > z_z) {
            const s = 2 * Math.sqrt(1 + y_y - x_x - z_z);
            this.set((y_x + x_y) / s, 0.25 * s, (z_y + y_z) / s, (z_x - x_z) / s);
        }
        else {
            const s = 2 * Math.sqrt(1 + z_z - x_x - y_y);
            this.set((z_x + x_z) / s, (z_y + y_z) / s, 0.25 * s, (x_y - y_x) / s);
        }
        return this;
    }
    setFromEuler(e) {
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
    setFromVec3Angle(v, theta) {
        const vNorm = v.clone().normalize();
        const halfTheta = theta / 2;
        const halfThetaSin = Math.sin(halfTheta);
        this.x = vNorm.x * halfThetaSin;
        this.y = vNorm.y * halfThetaSin;
        this.z = vNorm.z * halfThetaSin;
        this.w = Math.cos(halfTheta);
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
            this.w /= m;
        }
        return this;
    }
    invert() {
        this.normalize();
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    dotProduct(q) {
        return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    }
    getAngle(q) {
        return 2 * Math.acos(Math.abs(clamp(this.dotProduct(q), -1, 1)));
    }
    multiply(q) {
        const { x, y, z, w } = this;
        const { x: X, y: Y, z: Z, w: W } = q;
        this.x = x * W + w * X + y * Z - z * Y;
        this.y = y * W + w * Y + z * X - x * Z;
        this.z = z * W + w * Z + x * Y - y * X;
        this.w = w * W - x * X - y * Y - z * Z;
        return this;
    }
    slerp(q, t) {
        t = clamp(t, 0, 1);
        if (!t) {
            return this;
        }
        if (t === 1) {
            return this.setFromQ(q);
        }
        const { x, y, z, w } = this;
        const { x: X, y: Y, z: Z, w: W } = q;
        const halfThetaCos = x * X + y * Y + z * Z + w * W;
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
    equals(q, precision = 6) {
        return +this.x.toFixed(precision) === +q.x.toFixed(precision)
            && +this.y.toFixed(precision) === +q.y.toFixed(precision)
            && +this.z.toFixed(precision) === +q.z.toFixed(precision)
            && +this.w.toFixed(precision) === +q.w.toFixed(precision);
    }
}

class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.length = 3;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static multiplyByScalar(v, s) {
        return new Vec3(v.x * s, v.y * s, v.z * s);
    }
    static addScalar(v, s) {
        return new Vec3(v.x + s, v.y + s, v.z + s);
    }
    static normalize(v) {
        return new Vec3().setFromVec3(v).normalize();
    }
    static add(v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static substract(v1, v2) {
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static crossProduct(v1, v2) {
        return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
    static onVector(v1, v2) {
        return v1.clone().onVector(v2);
    }
    static onPlane(v, planeNormal) {
        return v.clone().onPlane(planeNormal);
    }
    static applyMat3(v, m) {
        return v.clone().applyMat3(m);
    }
    static applyMat4(v, m) {
        return v.clone().applyMat4(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2, precision);
    }
    static getDistance(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        const z = v2.z - v1.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    static getAngle(v1, v2) {
        return v1.getAngle(v2);
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setFromVec3(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    getAngle(v) {
        const d = this.getMagnitude() * v.getMagnitude();
        if (!d) {
            return Math.PI / 2;
        }
        const cos = this.dotProduct(v) / d;
        return Math.acos(clamp(cos, -1, 1));
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    dotProduct(v) {
        return Vec3.dotProduct(this, v);
    }
    crossProduct(v) {
        this.x = this.y * v.z - this.z * v.y;
        this.y = this.z * v.x - this.x * v.z;
        this.z = this.x * v.y - this.y * v.x;
        return this;
    }
    onVector(v) {
        const magnitude = this.getMagnitude();
        if (!magnitude) {
            return this.set(0, 0, 0);
        }
        return v.clone().multiplyByScalar(v.clone().dotProduct(this) / (magnitude * magnitude));
    }
    onPlane(planeNormal) {
        return this.substract(this.clone().onVector(planeNormal));
    }
    applyMat3(m) {
        if (m.length !== 9) {
            throw new Error("Matrix must contain 9 elements");
        }
        const { x, y, z } = this;
        const [x_x, x_y, x_z, y_x, y_y, y_z, z_x, z_y, z_z] = m;
        this.x = x * x_x + y * y_x + z * z_x;
        this.y = x * x_y + y * y_y + z * z_y;
        this.z = x * x_z + y * y_z + z * z_z;
        return this;
    }
    applyMat4(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const { x, y, z } = this;
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        const w = 1 / (x * x_w + y * y_w + z * z_w + w_w);
        this.x = (x * x_x + y * y_x + z * z_x + w_x) * w;
        this.y = (x * x_y + y * y_y + z * z_y + w_y) * w;
        this.z = (x * x_z + y * y_z + z * z_z + w_z) * w;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        this.z += t * (v.z - this.z);
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision)
            && +this.z.toFixed(precision) === +v.z.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

class Mat4 {
    constructor() {
        this.length = 16;
        this._matrix = new Array(this.length);
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
    get x_x() {
        return this._matrix[0];
    }
    get x_y() {
        return this._matrix[1];
    }
    get x_z() {
        return this._matrix[2];
    }
    get x_w() {
        return this._matrix[3];
    }
    get y_x() {
        return this._matrix[4];
    }
    get y_y() {
        return this._matrix[5];
    }
    get y_z() {
        return this._matrix[6];
    }
    get y_w() {
        return this._matrix[7];
    }
    get z_x() {
        return this._matrix[8];
    }
    get z_y() {
        return this._matrix[9];
    }
    get z_z() {
        return this._matrix[10];
    }
    get z_w() {
        return this._matrix[11];
    }
    get w_x() {
        return this._matrix[12];
    }
    get w_y() {
        return this._matrix[13];
    }
    get w_z() {
        return this._matrix[14];
    }
    get w_w() {
        return this._matrix[15];
    }
    static fromMat4(m) {
        return new Mat4().setFromMat4(m);
    }
    static fromTRS(t, r, s) {
        return new Mat4().setFromTRS(t, r, s);
    }
    static fromQuaternion(q) {
        return new Mat4().setFromQuaternion(q);
    }
    static multiply(m1, m2) {
        const m = new Mat4();
        m.set(m1.x_x * m2.x_x + m1.x_y * m2.y_x + m1.x_z * m2.z_x + m1.x_w * m2.w_x, m1.x_x * m2.x_y + m1.x_y * m2.y_y + m1.x_z * m2.z_y + m1.x_w * m2.w_y, m1.x_x * m2.x_z + m1.x_y * m2.y_z + m1.x_z * m2.z_z + m1.x_w * m2.w_z, m1.x_x * m2.x_w + m1.x_y * m2.y_w + m1.x_z * m2.z_w + m1.x_w * m2.w_w, m1.y_x * m2.x_x + m1.y_y * m2.y_x + m1.y_z * m2.z_x + m1.y_w * m2.w_x, m1.y_x * m2.x_y + m1.y_y * m2.y_y + m1.y_z * m2.z_y + m1.y_w * m2.w_y, m1.y_x * m2.x_z + m1.y_y * m2.y_z + m1.y_z * m2.z_z + m1.y_w * m2.w_z, m1.y_x * m2.x_w + m1.y_y * m2.y_w + m1.y_z * m2.z_w + m1.y_w * m2.w_w, m1.z_x * m2.x_x + m1.z_y * m2.y_x + m1.z_z * m2.z_x + m1.z_w * m2.w_x, m1.z_x * m2.x_y + m1.z_y * m2.y_y + m1.z_z * m2.z_y + m1.z_w * m2.w_y, m1.z_x * m2.x_z + m1.z_y * m2.y_z + m1.z_z * m2.z_z + m1.z_w * m2.w_z, m1.z_x * m2.x_w + m1.z_y * m2.y_w + m1.z_z * m2.z_w + m1.z_w * m2.w_w, m1.w_x * m2.x_x + m1.w_y * m2.y_x + m1.w_z * m2.z_x + m1.w_w * m2.w_x, m1.w_x * m2.x_y + m1.w_y * m2.y_y + m1.w_z * m2.z_y + m1.w_w * m2.w_y, m1.w_x * m2.x_z + m1.w_y * m2.y_z + m1.w_z * m2.z_z + m1.w_w * m2.w_z, m1.w_x * m2.x_w + m1.w_y * m2.y_w + m1.w_z * m2.z_w + m1.w_w * m2.w_w);
        return m;
    }
    static multiplyScalar(m, s) {
        const res = new Mat4();
        for (let i = 0; i < this.length; i++) {
            res._matrix[i] = m._matrix[i] * s;
        }
        return res;
    }
    static transpose(m) {
        const res = new Mat4();
        res.set(m.x_x, m.y_x, m.z_x, m.w_x, m.x_y, m.y_y, m.z_y, m.w_y, m.x_z, m.y_z, m.z_z, m.w_z, m.x_w, m.y_w, m.z_w, m.w_w);
        return res;
    }
    static invert(m) {
        const s = 1 / m.getDeterminant();
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m._matrix;
        const res = new Mat4().set((y_z * z_w * w_y - y_w * z_z * w_y + y_w * z_y * w_z - y_y * z_w * w_z - y_z * z_y * w_w + y_y * z_z * w_w) * s, (x_w * z_z * w_y - x_z * z_w * w_y - x_w * z_y * w_z + x_y * z_w * w_z + x_z * z_y * w_w - x_y * z_z * w_w) * s, (x_z * y_w * w_y - x_w * y_z * w_y + x_w * y_y * w_z - x_y * y_w * w_z - x_z * y_y * w_w + x_y * y_z * w_w) * s, (x_w * y_z * z_y - x_z * y_w * z_y - x_w * y_y * z_z + x_y * y_w * z_z + x_z * y_y * z_w - x_y * y_z * z_w) * s, (y_w * z_z * w_x - y_z * z_w * w_x - y_w * z_x * w_z + y_x * z_w * w_z + y_z * z_x * w_w - y_x * z_z * w_w) * s, (x_z * z_w * w_x - x_w * z_z * w_x + x_w * z_x * w_z - x_x * z_w * w_z - x_z * z_x * w_w + x_x * z_z * w_w) * s, (x_w * y_z * w_x - x_z * y_w * w_x - x_w * y_x * w_z + x_x * y_w * w_z + x_z * y_x * w_w - x_x * y_z * w_w) * s, (x_z * y_w * z_x - x_w * y_z * z_x + x_w * y_x * z_z - x_x * y_w * z_z - x_z * y_x * z_w + x_x * y_z * z_w) * s, (y_y * z_w * w_x - y_w * z_y * w_x + y_w * z_x * w_y - y_x * z_w * w_y - y_y * z_x * w_w + y_x * z_y * w_w) * s, (x_w * z_y * w_x - x_y * z_w * w_x - x_w * z_x * w_y + x_x * z_w * w_y + x_y * z_x * w_w - x_x * z_y * w_w) * s, (x_y * y_w * w_x - x_w * y_y * w_x + x_w * y_x * w_y - x_x * y_w * w_y - x_y * y_x * w_w + x_x * y_y * w_w) * s, (x_w * y_y * z_x - x_y * y_w * z_x - x_w * y_x * z_y + x_x * y_w * z_y + x_y * y_x * z_w - x_x * y_y * z_w) * s, (y_z * z_y * w_x - y_y * z_z * w_x - y_z * z_x * w_y + y_x * z_z * w_y + y_y * z_x * w_z - y_x * z_y * w_z) * s, (x_y * z_z * w_x - x_z * z_y * w_x + x_z * z_x * w_y - x_x * z_z * w_y - x_y * z_x * w_z + x_x * z_y * w_z) * s, (x_z * y_y * w_x - x_y * y_z * w_x - x_z * y_x * w_y + x_x * y_z * w_y + x_y * y_x * w_z - x_x * y_y * w_z) * s, (x_y * y_z * z_x - x_z * y_y * z_x + x_z * y_x * z_y - x_x * y_z * z_y - x_y * y_x * z_z + x_x * y_y * z_z) * s);
        return res;
    }
    static lookAt(source, target, up) {
        const vZ = Vec3.equals(source, target)
            ? new Vec3(0, 0, 1)
            : Vec3.substract(source, target).normalize();
        let vX = Vec3.crossProduct(up, vZ).normalize();
        if (!vX.getMagnitude()) {
            if (Math.abs(up.z) === 1) {
                vZ.x += 0.00001;
            }
            else {
                vZ.z += 0.00001;
            }
            vZ.normalize();
            vX = Vec3.crossProduct(up, vZ).normalize();
        }
        const vY = Vec3.crossProduct(vZ, vX).normalize();
        return new Mat4().set(vX.x, vX.y, vX.z, 0, vY.x, vY.y, vY.z, 0, vZ.x, vZ.y, vZ.z, 0, source.x, source.y, source.z, 1);
    }
    static buildScale(x, y = undefined, z = undefined) {
        y ?? (y = x);
        z ?? (z = x);
        return new Mat4().set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static buildRotationX(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
    static buildRotationY(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
    static buildRotationZ(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static buildTranslate(x, y, z) {
        return new Mat4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
    }
    static buildOrthographic(near, far, left, right, bottom, top) {
        return new Mat4().set(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, 0, 0, 2 / (near - far), 0, (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1);
    }
    static buildPerspective(near, far, ...args) {
        if (args.length === 4) {
            const [left, right, bottom, top] = args;
            return new Mat4().set(2 * near / (right - left), 0, 0, 0, 0, 2 * near / (top - bottom), 0, 0, (right + left) / (right - left), (top + bottom) / (top - bottom), (near + far) / (near - far), -1, 0, 0, 2 * near * far / (near - far), 0);
        }
        else if (args.length === 2) {
            const [fov, aspectRatio] = args;
            const f = Math.tan(0.5 * Math.PI - 0.5 * fov);
            return new Mat4().set(f / aspectRatio, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) / (near - far), -1, 0, 0, 2 * near * far / (near - far), 0);
        }
        else {
            throw new Error("Incorrect args quantity");
        }
    }
    static equals(m1, m2, precision = 6) {
        return m1.equals(m2, precision);
    }
    clone() {
        return new Mat4().set(this.x_x, this.x_y, this.x_z, this.x_w, this.y_x, this.y_y, this.y_z, this.y_w, this.z_x, this.z_y, this.z_z, this.z_w, this.w_x, this.w_y, this.w_z, this.w_w);
    }
    set(x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w) {
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
    reset() {
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
    setFromMat4(m) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] = m._matrix[i];
        }
        return this;
    }
    setFromTRS(t, r, s) {
        const x_x = 2 * r.x * r.x;
        const x_y = 2 * r.y * r.x;
        const x_z = 2 * r.z * r.x;
        const y_y = 2 * r.y * r.y;
        const y_z = 2 * r.z * r.y;
        const z_z = 2 * r.z * r.z;
        const w_x = 2 * r.x * r.w;
        const w_y = 2 * r.y * r.w;
        const w_z = 2 * r.z * r.w;
        this.set((1 - y_y - z_z) * s.x, (x_y + w_z) * s.x, (x_z - w_y) * s.x, 0, (x_y - w_z) * s.y, (1 - x_x - z_z) * s.y, (y_z + w_x) * s.y, 0, (x_z + w_y) * s.z, (y_z - w_x) * s.z, (1 - x_x - y_y) * s.z, 0, t.x, t.y, t.z, 1);
        return this;
    }
    setFromQuaternion(q) {
        return this.setFromTRS(new Vec3(0, 0, 0), q, new Vec3(1, 1, 1));
    }
    multiply(mat) {
        const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this._matrix;
        const [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P] = mat._matrix;
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
    multiplyScalar(s) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] *= s;
        }
        return this;
    }
    transpose() {
        const temp = new Mat4().setFromMat4(this);
        this.set(temp.x_x, temp.y_x, temp.z_x, temp.w_x, temp.x_y, temp.y_y, temp.z_y, temp.w_y, temp.x_z, temp.y_z, temp.z_z, temp.w_z, temp.x_w, temp.y_w, temp.z_w, temp.w_w);
        return this;
    }
    invert() {
        const s = 1 / this.getDeterminant();
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = this._matrix;
        this.set((y_z * z_w * w_y - y_w * z_z * w_y + y_w * z_y * w_z - y_y * z_w * w_z - y_z * z_y * w_w + y_y * z_z * w_w) * s, (x_w * z_z * w_y - x_z * z_w * w_y - x_w * z_y * w_z + x_y * z_w * w_z + x_z * z_y * w_w - x_y * z_z * w_w) * s, (x_z * y_w * w_y - x_w * y_z * w_y + x_w * y_y * w_z - x_y * y_w * w_z - x_z * y_y * w_w + x_y * y_z * w_w) * s, (x_w * y_z * z_y - x_z * y_w * z_y - x_w * y_y * z_z + x_y * y_w * z_z + x_z * y_y * z_w - x_y * y_z * z_w) * s, (y_w * z_z * w_x - y_z * z_w * w_x - y_w * z_x * w_z + y_x * z_w * w_z + y_z * z_x * w_w - y_x * z_z * w_w) * s, (x_z * z_w * w_x - x_w * z_z * w_x + x_w * z_x * w_z - x_x * z_w * w_z - x_z * z_x * w_w + x_x * z_z * w_w) * s, (x_w * y_z * w_x - x_z * y_w * w_x - x_w * y_x * w_z + x_x * y_w * w_z + x_z * y_x * w_w - x_x * y_z * w_w) * s, (x_z * y_w * z_x - x_w * y_z * z_x + x_w * y_x * z_z - x_x * y_w * z_z - x_z * y_x * z_w + x_x * y_z * z_w) * s, (y_y * z_w * w_x - y_w * z_y * w_x + y_w * z_x * w_y - y_x * z_w * w_y - y_y * z_x * w_w + y_x * z_y * w_w) * s, (x_w * z_y * w_x - x_y * z_w * w_x - x_w * z_x * w_y + x_x * z_w * w_y + x_y * z_x * w_w - x_x * z_y * w_w) * s, (x_y * y_w * w_x - x_w * y_y * w_x + x_w * y_x * w_y - x_x * y_w * w_y - x_y * y_x * w_w + x_x * y_y * w_w) * s, (x_w * y_y * z_x - x_y * y_w * z_x - x_w * y_x * z_y + x_x * y_w * z_y + x_y * y_x * z_w - x_x * y_y * z_w) * s, (y_z * z_y * w_x - y_y * z_z * w_x - y_z * z_x * w_y + y_x * z_z * w_y + y_y * z_x * w_z - y_x * z_y * w_z) * s, (x_y * z_z * w_x - x_z * z_y * w_x + x_z * z_x * w_y - x_x * z_z * w_y - x_y * z_x * w_z + x_x * z_y * w_z) * s, (x_z * y_y * w_x - x_y * y_z * w_x - x_z * y_x * w_y + x_x * y_z * w_y + x_y * y_x * w_z - x_x * y_y * w_z) * s, (x_y * y_z * z_x - x_z * y_y * z_x + x_z * y_x * z_y - x_x * y_z * z_y - x_y * y_x * z_z + x_x * y_y * z_z) * s);
        return this;
    }
    getDeterminant() {
        const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this._matrix;
        const det = d * g * j * m - c * h * j * m - d * f * k * m + b * h * k * m +
            c * f * l * m - b * g * l * m - d * g * i * n + c * h * i * n +
            d * e * k * n - a * h * k * n - c * e * l * n + a * g * l * n +
            d * f * i * o - b * h * i * o - d * e * j * o + a * h * j * o +
            b * e * l * o - a * f * l * o - c * f * i * p + b * g * i * p +
            c * e * j * p - a * g * j * p - b * e * k * p + a * f * k * p;
        return det;
    }
    getTRS() {
        const t = new Vec3(this.w_x, this.w_y, this.w_z);
        const d = this.getDeterminant();
        const s_x = new Vec3(this.x_x, this.x_y, this.x_z).getMagnitude() * (d < 0 ? -1 : 1);
        const s_y = new Vec3(this.y_x, this.y_y, this.y_z).getMagnitude();
        const s_z = new Vec3(this.z_x, this.z_y, this.z_z).getMagnitude();
        const s = new Vec3(s_x, s_y, s_z);
        const rm = new Mat4().set(this.x_x / s_x, this.x_y / s_x, this.x_z / s_x, 0, this.y_x / s_y, this.y_y / s_y, this.y_z / s_y, 0, this.z_x / s_z, this.z_y / s_z, this.z_z / s_z, 0, 0, 0, 0, 1);
        const r = Quaternion.fromRotationMatrix(rm);
        return { t, r, s };
    }
    equals(m, precision = 6) {
        for (let i = 0; i < this.length; i++) {
            if (+this._matrix[i].toFixed(precision) !== +m._matrix[i].toFixed(precision)) {
                return false;
            }
        }
        return true;
    }
    applyScaling(x, y = undefined, z = undefined) {
        const m = Mat4.buildScale(x, y, z);
        return this.multiply(m);
    }
    applyTranslation(x, y, z) {
        const m = Mat4.buildTranslate(x, y, z);
        return this.multiply(m);
    }
    applyRotation(axis, theta) {
        let m;
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
    toArray() {
        return this._matrix.slice();
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this._matrix[i];
        }
    }
}

class Vec2 {
    constructor(x = 0, y = 0) {
        this.length = 2;
        this.x = x;
        this.y = y;
    }
    static multiplyByScalar(v, s) {
        return new Vec2(v.x * s, v.y * s);
    }
    static addScalar(v, s) {
        return new Vec2(v.x + s, v.y + s);
    }
    static normalize(v) {
        return new Vec2().setFromVec2(v).normalize();
    }
    static add(v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }
    static substract(v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static applyMat3(v, m) {
        return v.clone().applyMat3(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static rotate(v, center, theta) {
        return v.clone().rotate(center, theta);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2);
    }
    static getDistance(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        return Math.sqrt(x * x + y * y);
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setFromVec2(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dotProduct(v) {
        return Vec2.dotProduct(this, v);
    }
    applyMat3(m) {
        if (m.length !== 9) {
            throw new Error("Matrix must contain 9 elements");
        }
        const { x, y } = this;
        const [x_x, x_y, , y_x, y_y, , z_x, z_y,] = m;
        this.x = x * x_x + y * y_x + z_x;
        this.y = x * x_y + y * y_y + z_y;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        return this;
    }
    rotate(center, theta) {
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const x = this.x - center.x;
        const y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}

class Vec4 {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.length = 4;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static fromVec3(v) {
        return new Vec4(v.x, v.y, v.z);
    }
    static multiplyByScalar(v, s) {
        return new Vec4(v.x * s, v.y * s, v.z * s, v.w * s);
    }
    static addScalar(v, s) {
        return new Vec4(v.x + s, v.y + s, v.z + s, v.w + s);
    }
    static normalize(v) {
        return new Vec4().setFromVec4(v).normalize();
    }
    static add(v1, v2) {
        return new Vec4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }
    static substract(v1, v2) {
        return new Vec4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static applyMat4(v, m) {
        return v.clone().applyMat4(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2, precision);
    }
    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    setFromVec3(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = 1;
    }
    setFromVec4(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
            this.w /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    }
    dotProduct(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    applyMat4(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const { x, y, z, w } = this;
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        this.x = x * x_x + y * y_x + z * z_x + w * w_x;
        this.y = x * x_y + y * y_y + z * z_y + w * w_y;
        this.z = x * x_z + y * y_z + z * z_z + w * w_z;
        this.w = x * x_w + y * y_w + z * z_w + w * w_w;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        this.z += t * (v.z - this.z);
        this.w += t * (v.w - this.w);
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision)
            && +this.z.toFixed(precision) === +v.z.toFixed(precision)
            && +this.w.toFixed(precision) === +v.w.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}

const shaderTypes = {
    FRAGMENT_SHADER: 0x8b30,
    VERTEX_SHADER: 0x8b31,
};
const bufferTypes = {
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    UNIFORM_BUFFER: 0x8a11,
    TRANSFORM_FEEDBACK_BUFFER: 0x8c8e,
};
const textureTypes = {
    TEXTURE0: 0x84c0,
    TEXTURE_2D: 0x0DE1,
    TEXTURE_2D_ARRAY: 0x8C1A,
    TEXTURE_3D: 0x806F,
    TEXTURE_CUBE_MAP: 0x8513,
};
const texelTypes = {
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,
    FLOAT: 0x1406,
};
const numberTypes = {
    BYTE: 0x1400,
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,
    BOOL: 0x8B56,
};
const numberSizes = {
    0x1400: 1,
    0x1401: 1,
    0x1402: 2,
    0x1403: 2,
    0x1404: 4,
    0x1405: 4,
    0x1406: 4,
};
const uniformFloatTypes = {
    FLOAT: numberTypes.FLOAT,
    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    FLOAT_MAT2: 0x8B5A,
    FLOAT_MAT3: 0x8B5B,
    FLOAT_MAT4: 0x8B5C,
};
const uniformIntTypes = {
    INT: numberTypes.INT,
    BOOL: numberTypes.BOOL,
    INT_VEC2: 0x8B53,
    INT_VEC3: 0x8B54,
    INT_VEC4: 0x8B55,
    BOOL_VEC2: 0x8B57,
    BOOL_VEC3: 0x8B58,
    BOOL_VEC4: 0x8B59,
};
const samplerTypes = {
    SAMPLER_2D: 0x8B5E,
    SAMPLER_CUBE: 0x8B60,
    SAMPLER_3D: 0x8B5F,
    SAMPLER_2D_SHADOW: 0x8B62,
    SAMPLER_2D_ARRAY: 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
    SAMPLER_CUBE_SHADOW: 0x8DC5,
    INT_SAMPLER_2D: 0x8DCA,
    INT_SAMPLER_3D: 0x8DCB,
    INT_SAMPLER_CUBE: 0x8DCC,
    INT_SAMPLER_2D_ARRAY: 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,
};
const bufferUsageTypes = {
    STATIC_DRAW: 0x88E4,
    STREAM_DRAW: 0x88E0,
    DYNAMIC_DRAW: 0x88E8,
};
function getNumberTypeByArray(typedArray) {
    if (typedArray instanceof Int8Array) {
        return numberTypes.BYTE;
    }
    if (typedArray instanceof Uint8Array
        || typedArray instanceof Uint8ClampedArray) {
        return numberTypes.UNSIGNED_BYTE;
    }
    if (typedArray instanceof Int16Array) {
        return numberTypes.SHORT;
    }
    if (typedArray instanceof Uint16Array) {
        return numberTypes.UNSIGNED_SHORT;
    }
    if (typedArray instanceof Int32Array) {
        return numberTypes.INT;
    }
    if (typedArray instanceof Uint32Array) {
        return numberTypes.UNSIGNED_INT;
    }
    if (typedArray instanceof Float32Array) {
        return numberTypes.FLOAT;
    }
    throw new Error("Unsupported array type");
}

class Attribute {
    constructor(gl, program, name) {
        this._gl = gl;
        this._location = gl.getAttribLocation(program, name);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get location() {
        return this._location;
    }
}
class ConstantInfo extends Attribute {
    constructor(gl, program, name, values) {
        super(gl, program, name);
        this._type = getNumberTypeByArray(values);
        this._size = values.length;
        if (![1, 2, 3, 4, 9, 16].includes(this._size)) {
            throw new Error("Incorrect constant value length");
        }
    }
    set() {
        this._gl.disableVertexAttribArray(this._location);
        switch (this._type) {
            case numberTypes.FLOAT:
                switch (this._size) {
                    case 1:
                        this._gl.vertexAttrib1f(this._location, this._values[0]);
                        break;
                    case 2:
                        this._gl.vertexAttrib2fv(this._location, this._values);
                        break;
                    case 3:
                        this._gl.vertexAttrib3fv(this._location, this._values);
                        break;
                    case 4:
                        this._gl.vertexAttrib4fv(this._location, this._values);
                        break;
                    case 9:
                        const [a, b, c, d, e, f, g, h, i] = this._values;
                        this._gl.vertexAttrib3f(this._location, a, b, c);
                        this._gl.vertexAttrib3f(this._location + 1, d, e, f);
                        this._gl.vertexAttrib3f(this._location + 2, g, h, i);
                        break;
                    case 16:
                        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = this._values;
                        this._gl.vertexAttrib4f(this._location, x_x, x_y, x_z, x_w);
                        this._gl.vertexAttrib4f(this._location + 1, y_x, y_y, y_z, y_w);
                        this._gl.vertexAttrib4f(this._location + 2, z_x, z_y, z_z, z_w);
                        this._gl.vertexAttrib4f(this._location + 3, w_x, w_y, w_z, w_w);
                        break;
                    default:
                        throw new Error("Incorrect constant value length");
                }
                break;
            default:
                throw new Error("Unsupported constant attribute type");
        }
    }
    destroy() {
    }
}
class BufferInfo extends Attribute {
    constructor(gl, program, name, data, options, instancedExt) {
        super(gl, program, name);
        this._type = getNumberTypeByArray(data);
        const { usage, vectorSize, vectorNumber, stride, offset, normalize, divisor } = Object.assign({}, BufferInfo.defaultOptions, options);
        const minStride = vectorNumber
            ? vectorSize * vectorNumber * numberSizes[this.type]
            : 0;
        this._stride = Math.min(255, Math.max(minStride, stride));
        this._vectorOffset = this._stride && vectorNumber
            ? this._stride / vectorNumber
            : 0;
        this._vectorSize = vectorSize;
        this._vectorNumber = vectorNumber;
        this._offset = offset;
        this._normalize = normalize;
        this._divisor = divisor;
        this._instancedExt = instancedExt;
        this._buffer = gl.createBuffer();
        gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        gl.bufferData(bufferTypes.ARRAY_BUFFER, data, usage === "static"
            ? bufferUsageTypes.STATIC_DRAW
            : bufferUsageTypes.DYNAMIC_DRAW);
    }
    updateData(data, offset) {
        this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        this._gl.bufferSubData(bufferTypes.ARRAY_BUFFER, offset, data);
    }
    set() {
        this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
        for (let i = 0, j = this._location; i < this._vectorNumber; i++, j++) {
            this._gl.enableVertexAttribArray(j);
            this._gl.vertexAttribPointer(j, this._vectorSize, this._type, this._normalize, this._stride, this._offset + i * this._vectorOffset);
            if (this._divisor && this._instancedExt) {
                this._instancedExt.vertexAttribDivisorANGLE(j, this._divisor);
            }
        }
    }
    destroy() {
        this._gl.deleteBuffer(this._buffer);
    }
}
BufferInfo.defaultOptions = {
    usage: "static",
    vectorSize: 1,
    vectorNumber: 1,
    stride: 0,
    offset: 0,
    normalize: false,
};
class IndexInfo extends Attribute {
    constructor(gl, program, data) {
        super(gl, program, "index");
        let type;
        if (data instanceof Uint8Array
            || data instanceof Uint8ClampedArray) {
            type = numberTypes.UNSIGNED_BYTE;
        }
        else if (data instanceof Uint16Array) {
            type = numberTypes.UNSIGNED_SHORT;
        }
        else if (data instanceof Uint32Array) {
            type = numberTypes.UNSIGNED_INT;
        }
        else {
            throw new Error("Unsupported index type");
        }
        this._type = type;
        this._buffer = gl.createBuffer();
        this._gl.bindBuffer(bufferTypes.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    set() {
        this._gl.bindBuffer(bufferTypes.ELEMENT_ARRAY_BUFFER, this._buffer);
    }
    destroy() {
        this._gl.deleteBuffer(this._buffer);
    }
}

class Uniform {
    constructor(gl, program, name) {
        this._gl = gl;
        this._location = gl.getUniformLocation(program, name);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get location() {
        return this._location;
    }
    setSampleArray(target, unit, textures) {
    }
}
class UniformIntInfo extends Uniform {
    constructor(gl, program, name, type, value) {
        super(gl, program, name);
        this._value = value;
        this._type = type;
    }
    set() {
        this._gl.uniform1i(this._location, this._value);
    }
    destroy() {
    }
}
class UniformFloatInfo extends Uniform {
    constructor(gl, program, name, value) {
        super(gl, program, name);
        this._type = 5126;
        this._value = value;
    }
    set() {
        this._gl.uniform1f(this._location, this._value);
    }
    destroy() {
    }
}
class UniformIntArrayInfo extends Uniform {
    constructor(gl, program, name, type, values) {
        super(gl, program, name);
        this._values = values;
        switch (type) {
            case numberTypes.INT:
            case numberTypes.BOOL:
                break;
            case uniformIntTypes.INT_VEC2:
            case uniformIntTypes.BOOL_VEC2:
                if (values.length !== 2) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformIntTypes.INT_VEC3:
            case uniformIntTypes.BOOL_VEC3:
                if (values.length !== 3) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformIntTypes.INT_VEC4:
            case uniformIntTypes.BOOL_VEC4:
                if (values.length !== 4) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformIntArrayInfo`);
        }
        this._type = type;
    }
    set() {
        switch (this._type) {
            case numberTypes.INT:
            case numberTypes.BOOL:
                this._gl.uniform1iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC2:
            case uniformIntTypes.BOOL_VEC2:
                this._gl.uniform2iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC3:
            case uniformIntTypes.BOOL_VEC3:
                this._gl.uniform3iv(this._location, this._values);
                break;
            case uniformIntTypes.INT_VEC4:
            case uniformIntTypes.BOOL_VEC4:
                this._gl.uniform4iv(this._location, this._values);
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformIntArrayInfo`);
        }
    }
    destroy() {
    }
}
class UniformFloatArrayInfo extends Uniform {
    constructor(gl, program, name, type, values) {
        super(gl, program, name);
        this._values = values;
        switch (type) {
            case numberTypes.FLOAT:
                break;
            case uniformFloatTypes.FLOAT_VEC2:
                if (values.length !== 2) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_VEC3:
                if (values.length !== 3) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_VEC4:
            case uniformFloatTypes.FLOAT_MAT2:
                if (values.length !== 4) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_MAT3:
                if (values.length !== 9) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            case uniformFloatTypes.FLOAT_MAT4:
                if (values.length !== 16) {
                    throw new Error("Wrong values array length for a defined type");
                }
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformFloatArrayInfo`);
        }
        this._type = type;
    }
    set() {
        switch (this._type) {
            case numberTypes.FLOAT:
                this._gl.uniform1fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC2:
                this._gl.uniform2fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC3:
                this._gl.uniform3fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_VEC4:
                this._gl.uniform4fv(this._location, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT2:
                this._gl.uniformMatrix2fv(this._location, false, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT3:
                this._gl.uniformMatrix3fv(this._location, false, this._values);
                break;
            case uniformFloatTypes.FLOAT_MAT4:
                this._gl.uniformMatrix4fv(this._location, false, this._values);
                break;
            default:
                throw new Error(`Uniforms of type '${this._type}' are not supported by UniformFloatArrayInfo`);
        }
    }
    destroy() {
    }
}
class Texture extends Uniform {
    constructor(gl, program, name, unit, type, sampler) {
        super(gl, program, name);
        this._sampler = sampler;
        switch (type) {
            case samplerTypes.SAMPLER_2D:
            case samplerTypes.SAMPLER_2D_SHADOW:
            case samplerTypes.INT_SAMPLER_2D:
            case samplerTypes.UNSIGNED_INT_SAMPLER_2D:
                this._target = textureTypes.TEXTURE_2D;
                break;
            case samplerTypes.SAMPLER_CUBE:
            case samplerTypes.SAMPLER_CUBE_SHADOW:
            case samplerTypes.INT_SAMPLER_CUBE:
            case samplerTypes.UNSIGNED_INT_SAMPLER_CUBE:
                this._target = textureTypes.TEXTURE_CUBE_MAP;
                break;
            default:
                throw new Error(`Unsupported sampler type ${type}`);
        }
        this._type = type;
        this._unit = unit;
    }
}
class TextureInfo extends Texture {
    constructor(gl, program, name, unit, texture, type, sampler) {
        super(gl, program, name, unit, type, sampler);
        this._texture = texture;
    }
    set() {
        this._gl.uniform1i(this._location, this._unit);
        this._gl.activeTexture(textureTypes.TEXTURE0 + this._unit);
        this._gl.bindTexture(this._target, this._texture);
    }
    destroy() {
        this._gl.deleteTexture(this._texture);
    }
}
class TextureArrayInfo extends Texture {
    constructor(gl, program, name, unit, textures, type, sampler) {
        super(gl, program, name, unit, type, sampler);
        this._textures = textures;
    }
    set() {
        const units = new Int32Array(this._textures.length);
        for (let i = 0; i < this._textures.length; i++) {
            units[i] = this._unit + i;
        }
        this._gl.uniform1iv(this._location, units);
        this._textures.forEach((x, i) => {
            const unit = textureTypes.TEXTURE0 + units[i];
            this._gl.activeTexture(unit);
            this._gl.bindTexture(this._target, x);
        });
    }
    destroy() {
        this._textures.forEach(x => this._gl.deleteTexture(x));
    }
}

class WGLProgramBase {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this._attributes = new Map();
        this._uniforms = new Map();
        this._offset = 0;
        this._triangleCount = 0;
        const vertexShader = WGLProgramBase.loadShader(gl, shaderTypes.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = WGLProgramBase.loadShader(gl, shaderTypes.FRAGMENT_SHADER, fragmentShaderSource);
        this._extIndexed = gl.getExtension("OES_element_index_uint");
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        this._gl = gl;
        this._program = program;
        gl.linkProgram(program);
        const result = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!result) {
            const log = gl.getProgramInfoLog(program);
            this.destroy();
            throw new Error("Error while linking program: " + log);
        }
    }
    get offset() {
        return this._offset;
    }
    set offset(count) {
        this._offset = Math.max(0, count);
    }
    static loadShader(gl, shaderType, shaderSource) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!result) {
            const log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error while compiling shader: " + log);
        }
        return shader;
    }
    destroy() {
        this.clearUniforms();
        this.clearAttributes();
        this._gl.deleteProgram(this._program);
        this._gl.deleteShader(this._vertexShader);
        this._gl.deleteShader(this._fragmentShader);
    }
    setConstantScalarAttribute(name, s) {
        if (!name || isNaN(s)) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, new Float32Array([s]));
        this.setAttribute(constant);
    }
    setConstantVecAttribute(name, v) {
        if (!name || !v) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, v.toFloatArray());
        this.setAttribute(constant);
    }
    setConstantMatAttribute(name, m) {
        if (!name || !m) {
            return;
        }
        const constant = new ConstantInfo(this._gl, this._program, name, m.toFloatArray());
        this.setAttribute(constant);
    }
    setBufferAttribute(name, data, options) {
        if (!name || !data?.length) {
            return;
        }
        const buffer = new BufferInfo(this._gl, this._program, name, data, options);
        this.setAttribute(buffer);
    }
    setIndexAttribute(data) {
        if (!data?.length) {
            return;
        }
        if (!this._extIndexed && data instanceof Uint32Array) {
            throw new Error("'OES_element_index_uint' extension not supported");
        }
        const buffer = new IndexInfo(this._gl, this._program, data);
        this.setAttribute(buffer);
    }
    updateBufferAttribute(name, data, offset) {
        if (!name || !data) {
            return;
        }
        const attribute = this._attributes.get(name);
        if (!(attribute instanceof BufferInfo)) {
            return;
        }
        attribute.updateData(data, offset);
    }
    deleteAttribute(name) {
        const attribute = this._attributes.get(name);
        if (attribute) {
            attribute.destroy();
            this._attributes.delete(name);
        }
    }
    clearAttributes() {
        this._attributes.forEach((v, k) => this.deleteAttribute(k));
    }
    setBoolUniform(name, value) {
        const uniform = new UniformIntInfo(this._gl, this._program, name, numberTypes.INT, value ? 1 : 0);
        this.setUniform(uniform);
    }
    setBoolArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const values = new Int32Array(data.length);
        for (let i = 0; i < data.length; i++) {
            values[i] = data[i] ? 1 : 0;
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, numberTypes.BOOL, values);
        this.setUniform(uniform);
    }
    setIntUniform(name, value) {
        if (!name || isNaN(value)) {
            return;
        }
        const uniform = new UniformIntInfo(this._gl, this._program, name, numberTypes.INT, value);
        this.setUniform(uniform);
    }
    setIntArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, numberTypes.INT, data);
        this.setUniform(uniform);
    }
    setIntVecUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 2:
                type = uniformIntTypes.INT_VEC2;
                break;
            case 3:
                type = uniformIntTypes.INT_VEC3;
                break;
            case 4:
                type = uniformIntTypes.INT_VEC4;
                break;
            default:
                throw new Error("Incorrect vector length");
        }
        const uniform = new UniformIntArrayInfo(this._gl, this._program, name, type, data.toIntArray());
        this.setUniform(uniform);
    }
    setFloatUniform(name, value) {
        if (!name || isNaN(value)) {
            return;
        }
        const uniform = new UniformFloatInfo(this._gl, this._program, name, value);
        this.setUniform(uniform);
    }
    setFloatArrayUniform(name, data) {
        if (!name || !data?.length) {
            return;
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, numberTypes.FLOAT, data);
        this.setUniform(uniform);
    }
    setFloatVecUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 2:
                type = uniformFloatTypes.FLOAT_VEC2;
                break;
            case 3:
                type = uniformFloatTypes.FLOAT_VEC3;
                break;
            case 4:
                type = uniformFloatTypes.FLOAT_VEC4;
                break;
            default:
                throw new Error("Incorrect vector length");
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, type, data.toFloatArray());
        this.setUniform(uniform);
    }
    setFloatMatUniform(name, data) {
        if (!name || !data) {
            return;
        }
        let type;
        switch (data.length) {
            case 4:
                type = uniformFloatTypes.FLOAT_MAT2;
                break;
            case 9:
                type = uniformFloatTypes.FLOAT_MAT3;
                break;
            case 16:
                type = uniformFloatTypes.FLOAT_MAT4;
                break;
            default:
                throw new Error("Incorrect matrix length");
        }
        const uniform = new UniformFloatArrayInfo(this._gl, this._program, name, type, data.toFloatArray());
        this.setUniform(uniform);
    }
    createTexture(data, type, texelFormal, texelType, width, height, forceNearestFilter = false) {
        if (texelType === texelTypes.UNSIGNED_BYTE) {
            if (!(data instanceof Uint8Array)) {
                throw new Error("Invalid data array type: must be Uint8Array");
            }
        }
        else if (texelType === texelTypes.FLOAT) {
            if (!(data instanceof Float32Array)) {
                throw new Error("Invalid data array type: must be Float32Array");
            }
            if (!this._gl.getExtension("OES_texture_float")
                || !this._gl.getExtension("OES_texture_float_linear")) {
                throw new Error("Float texture extensions not supported");
            }
        }
        else if (!(data instanceof Uint16Array)) {
            throw new Error("Invalid data array type: must be Uint16Array");
        }
        if (data.length !== width * height) {
            throw new Error("Invalid data array length");
        }
        const gl = this._gl;
        const texture = gl.createTexture();
        gl.bindTexture(type, texture);
        gl.texImage2D(type, 0, texelFormal, width, height, 0, texelFormal, texelType, data);
        if (forceNearestFilter) {
            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        else if (isPowerOf2(width) && isPowerOf2(height)) {
            gl.generateMipmap(type);
        }
        else {
            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        return texture;
    }
    loadTexture(url, fallback = new Uint8Array([0, 0, 0, 255])) {
        if (!url || !(fallback instanceof Uint8Array)) {
            throw new Error("Invalid arguments");
        }
        const gl = this._gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, fallback);
        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;
        return texture;
    }
    setTexture(name, texture, type = samplerTypes.SAMPLER_2D, unit = 0) {
        if (!name || !texture) {
            return;
        }
        const uniform = new TextureInfo(this._gl, this._program, name, unit, texture, type);
        this._uniforms.set(name, uniform);
    }
    setTextureArray(name, textures, type = samplerTypes.SAMPLER_2D, unit = 0) {
        if (!name || !textures?.length) {
            return;
        }
        const uniform = new TextureArrayInfo(this._gl, this._program, name, unit, textures, type);
        this._uniforms.set(name, uniform);
    }
    createAndSet2dTexture(name, data, type, texelFormal, texelType, width, height, forceNearestFilter = false, unit = 0) {
        if (!name) {
            return;
        }
        const texture = this.createTexture(data, type, texelFormal, texelType, width, height, forceNearestFilter);
        this.setTexture(name, texture, type, unit);
    }
    loadAndSet2dTexture(name, url, unit = 0, fallback = new Uint8Array([0, 0, 0, 255])) {
        if (!name) {
            return;
        }
        const texture = this.loadTexture(url, fallback);
        this.setTexture(name, texture, samplerTypes.SAMPLER_2D, unit);
    }
    deleteUniform(name) {
        const uniform = this._uniforms.get(name);
        if (uniform) {
            uniform.destroy();
            this._uniforms.delete(name);
        }
    }
    clearUniforms() {
        this._uniforms.forEach((v, k) => this.deleteUniform(k));
    }
    setAttribute(attr) {
        const oldAttr = this._attributes.get(attr.name);
        if (oldAttr) {
            oldAttr.destroy();
        }
        this._attributes.set(attr.name, attr);
    }
    setUniform(uniform) {
        const oldUniform = this._attributes.get(uniform.name);
        if (oldUniform) {
            oldUniform.destroy();
        }
        this._uniforms.set(uniform.name, uniform);
    }
    set() {
        this._gl.useProgram(this._program);
        this._attributes.forEach(x => x.set());
        this._uniforms.forEach(x => x.set());
    }
}

class WGLStandardProgram extends WGLProgramBase {
    get triangleCount() {
        return this._triangleCount;
    }
    set triangleCount(count) {
        this._triangleCount = Math.max(0, count);
    }
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        super(gl, vertexShaderSource, fragmentShaderSource);
    }
    render(clear = true) {
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        if (clear) {
            this.resetRender();
        }
        this.set();
        const index = this._attributes.get("index");
        if (index) {
            this._gl.drawElements(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset);
        }
        else {
            this._gl.drawArrays(this._gl.TRIANGLES, this._offset, this._triangleCount * 3);
        }
    }
    resetRender() {
        const gl = this._gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

class WGLInstancedProgram extends WGLStandardProgram {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        super(gl, vertexShaderSource, fragmentShaderSource);
        this._instanceCount = 0;
        this._extInstanced = gl.getExtension("ANGLE_instanced_arrays");
        if (!this._extInstanced) {
            this.destroy();
            throw new Error("'ANGLE_instanced_arrays' extension not supported");
        }
    }
    get instanceCount() {
        return this._instanceCount;
    }
    set instanceCount(count) {
        this._instanceCount = Math.max(0, count);
    }
    render(clear = true) {
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        if (clear) {
            this.resetRender();
        }
        this.set();
        const index = this._attributes.get("index");
        if (index) {
            this._extInstanced.drawElementsInstancedANGLE(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset, this._instanceCount);
        }
        else {
            this._extInstanced.drawArraysInstancedANGLE(this._gl.TRIANGLES, this._offset, this._triangleCount * 3, this._instanceCount);
        }
    }
    setInstancedBufferAttribute(name, data, options) {
        if (!data?.length) {
            return;
        }
        const buffer = new BufferInfo(this._gl, this._program, name, data, options, this._extInstanced);
        this.setAttribute(buffer);
    }
}

class Square {
    constructor(size = 1) {
        this._positions = new Float32Array([
            -size, -size, 0,
            size, -size, 0,
            -size, size, 0,
            size, size, 0,
        ]);
        this._normals = new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]);
        this._uvs = new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]);
        this._indices = new Uint32Array([0, 1, 2, 2, 1, 3]);
    }
    get positions() {
        return this._positions;
    }
    get normals() {
        return this._normals;
    }
    get uvs() {
        return this._uvs;
    }
    get indices() {
        return this._indices;
    }
}

class SpriteAnimationData {
    constructor(options) {
        this._dimensions = new Vec4();
        this._sceneDimensions = new Vec3();
        this._options = options;
        this._margin = Math.max(0, options.size[1], options.lineLength, options.onHoverLineLength);
        this._doubleMargin = this._margin * 2;
        const rect = new Square(1);
        this._primitive = rect;
    }
    get position() {
        return this._primitive.positions;
    }
    get uv() {
        return this._primitive.uvs;
    }
    get index() {
        return this._primitive.indices;
    }
    get triangles() {
        return this._primitive.indices.length / 3;
    }
    get length() {
        return this._length;
    }
    get iColor() {
        return this._iColors;
    }
    get iMatrix() {
        const matrices = new Float32Array(this._length * 16);
        for (let i = 0; i < this._length; i++) {
            matrices.set(this._iDataSorted[i].mat.toFloatArray(), i * 16);
        }
        return matrices;
    }
    get iUv() {
        const uvs = new Float32Array(this._length * 2);
        for (let i = 0; i < this._length; i++) {
            uvs.set(this._iDataSorted[i].uv.toFloatArray(), i * 2);
        }
        return uvs;
    }
    get sceneDimensions() {
        return this._sceneDimensions;
    }
    updateData(dimensions, pointerPosition, pointerDown, elapsedTime) {
        if (this.updateDimensions(dimensions)) {
            this.updateLength();
        }
        const { x: dx, y: dy, z: dz } = this._sceneDimensions;
        const t = elapsedTime;
        const tempV2 = new Vec2();
        for (let i = 0; i < this._length; i++) {
            const sx = this._iSizes[i * 3] / dx;
            const sy = this._iSizes[i * 3 + 1] / dy;
            const sz = this._iSizes[i * 3 + 2];
            const bx = this._iBasePositions[i * 3];
            const by = this._iBasePositions[i * 3 + 1];
            const bz = this._iBasePositions[i * 3 + 2];
            const vx = this._iVelocities[i * 3];
            const vy = this._iVelocities[i * 3 + 1];
            const vz = this._iVelocities[i * 3 + 2];
            const wz = this._iAngularVelocities[i];
            const lastDepth = this._iCurrentPositions[i * 3 + 2] || bz;
            let tz = lastDepth + vz / dz;
            if (tz > -0.001) {
                tz = -0.001;
                this._iVelocities[i * 3 + 2] = -vz;
            }
            else if (tz < -0.999) {
                tz = -0.999;
                this._iVelocities[i * 3 + 2] = -vz;
            }
            const [zdx, zdy] = this.getSceneDimensionsAtZ(tz * dz, tempV2);
            const kx = zdx / dx;
            const ky = zdy / dy;
            const x = (bx + t * vx / dx) % kx;
            const y = (by + t * vy / dy) % ky;
            const tx = (x < 0 ? x + kx : x) - kx / 2;
            const ty = (y < 0 ? y + ky : y) - ky / 2;
            this._iCurrentPositions[i * 3] = tx;
            this._iCurrentPositions[i * 3 + 1] = ty;
            this._iCurrentPositions[i * 3 + 2] = tz;
            this._iData[i].mat.reset()
                .applyRotation("z", t * wz % (2 * Math.PI))
                .applyScaling(sx, sy, sz)
                .applyTranslation(tx, ty, tz);
        }
        this._iDataSorted.sort((a, b) => a.mat.w_z - b.mat.w_z);
    }
    getSceneDimensionsAtZ(z, out) {
        const cameraZ = this._dimensions.w;
        if (z < cameraZ) {
            z -= cameraZ;
        }
        else {
            z += cameraZ;
        }
        const fov = degToRad(this._options.fov);
        const height = 2 * Math.tan(fov / 2) * Math.abs(z);
        const width = height / this._dimensions.y * this._dimensions.x;
        return out
            ? out.set(width + this._doubleMargin, height + this._doubleMargin)
            : new Vec2(width + this._doubleMargin, height + this._doubleMargin);
    }
    updateDimensions(dimensions) {
        const resChanged = !dimensions.equals(this._dimensions);
        if (resChanged) {
            this._dimensions.setFromVec4(dimensions);
            this._sceneDimensions.set(dimensions.x + this._doubleMargin, dimensions.y + this._doubleMargin, dimensions.z);
        }
        return resChanged;
    }
    updateLength() {
        const length = Math.floor(this._options.fixedNumber
            ?? this._options.density * this._sceneDimensions.x * this._sceneDimensions.y);
        if (this._length !== length) {
            const newColorsLength = length * 4;
            const newColors = new Float32Array(newColorsLength);
            const oldColors = this._iColors;
            const oldColorsLength = oldColors?.length || 0;
            const colorsIndex = Math.min(newColorsLength, oldColorsLength);
            if (oldColorsLength) {
                newColors.set(oldColors.subarray(0, colorsIndex), 0);
            }
            for (let i = colorsIndex; i < newColorsLength;) {
                const colors = getRandomArrayElement(this._options.colors);
                newColors[i++] = colors[0] / 255;
                newColors[i++] = colors[1] / 255;
                newColors[i++] = colors[2] / 255;
                newColors[i++] = this._options.fixedOpacity
                    || getRandomFloat(this._options.opacityMin ?? 0, 1);
            }
            this._iColors = newColors.sort();
            const newSizesLength = length * 3;
            const newSizes = new Float32Array(newSizesLength);
            const oldSizes = this._iSizes;
            const oldSizesLength = oldSizes?.length || 0;
            const sizesIndex = Math.min(newSizesLength, oldSizesLength);
            if (oldSizesLength) {
                newSizes.set(oldSizes.subarray(0, sizesIndex), 0);
            }
            for (let i = sizesIndex; i < newSizesLength;) {
                const size = getRandomFloat(this._options.size[0], this._options.size[1]);
                newSizes[i++] = size;
                newSizes[i++] = size;
                newSizes[i++] = 1;
            }
            this._iSizes = newSizes;
            const newBasePositionsLength = length * 3;
            const newBasePositions = new Float32Array(newBasePositionsLength);
            const oldBasePositions = this._iBasePositions;
            const oldBasePositionsLength = oldBasePositions?.length || 0;
            const basePositionsIndex = Math.min(newBasePositionsLength, oldBasePositionsLength);
            if (oldBasePositionsLength) {
                newBasePositions.set(oldBasePositions.subarray(0, basePositionsIndex), 0);
            }
            for (let i = basePositionsIndex; i < newBasePositionsLength; i += 3) {
                newBasePositions.set([getRandomFloat(0, 1), getRandomFloat(0, 1), getRandomFloat(-0.999, -0.001)], i);
            }
            this._iBasePositions = newBasePositions;
            const newVelocitiesLength = length * 3;
            const newVelocities = new Float32Array(newVelocitiesLength);
            const oldVelocities = this._iVelocities;
            const oldVelocitiesLength = oldVelocities?.length || 0;
            const velocitiesIndex = Math.min(newVelocitiesLength, oldVelocitiesLength);
            if (oldVelocitiesLength) {
                newVelocities.set(oldVelocities.subarray(0, velocitiesIndex), 0);
            }
            for (let i = velocitiesIndex; i < newVelocitiesLength;) {
                newVelocities[i++] = getRandomFloat(this._options.velocityX[0], this._options.velocityX[1]);
                newVelocities[i++] = getRandomFloat(this._options.velocityY[0], this._options.velocityY[1]);
                newVelocities[i++] = getRandomFloat(this._options.velocityZ[0], this._options.velocityZ[1]);
            }
            this._iVelocities = newVelocities;
            const newAngularVelocitiesLength = length;
            const newAngularVelocities = new Float32Array(newAngularVelocitiesLength);
            const oldAngularVelocities = this._iAngularVelocities;
            const oldAngularVelocitiesLength = oldAngularVelocities?.length || 0;
            const angularVelocitiesIndex = Math.min(newAngularVelocitiesLength, oldAngularVelocitiesLength);
            if (oldAngularVelocitiesLength) {
                newAngularVelocities.set(oldAngularVelocities.subarray(0, angularVelocitiesIndex), 0);
            }
            for (let i = angularVelocitiesIndex; i < newAngularVelocitiesLength; i++) {
                newAngularVelocities[i] = getRandomFloat(this._options.angularVelocity[0], this._options.angularVelocity[1]);
            }
            this._iAngularVelocities = newAngularVelocities;
            this._iCurrentPositions = new Float32Array(length * 3);
            const data = new Array(length);
            let t;
            for (let j = 0; j < length; j++) {
                t = j % 2 ? j + 1 : j;
                data[j] = {
                    mat: new Mat4(),
                    uv: new Vec2(this._options.textureMap[t % this._options.textureMap.length], this._options.textureMap[(t + 1) % this._options.textureMap.length]),
                };
            }
            this._iData = data;
            this._iDataSorted = data.slice();
            this._length = length;
        }
    }
}

class SpriteAnimationControl {
    constructor(gl, options) {
        this._vertexShader = `
  #pragma vscode_glsllint_stage : vert

  attribute vec4 aColorInst;
  attribute vec3 aPosition;
  attribute vec2 aUv;
  attribute vec2 aUvInst;
  attribute mat4 aMatInst;

  uniform int uTexSize;
  uniform vec2 uResolution;
  uniform mat4 uModel;
  uniform mat4 uView;
  uniform mat4 uProjection;
  
  varying vec4 vColor;
  varying vec2 vUv;

  void main() {
    vColor = aColorInst;

    float texSize = float(uTexSize);
    vUv = vec2((aUvInst.x + aUv.x) / texSize, (aUvInst.y + aUv.y) / texSize);

    gl_Position = uProjection * uView * uModel * aMatInst * vec4(aPosition, 1.0);
  }
`;
        this._fragmentShader = `
  #pragma vscode_glsllint_stage : frag  

  precision highp float;

  uniform sampler2D uTex;

  varying vec4 vColor;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTex, vUv);
    gl_FragColor = color * vColor;
  }
`;
        this._lastResolution = new Vec2();
        this._dimensions = new Vec4();
        this._gl = gl;
        const finalOptions = new SpriteAnimationOptions(options);
        this._fov = finalOptions.fov;
        this._depth = finalOptions.depth;
        this._program = new WGLInstancedProgram(gl, this._vertexShader, this._fragmentShader);
        this._data = new SpriteAnimationData(finalOptions);
        if (!finalOptions.textureUrl) {
            throw new Error("Texture URL not defined");
        }
        this._program.loadAndSet2dTexture("uTex", finalOptions.textureUrl);
        this._program.setIntUniform("uTexSize", finalOptions.textureSize || 1);
        this._program.setBufferAttribute("aPosition", this._data.position, { vectorSize: 3 });
        this._program.setBufferAttribute("aUv", this._data.uv, { vectorSize: 2 });
        this._program.setIndexAttribute(this._data.index);
    }
    prepareNextFrame(resolution, pointerPosition, pointerDown, elapsedTime) {
        const resChanged = !resolution.equals(this._lastResolution);
        if (resChanged) {
            const near = Math.tan(0.5 * Math.PI - 0.5 * degToRad(this._fov)) * resolution.y / 2;
            this.resize(resolution);
            this._program.setIntVecUniform("uResolution", resolution);
            this._lastResolution.setFromVec2(resolution);
            this._dimensions.set(resolution.x, resolution.y, this._depth, near);
            this._data.updateData(this._dimensions, pointerPosition, pointerDown, elapsedTime);
            const viewMatrix = new Mat4().applyTranslation(0, 0, -near);
            this._program.setFloatMatUniform("uView", viewMatrix);
            const outerSize = this._data.sceneDimensions;
            const modelMatrix = new Mat4()
                .applyScaling(outerSize.x, outerSize.y, this._depth);
            this._program.setFloatMatUniform("uModel", modelMatrix);
            const projectionMatrix = Mat4.buildPerspective(near, near + this._depth, -resolution.x / 2, resolution.x / 2, -resolution.y / 2, resolution.y / 2);
            this._program.setFloatMatUniform("uProjection", projectionMatrix);
            this._program.setInstancedBufferAttribute("aColorInst", this._data.iColor, { vectorSize: 4, vectorNumber: 1, divisor: 1, usage: "static" });
            this._program.setInstancedBufferAttribute("aMatInst", this._data.iMatrix, { vectorSize: 4, vectorNumber: 4, divisor: 1, usage: "dynamic" });
            this._program.setInstancedBufferAttribute("aUvInst", this._data.iUv, { vectorSize: 2, divisor: 1, usage: "dynamic" });
        }
        else {
            this._data.updateData(this._dimensions, pointerPosition, pointerDown, elapsedTime);
            this._program.updateBufferAttribute("aMatInst", this._data.iMatrix, 0);
            this._program.updateBufferAttribute("aUvInst", this._data.iUv, 0);
        }
    }
    renderFrame() {
        this._program.triangleCount = this._data.triangles;
        this._program.instanceCount = this._data.length;
        this._program.render();
    }
    clear() {
        this._program.resetRender();
    }
    destroy() {
        this._program.destroy();
        this._gl.getExtension("WEBGL_lose_context").loseContext();
    }
    resize(resolution) {
        this._gl.canvas.width = resolution.x;
        this._gl.canvas.height = resolution.y;
    }
}

function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

class WGLAnimation {
    constructor(container, options, controlType) {
        this._resolution = new Vec2();
        this._pointerPosition = new Vec2();
        this._animationStartTimeStamp = 0;
        this._lastFrameTimeStamp = 0;
        this._lastPreparationTime = 0;
        this._lastRenderTime = 0;
        this.onResize = () => {
            const dpr = window.devicePixelRatio;
            const rect = this._container.getBoundingClientRect();
            const x = Math.floor(rect.width * dpr);
            const y = Math.floor(rect.height * dpr);
            this._resolution.set(x, y);
        };
        this.onPointerMove = (e) => {
            const dpr = window.devicePixelRatio;
            const parentRect = this._container.getBoundingClientRect();
            const xRelToDoc = parentRect.left +
                document.documentElement.scrollLeft;
            const yRelToDoc = parentRect.top +
                document.documentElement.scrollTop;
            const x = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
            const y = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;
            this._pointerPosition.set(x, y);
        };
        this.onPointerDown = () => {
            this._pointerIsDown = true;
        };
        this.onPointerUp = () => {
            this._pointerIsDown = false;
        };
        this._options = options;
        this._container = container;
        this._controlType = controlType;
        this.initCanvas();
        this.initControl();
        this.addEventListeners();
    }
    destroy() {
        this.stop();
        this.removeEventListeners();
        this._control.destroy();
        this._canvas.remove();
    }
    start() {
        if (this._animationStartTimeStamp) {
            const timeSinceLastFrame = performance.now() - this._lastFrameTimeStamp;
            this._animationStartTimeStamp += timeSinceLastFrame;
        }
        this._animationTimerId = setInterval(() => {
            const framePreparationStart = performance.now();
            const elapsedTime = framePreparationStart - this._animationStartTimeStamp;
            this._control.prepareNextFrame(this._resolution, this._pointerPosition, this._pointerIsDown, elapsedTime);
            const framePreparationEnd = performance.now();
            this._lastPreparationTime = framePreparationEnd - framePreparationStart;
            requestAnimationFrame(() => {
                const frameRenderStart = performance.now();
                this._control.renderFrame();
                const frameRenderEnd = performance.now();
                this._lastFrameTimeStamp = frameRenderEnd;
                this._lastRenderTime = frameRenderEnd - frameRenderStart;
            });
        }, 1000 / this._options.expectedFps);
    }
    pause() {
        if (this._animationTimerId) {
            clearInterval(this._animationTimerId);
            this._animationTimerId = null;
        }
    }
    stop() {
        this.pause();
        this._animationStartTimeStamp = 0;
        window.setTimeout(() => this._control.clear(), 20);
    }
    initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = getRandomUuid();
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.filter = `blur(${this._options.blur}px)`;
        console.log(this._options);
        this._container.append(canvas);
        this._canvas = canvas;
        this.onResize();
    }
    initControl() {
        this._control = new this._controlType(this._canvas.getContext("webgl"), this._options);
    }
    addEventListeners() {
        this._resizeObserver = new ResizeObserver(this.onResize);
        this._resizeObserver.observe(this._container);
        this._container.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerdown", this.onPointerDown);
        window.addEventListener("pointerup", this.onPointerUp);
        window.addEventListener("blur", this.onPointerUp);
    }
    removeEventListeners() {
        this._resizeObserver.unobserve(this._container);
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
        this._container.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerdown", this.onPointerDown);
        window.removeEventListener("pointerup", this.onPointerUp);
        window.removeEventListener("blur", this.onPointerUp);
    }
}

class WGLAnimationFactory {
    static createSpriteAnimation(containerSelector, options = null) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error("Container not found");
        }
        if (window.getComputedStyle(container).getPropertyValue("position") === "static") {
            throw new Error("Container is not positioned");
        }
        const finalOptions = new SpriteAnimationOptions(options);
        return new WGLAnimation(container, finalOptions, SpriteAnimationControl);
    }
}

export { SpriteAnimationOptions, WGLAnimationFactory };
