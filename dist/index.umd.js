(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotsAnim = {}));
}(this, (function (exports) { 'use strict';

    function getRandomUuid() {
        return crypto.getRandomValues(new Uint32Array(4)).join("-");
    }

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
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

    class DotAnimationOptions {
        constructor(item = null) {
            this.expectedFps = 60;
            this.number = null;
            this.density = 0.00005;
            this.dprDependentDensity = true;
            this.dprDependentDimensions = true;
            this.minR = 1;
            this.maxR = 6;
            this.minSpeedX = -0.5;
            this.maxSpeedX = 0.5;
            this.minSpeedY = -0.5;
            this.maxSpeedY = 0.5;
            this.blur = 1;
            this.fill = true;
            this.colorsFill = ["#ffffff", "#fff4c1", "#faefdb"];
            this.opacityFill = null;
            this.opacityFillMin = 0;
            this.opacityFillStep = 0;
            this.stroke = false;
            this.colorsStroke = ["#ffffff"];
            this.opacityStroke = 1;
            this.opacityStrokeMin = 0;
            this.opacityStrokeStep = 0;
            this.drawLines = true;
            this.lineColor = "#717892";
            this.lineLength = 150;
            this.lineWidth = 2;
            this.actionOnClick = true;
            this.actionOnHover = true;
            this.onClickCreate = false;
            this.onClickMove = true;
            this.onHoverMove = true;
            this.onHoverDrawLines = true;
            this.onClickCreateNDots = 10;
            this.onClickMoveRadius = 200;
            this.onHoverMoveRadius = 50;
            this.onHoverLineRadius = 150;
            if (item) {
                Object.assign(this, item);
            }
        }
    }

    class Rect {
        constructor(size = 1) {
            this._positions = new Float32Array([
                -size, -size, 0, 1,
                size, -size, 0, 1,
                -size, size, 0, 1,
                size, size, 0, 1,
            ]);
            this._normals = new Float32Array([
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            ]);
            this._uvs = new Float32Array([
                0, 0,
                1, 0,
                0, 1,
                1, 1,
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
            const { usage, vectorSize, vectorNumber, stride, offset, normalize, divisor, divisor: instancedStep } = Object.assign(BufferInfo.defaultOptions, options);
            let minStride = 0;
            if (vectorNumber !== 1) {
                minStride = vectorSize * vectorNumber * numberSizes[this.type];
                this._vectorOffset = this._stride / vectorNumber;
            }
            else {
                this._vectorOffset = 0;
            }
            this._vectorSize = vectorSize;
            this._vectorNumber = vectorNumber;
            this._offset = offset;
            this._stride = Math.min(255, Math.max(minStride, stride));
            this._normalize = normalize;
            this._divisor = divisor;
            this._instancedExt = instancedExt;
            this._buffer = gl.createBuffer();
            gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
            gl.bufferData(bufferTypes.ARRAY_BUFFER, data, usage);
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
                    this._instancedExt.vertexAttribDivisorANGLE(this._location, this._divisor);
                }
            }
        }
        destroy() {
            this._gl.deleteBuffer(this._buffer);
        }
    }
    BufferInfo.defaultOptions = {
        usage: bufferUsageTypes.STATIC_DRAW,
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
            this._location = gl.getUniformLocation(program, this._name);
            this._name = name;
        }
        get name() {
            return this._name;
        }
        get type() {
            return this._type;
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
            switch (this._type) {
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
            this._gl.uniform1i(location, this._unit);
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
            this._gl.uniform1iv(location, units);
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

    class AnimationProgram {
        constructor(gl, vertexShaderSource, fragmentShaderSource) {
            this._attributes = new Map();
            this._uniforms = new Map();
            this._offset = 0;
            this._triangleCount = 0;
            const vertexShader = AnimationProgram.loadShader(gl, shaderTypes.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = AnimationProgram.loadShader(gl, shaderTypes.FRAGMENT_SHADER, fragmentShaderSource);
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
        get triangleCount() {
            return this._triangleCount;
        }
        set triangleCount(count) {
            this._triangleCount = Math.max(0, count);
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
        render(clear = true) {
            if (clear) {
                this.clear();
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
        clear() {
            this._gl.cullFace(this._gl.BACK);
            this._gl.enable(this._gl.CULL_FACE);
            this._gl.enable(this._gl.DEPTH_TEST);
            this._gl.clearColor(0, 0, 0, 0);
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
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
        createTexture(data, type, texelFormal, texelType, width, height) {
            if (data instanceof Uint8Array) {
                if (texelType !== texelTypes.UNSIGNED_BYTE) {
                    throw new Error("Invalid texel type");
                }
            }
            else if (!(data instanceof Uint16Array)) {
                throw new Error("Invalid data array type");
            }
            if (data.length !== width * height) {
                throw new Error("Invalid data array length");
            }
            const gl = this._gl;
            const texture = gl.createTexture();
            gl.bindTexture(type, texture);
            gl.texImage2D(type, 0, texelFormal, width, height, 0, texelFormal, texelType, data);
            if (isPowerOf2(width) && isPowerOf2(height)) {
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
        createAndSet2dTexture(name, data, type, texelFormal, texelType, width, height, unit = 0) {
            if (!name) {
                return;
            }
            const texture = this.createTexture(data, type, texelFormal, texelType, width, height);
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

    class AnimationWebGl {
        constructor(container, options, controlType) {
            this._resolution = new Vec2();
            this._pointerPosition = new Vec2();
            this._animationStartTimeStamp = 0;
            this._lastFrameTimeStamp = 0;
            this._lastFrameTime = 0;
            this._lastFramePreparationTime = 0;
            this._lastFrameRenderTime = 0;
            this.onResize = (e) => {
                const dpr = window.devicePixelRatio;
                const rect = this._container.getBoundingClientRect();
                const x = rect.width * dpr;
                const y = rect.height * dpr;
                this._canvas.width = x;
                this._canvas.height = y;
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
            this.onPointerDown = (e) => {
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
                this._lastFramePreparationTime = performance.now() - framePreparationStart;
                requestAnimationFrame(() => {
                    const frameRenderStart = performance.now();
                    this._control.renderFrame();
                    const frameRenderEnd = performance.now();
                    this._lastFrameTimeStamp = frameRenderEnd;
                    this._lastFrameRenderTime = frameRenderEnd - frameRenderStart;
                    this._lastFrameTime = frameRenderEnd - framePreparationStart;
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
            this._container.append(canvas);
            this._canvas = canvas;
            this.onResize(null);
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
    class DotWebGlAnimationControl {
        constructor(gl, options) {
            this._vertexShader = `
    #pragma vscode_glsllint_stage : vert

    attribute vec4 position;
    attribute vec4 color;

    uniform vec2 resolution;
    
    varying vec4 vColor;

    void main() {
      vColor = color;
      gl_Position = position;
    }
  `;
            this._fragmentShader = `
    #pragma vscode_glsllint_stage : frag  

    precision highp float;

    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;
            this._options = options;
            this._gl = gl;
            this.fixContext();
            this._program = new AnimationProgram(gl, this._vertexShader, this._fragmentShader);
            const initialResolution = new Vec2(this._gl.canvas.width, this._gl.canvas.height);
            this._program.setIntVecUniform("resolution", initialResolution);
            const rect = new Rect(0.5);
            this._program.setBufferAttribute("position", rect.positions, { vectorSize: 4 });
            this._program.setBufferAttribute("color", new Float32Array([
                1, 0, 0, 1,
                0, 1, 0, 1,
                0, 0, 1, 1,
                1, 1, 1, 1,
            ]), { vectorSize: 4 });
            this._program.setIndexAttribute(rect.indices);
            this._program.triangleCount = 2;
        }
        prepareNextFrame(resolution, pointerPosition, pointerDown, elapsedTime) {
            const resChanged = this.resize(resolution);
            if (resChanged) {
                this._program.setIntVecUniform("resolution", resolution);
            }
        }
        renderFrame() {
            this._program.render();
        }
        clear() {
            this._program.clear();
        }
        destroy() {
            this._program.destroy();
            this._gl.getExtension("WEBGL_lose_context").loseContext();
        }
        resize(resolution) {
            let changed = false;
            if (this._gl.canvas.width !== resolution.x) {
                this._gl.canvas.width = resolution.x;
                changed = true;
            }
            if (this._gl.canvas.height !== resolution.y) {
                this._gl.canvas.height = resolution.y;
                changed || (changed = true);
            }
            return changed;
        }
        fixContext() {
            if (this._gl.isContextLost()) {
                this._gl.getExtension("WEBGL_lose_context").restoreContext();
            }
        }
    }
    class AnimationFactory {
        static createDotsAnimation(containerSelector, options = null) {
            const container = document.querySelector(containerSelector);
            if (!container) {
                throw new Error("Container not found");
            }
            if (window.getComputedStyle(container).getPropertyValue("position") === "static") {
                throw new Error("Container is not positioned");
            }
            const combinedOptions = new DotAnimationOptions(options);
            return new AnimationWebGl(container, combinedOptions, DotWebGlAnimationControl);
        }
    }

    exports.AnimationFactory = AnimationFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
