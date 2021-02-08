import { NumberType, numberTypes, numberSizes, bufferTypes, TypedArray } from "./common";

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
  readonly _type: NumberType;
  readonly _name: string;
  readonly size: 1 | 2 | 3 | 4;

  readonly x: number;
  readonly y: number;  
  readonly z: number;
  readonly w: number;

  constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    name: string,
    type?: NumberType, 
    size?: 1 | 2 | 3 | 4,
    x?: number, 
    y?: number, 
    z?: number,
    w?: number);
  constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    name: string, 
    type?: NumberType, 
    size?: 1 | 2 | 3 | 4,
    ...values: number[]) {
    super(gl, program, name);
    
    this._type = type || numberTypes.FLOAT;
    this.size = size || 1;

    if (values?.length) {
      this.x = values[0] || 0;
      this.y = values[1] || 0;
      this.z = values[2] || 0;
      this.w = values[3] || 0;
    } else {      
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    }
  }
  
  set(): void {
    this._gl.disableVertexAttribArray(this._location);
    switch (this._type) {
      //#region WebGL2
      // case numberTypes.INT:
      //   switch (value.size) {
      //     case 4:
      //       gl.vertexAttribI4i(index, value.x, value.y, value.z, value.w);
      //       break;
      //     default:      
      //       throw new Error("Incorrect constant value length");
      //   }  
      //   break;
      // case numberTypes.UNSIGNED_INT:
      //   switch (value.size) {
      //     case 4:
      //       gl.vertexAttribI4ui(index, value.x, value.y, value.z, value.w);
      //       break;
      //     default:      
      //       throw new Error("Incorrect constant value length");
      //   }  
      //   break;
      //#endregion
      case numberTypes.FLOAT:
        switch (this.size) {
          case 1:
            this._gl.vertexAttrib1f(this._location, this.x);
            break;
          case 2:
            this._gl.vertexAttrib2f(this._location, this.x, this.y);
            break;
          case 3:
            this._gl.vertexAttrib3f(this._location, this.x, this.y, this.z);
            break;
          case 4:
            this._gl.vertexAttrib4f(this._location, this.x, this.y, this.z, this.w);
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

export class BufferInfo<T extends TypedArray> extends Attribute {
  readonly vectorOffset: number;
  protected readonly _buffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext,
    program: WebGLProgram, 
    name: string,
    data: T,
    public vectorSize: 1 | 2 | 3 | 4 = 1,
    public vectorNumber: 1 | 2 | 3 | 4 = 1, // for matrices
    public stride = 0,
    public offset = 0,
    public normalize = false,
    //public divisor?: number
  ) {
    super(gl, program, name);

    let type: NumberType;
    if (data instanceof Int8Array) {
      type = numberTypes.BYTE;
    } else if (data instanceof Uint8Array 
      || data instanceof Uint8ClampedArray) {
      type = numberTypes.UNSIGNED_BYTE;
    } else if (data instanceof Int16Array) {
      type = numberTypes.SHORT;
    } else if (data instanceof Uint16Array) {
      type = numberTypes.UNSIGNED_SHORT;
    } else if (data instanceof Int32Array) {
      type = numberTypes.INT;
    } else if (data instanceof Uint32Array) {
      type = numberTypes.UNSIGNED_INT;
    } else if (data instanceof Float32Array) {
      type = numberTypes.FLOAT;
    } else {
      throw new Error("Unsupported data array type");
    }
    this._type = type;

    this._buffer = gl.createBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let minStride = 0;
    if (vectorNumber !== 1) {
      minStride = vectorSize * vectorNumber * numberSizes[type];
      this.vectorOffset = this.stride / vectorNumber;
    } else {      
      this.vectorOffset = 0;
    }   
    if (stride < minStride) {
      this.stride = minStride;
    } else if (stride > 255) {
      this.stride = 255;
    }
  }

  set(): void { 
    this._gl.bindBuffer(bufferTypes.ARRAY_BUFFER, this._buffer);  

    for (let i = 0, j = this._location; i < this.vectorNumber; i++, j++) {
      this._gl.enableVertexAttribArray(j);
      this._gl.vertexAttribPointer(j, 
        this.vectorSize, 
        this._type, 
        this.normalize,
        this.stride, 
        this.offset + i * this.vectorOffset,
      );
      //#region WebGL2
      // if (bufferInfo.divisor) { 
      //   gl.vertexAttribDivisor(index, bufferInfo.divisor);
      // }
      //#endregion
    }
  }  

  destroy() {
    this._gl.deleteBuffer(this._buffer);
  }
}
