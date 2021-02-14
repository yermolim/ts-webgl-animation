import { TypedArray, NumberType, numberTypes, numberSizes, 
  bufferTypes, BufferUsageType, bufferUsageTypes, getNumberTypeByArray } from "./common";

export interface BufferInfoOptions {  
  usage?: BufferUsageType;
  vectorSize?: 1 | 2 | 3 | 4;
  vectorNumber?: 1 | 2 | 3 | 4;
  stride?: number;
  offset?: number;
  normalize?: boolean;
  divisor?: number;
}

export abstract class Attribute {
  protected _name: string;
  get name(): string {
    return this._name;
  }
  protected _type: NumberType;
  get type(): NumberType {
    return this._type;
  }

  protected readonly _location: number;  
  protected readonly _gl: WebGLRenderingContext;

  protected constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram, name: string) {
    this._gl = gl;
    this._location = gl.getAttribLocation(program, name);
    this._name = name;
  }

  abstract set(): void; 
  
  abstract destroy(): void; 
}

export class ConstantInfo extends Attribute {
  protected readonly _size: number;
  protected readonly _values: TypedArray;

  constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    name: string, 
    values: TypedArray) {
    super(gl, program, name);
    
    this._type = getNumberTypeByArray(values);

    this._size = values.length;
    if (![1, 2, 3, 4, 9, 16].includes(this._size)) {
      throw new Error("Incorrect constant value length");
    }
  }
  
  set(): void {
    this._gl.disableVertexAttribArray(this._location);
    switch (this._type) {
      case numberTypes.FLOAT:
        switch (this._size) {
          case 1:
            this._gl.vertexAttrib1f(this._location, this._values[0]);
            break;
          case 2:
            this._gl.vertexAttrib2fv(this._location, <Float32Array>this._values);
            break;
          case 3:
            this._gl.vertexAttrib3fv(this._location, <Float32Array>this._values);
            break;
          case 4:
            this._gl.vertexAttrib4fv(this._location, <Float32Array>this._values);
            break;
          case 9:
            const [
              a, b, c, 
              d, e, f, 
              g, h, i
            ] = this._values;
            this._gl.vertexAttrib3f(this._location, a, b, c);
            this._gl.vertexAttrib3f(this._location + 1, d, e, f);
            this._gl.vertexAttrib3f(this._location + 2, g, h, i);
            break;
          case 16:
            const [
              x_x, x_y, x_z, x_w, 
              y_x, y_y, y_z, y_w,
              z_x, z_y, z_z, z_w, 
              w_x, w_y, w_z, w_w
            ] = this._values;
            this._gl.vertexAttrib4f(this._location, x_x, x_y, x_z, x_w);
            this._gl.vertexAttrib4f(this._location + 1, y_x, y_y, y_z, y_w);
            this._gl.vertexAttrib4f(this._location + 2, z_x, z_y, z_z, z_w);
            this._gl.vertexAttrib4f(this._location + 3, w_x, w_y, w_z, w_w);
            break;
          default:  
            // execution shouldn't be here 
            throw new Error("Incorrect constant value length");
        }  
        break;
      //#region WebGL2
      // case numberTypes.INT:
      //   switch (value.size) {
      //     case 4:
      //       gl.vertexAttribI4i(this._location, <Int32Array>this._values);
      //       break;
      //     default:      
      //       throw new Error("Incorrect constant value length");
      //   }  
      //   break;
      // case numberTypes.UNSIGNED_INT:
      //   switch (value.size) {
      //     case 4:
      //       gl.vertexAttribI4ui(this._location, <Uint32Array>this._values);
      //       break;
      //     default:      
      //       throw new Error("Incorrect constant value length");
      //   }  
      //   break;
      //#endregion
      default:
        throw new Error("Unsupported constant attribute type");
    }
  }

  destroy() {
    
  }
}

export class BufferInfo<T extends TypedArray> extends Attribute {
  private static readonly defaultOptions: BufferInfoOptions = { 
    usage: bufferUsageTypes.STATIC_DRAW,
    vectorSize: 1,
    vectorNumber: 1,
    stride: 0,
    offset: 0,
    normalize: false,
  };

  protected readonly _buffer: WebGLBuffer;

  protected _vectorSize: 1 | 2 | 3 | 4;
  protected _vectorNumber: 1 | 2 | 3 | 4; // for matrices
  protected _stride: number;
  protected _offset: number;
  protected _normalize: boolean;

  protected _divisor: number;
  protected _instancedExt: ANGLE_instanced_arrays;

  protected _vectorOffset: number;

  constructor(gl: WebGLRenderingContext,
    program: WebGLProgram, 
    name: string,
    data: T,
    options?: BufferInfoOptions,
    instancedExt?: ANGLE_instanced_arrays) {
    super(gl, program, name);

    this._type = getNumberTypeByArray(data); 
    
    const { usage, vectorSize, vectorNumber, stride, offset, 
      normalize, divisor, divisor: instancedStep } = Object.assign(BufferInfo.defaultOptions, options); 
    let minStride = 0;    
    if (vectorNumber !== 1) {
      minStride = vectorSize * vectorNumber * numberSizes[this.type];
      this._vectorOffset = this._stride / vectorNumber;
    } else {      
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
  
  updateData(data: T, offset: number): void { 
    this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);
    this._gl.bufferSubData(bufferTypes.ARRAY_BUFFER, offset, data);
  }  

  set(): void { 
    this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);  

    for (let i = 0, j = this._location; i < this._vectorNumber; i++, j++) {
      this._gl.enableVertexAttribArray(j);
      this._gl.vertexAttribPointer(j, 
        this._vectorSize, 
        this._type, 
        this._normalize,
        this._stride, 
        this._offset + i * this._vectorOffset,
      );

      //WebGL1
      if (this._divisor && this._instancedExt) {
        this._instancedExt.vertexAttribDivisorANGLE(this._location, this._divisor);
      }
      //WebGL2
      // if (this._divisor) {      
      //   this._gl.vertexAttribDivisor(this._location, this._divisorr);
      // }
    }
  }  

  destroy() {
    this._gl.deleteBuffer(this._buffer);
  }
}

export class IndexInfo<T extends TypedArray> extends Attribute {
  readonly vectorOffset: number;
  protected readonly _buffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext,
    program: WebGLProgram,
    data: T) {
    super(gl, program, "index");

    let type: NumberType;
    if (data instanceof Uint8Array 
      || data instanceof Uint8ClampedArray) {
      type = numberTypes.UNSIGNED_BYTE;
    } else if (data instanceof Uint16Array) {
      type = numberTypes.UNSIGNED_SHORT;
    } else if (data instanceof Uint32Array) {
      type = numberTypes.UNSIGNED_INT;
    } else {
      throw new Error("Unsupported index type");
    }
    this._type = type;

    this._buffer = gl.createBuffer();
    this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);  
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  set(): void { 
    this._gl.bindBuffer(bufferTypes.ELEMENT_ARRAY_BUFFER, this._buffer);
  }  

  destroy() {
    this._gl.deleteBuffer(this._buffer);
  }
}
