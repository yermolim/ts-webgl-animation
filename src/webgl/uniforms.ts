import { GlType, numberTypes, uniformTypes, otherDataTypes, 
  SamplerType, samplerTypes, textureTypes } from "./common";

export abstract class Uniform {
  protected _name: string;
  get name(): string {
    return this._name;
  }
  protected _type: number;
  get type(): number {
    return this._type;
  }

  protected readonly _location: WebGLUniformLocation;  
  protected readonly _gl: WebGLRenderingContext; 

  protected constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram, name: string) {    
    this._gl = gl;
    this._location = gl.getUniformLocation(program, this._name);
    this._name = name;
  }

  protected setSampleArray(target: number, unit: number, textures: WebGLTexture[]) {
  } 
  
  abstract set(): void;
}

export class UniformInfo extends Uniform { 
  protected readonly _type: GlType;
  protected readonly _values: number[];

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: GlType,
    values: number[]) { 
    super(gl, program, name);

    this._values = values;

    switch (type) {
      case numberTypes.INT:
      case numberTypes.FLOAT:
      case uniformTypes.BOOL:
        if (values.length !== 1) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case uniformTypes.INT_VEC2:
      case uniformTypes.FLOAT_VEC2:
      case uniformTypes.BOOL_VEC2:
        if (values.length !== 2) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case uniformTypes.INT_VEC3:
      case uniformTypes.FLOAT_VEC3:
      case uniformTypes.BOOL_VEC3:
        if (values.length !== 3) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case uniformTypes.INT_VEC4:
      case uniformTypes.FLOAT_VEC4:
      case uniformTypes.BOOL_VEC4:
      case uniformTypes.FLOAT_MAT2:
        if (values.length !== 4) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case uniformTypes.FLOAT_MAT3:
        if (values.length !== 9) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case uniformTypes.FLOAT_MAT4:
        if (values.length !== 16) {
          throw new Error("Wrong values array length for a defined type");
        }
        break;
      case numberTypes.UNSIGNED_INT:
      case otherDataTypes.UNSIGNED_INT_VEC2:
      case otherDataTypes.UNSIGNED_INT_VEC3:
      case otherDataTypes.UNSIGNED_INT_VEC4:
      case otherDataTypes.FLOAT_MAT2x3:
      case otherDataTypes.FLOAT_MAT2x4:
      case otherDataTypes.FLOAT_MAT3x2:
      case otherDataTypes.FLOAT_MAT3x4:
      case otherDataTypes.FLOAT_MAT4x2:
      case otherDataTypes.FLOAT_MAT4x3:
        throw new Error(`Uniforms of type '${this._type}' are not supported`);
    }
    
    this._type = type;
  }

  set() {
    switch (this._type) {
      case numberTypes.INT:
        this._gl.uniform1i(this._location, this._values[0]);
        break;
      case numberTypes.FLOAT:
        this._gl.uniform1f(this._location, this._values[0]);
        break;
      case uniformTypes.BOOL:
        this._gl.uniform1i(this._location, this._values[0]);
        break;
      case uniformTypes.INT_VEC2:
      case uniformTypes.BOOL_VEC2:
        this._gl.uniform2iv(this._location, this._values);
        break;
      case uniformTypes.INT_VEC3:
      case uniformTypes.BOOL_VEC3:
        this._gl.uniform3iv(this._location, this._values);
        break;
      case uniformTypes.INT_VEC4:
      case uniformTypes.BOOL_VEC4:
        this._gl.uniform4iv(this._location, this._values);
        break;
      case uniformTypes.FLOAT_VEC2:
        this._gl.uniform2fv(this._location, this._values);
        break;
      case uniformTypes.FLOAT_VEC3:
        this._gl.uniform3fv(this._location, this._values);
        break;
      case uniformTypes.FLOAT_VEC4:
        this._gl.uniform4fv(this._location, this._values);
        break;
      case uniformTypes.FLOAT_MAT2:
        this._gl.uniformMatrix2fv(this._location, false, this._values);
        break;
      case uniformTypes.FLOAT_MAT3:
        this._gl.uniformMatrix3fv(this._location, false, this._values);
        break;
      case uniformTypes.FLOAT_MAT4:
        this._gl.uniformMatrix4fv(this._location, false, this._values);
        break;
      case numberTypes.UNSIGNED_INT:
      case otherDataTypes.UNSIGNED_INT_VEC2:
      case otherDataTypes.UNSIGNED_INT_VEC3:
      case otherDataTypes.UNSIGNED_INT_VEC4:
      case otherDataTypes.FLOAT_MAT2x3:
      case otherDataTypes.FLOAT_MAT2x4:
      case otherDataTypes.FLOAT_MAT3x2:
      case otherDataTypes.FLOAT_MAT3x4:
      case otherDataTypes.FLOAT_MAT4x2:
      case otherDataTypes.FLOAT_MAT4x3:
        throw new Error(`Uniforms of type '${this._type}' are not supported`);
    }
  }
}

export class UniformArrayInfo extends Uniform {
  protected readonly _type: GlType;
  protected readonly _value: number[];

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: GlType,
    value: number[]) { 
    super(gl, program, name);

    this._type = type;
    this._value = value;
  }

  set() {
    switch (this._type) {
      case numberTypes.INT:
      case uniformTypes.BOOL:
        this._gl.uniform1iv(this._location, this._value);
        break;
      case numberTypes.FLOAT:
        this._gl.uniform1fv(this._location, this._value);
        break;
      case uniformTypes.INT_VEC2:
      case uniformTypes.INT_VEC3:
      case uniformTypes.INT_VEC4:
      case uniformTypes.FLOAT_VEC2:
      case uniformTypes.FLOAT_VEC3:
      case uniformTypes.FLOAT_VEC4:
      case uniformTypes.FLOAT_MAT2:
      case uniformTypes.FLOAT_MAT3:
      case uniformTypes.FLOAT_MAT4:
      case uniformTypes.BOOL_VEC2:
      case uniformTypes.BOOL_VEC3:
      case uniformTypes.BOOL_VEC4:
        throw new Error(`Uniforms of type '${this._type}' are not supported as array uniform.
          Use 'INT', 'FLOAT', or 'BOOL' uniform array`);
      case numberTypes.UNSIGNED_INT:
      case otherDataTypes.UNSIGNED_INT_VEC2:
      case otherDataTypes.UNSIGNED_INT_VEC3:
      case otherDataTypes.UNSIGNED_INT_VEC4:
      case otherDataTypes.FLOAT_MAT2x3:
      case otherDataTypes.FLOAT_MAT2x4:
      case otherDataTypes.FLOAT_MAT3x2:
      case otherDataTypes.FLOAT_MAT3x4:
      case otherDataTypes.FLOAT_MAT4x2:
      case otherDataTypes.FLOAT_MAT4x3:
        throw new Error(`Uniforms of type '${this._type}' are not supported`);
    }
  }
}

export abstract class Texture extends Uniform {
  protected readonly _type: SamplerType;
  protected readonly _unit: number;
  protected readonly _target: number;

  protected constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: SamplerType,
    unit: number) {
    super(gl, program, name);    

    switch (this._type) {
      case samplerTypes.SAMPLER_2D:
      case samplerTypes.SAMPLER_2D_SHADOW:
      case samplerTypes.INT_SAMPLER_2D:
      case samplerTypes.UNSIGNED_INT_SAMPLER_2D:
        this._target = textureTypes.TEXTURE_2D;
        break;
      case samplerTypes.SAMPLER_3D:
      case samplerTypes.INT_SAMPLER_3D:
      case samplerTypes.UNSIGNED_INT_SAMPLER_3D:
        this._target = textureTypes.TEXTURE_3D;
        break;
      case samplerTypes.SAMPLER_2D_ARRAY:
      case samplerTypes.SAMPLER_2D_ARRAY_SHADOW:
      case samplerTypes.INT_SAMPLER_2D_ARRAY:
      case samplerTypes.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        this._target = textureTypes.TEXTURE_2D_ARRAY;
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

export class TextureInfo extends Texture {
  //#region WebGL2
  // sampler?: WebGLSampler;
  //#endregion
  protected readonly _target: number;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: SamplerType,
    unit: number,
    public readonly texture: WebGLTexture) { 
    super(gl, program, name, type, unit);    
  }
  
  set() {
    this._gl.uniform1i(location, this._unit);
    this._gl.activeTexture(textureTypes.TEXTURE0 + this._unit);
    this._gl.bindTexture(this._target, this.texture);
  }
}

export class TextureArrayInfo extends Texture {
  //#region WebGL2
  // sampler?: WebGLSampler;
  //#endregion
  protected readonly _target: number;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: SamplerType,
    unit: number,
    public readonly textures: WebGLTexture[]) { 
    super(gl, program, name, type, unit);
  }
  
  set() {
    const units = new Int32Array(this.textures.length);
    for (let i = 0; i < this.textures.length; i++) {
      units[i] = this._unit + i;
    }    
    this._gl.uniform1iv(location, units);

    this.textures.forEach((x, i) => {
      this._gl.activeTexture(textureTypes.TEXTURE0 + units[i]);
      this._gl.bindTexture(this._target, x); 
      //#region WebGL2
      // gl.bindSampler(unit, sampler);
      //#endregion
    });
  }
}
