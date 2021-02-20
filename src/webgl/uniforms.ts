import { numberTypes, SamplerType, samplerTypes, textureTypes,
  UniformFloatType, uniformFloatTypes,
  UniformIntType, uniformIntTypes } from "./common";

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
    this._location = gl.getUniformLocation(program, name);
    this._name = name;
  }

  protected setSampleArray(target: number, unit: number, textures: WebGLTexture[]) {
  } 
  
  abstract set(): void;
  
  abstract destroy(): void; 
}

export class UniformIntInfo extends Uniform { 
  protected readonly _type: 5124 | 35670;
  protected readonly _value: number;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: 5124 | 35670, // INT | BOOL
    value: number) { 
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

export class UniformFloatInfo extends Uniform { 
  protected readonly _type = 5126;
  protected readonly _value: number;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    value: number) { 
    super(gl, program, name);

    this._value = value;
  }

  set() {
    this._gl.uniform1f(this._location, this._value);
  }
  
  destroy() {
    
  }
}

export class UniformIntArrayInfo extends Uniform { 
  protected readonly _type: UniformIntType;
  protected readonly _values: Int32Array;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: UniformIntType,
    values: Int32Array) { 
    super(gl, program, name);

    this._values = values;

    switch (type) {
      case numberTypes.INT:
      case numberTypes.BOOL:
        // do nothing
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

export class UniformFloatArrayInfo extends Uniform {  
  protected readonly _type: UniformFloatType;
  protected readonly _values: Float32Array;

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    type: UniformFloatType,
    values: Float32Array) { 
    super(gl, program, name);

    this._values = values;

    switch (type) {
      case numberTypes.FLOAT:
        // do nothing
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

export abstract class Texture extends Uniform {
  protected readonly _type: SamplerType;
  protected readonly _unit: number;
  protected readonly _target: number;
  protected readonly _sampler: WebGLSampler;

  protected constructor(gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    unit: number,
    type: SamplerType,
    sampler?: WebGLSampler) {
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
      // WebGL2
      // case samplerTypes.SAMPLER_3D:
      // case samplerTypes.INT_SAMPLER_3D:
      // case samplerTypes.UNSIGNED_INT_SAMPLER_3D:
      //   this._target = textureTypes.TEXTURE_3D;
      //   break;
      // case samplerTypes.SAMPLER_2D_ARRAY:
      // case samplerTypes.SAMPLER_2D_ARRAY_SHADOW:
      // case samplerTypes.INT_SAMPLER_2D_ARRAY:
      // case samplerTypes.UNSIGNED_INT_SAMPLER_2D_ARRAY:
      //   this._target = textureTypes.TEXTURE_2D_ARRAY;
      //   break;
      default:
        throw new Error(`Unsupported sampler type ${type}`);
    }
    this._type = type;
    this._unit = unit;
  }  
}

export class TextureInfo extends Texture {
  protected readonly _target: number;
  protected readonly _texture: WebGLTexture; 

  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    unit: number,
    texture: WebGLTexture, 
    type: SamplerType,   
    sampler?: WebGLSampler,
  ) { 
    super(gl, program, name, unit, type, sampler);    
    this._texture = texture;
  }
  
  set() {
    this._gl.uniform1i(this._location, this._unit);

    this._gl.activeTexture(textureTypes.TEXTURE0 + this._unit);
    this._gl.bindTexture(this._target, this._texture);      
    // WebGL2
    // this._gl.bindSampler(this._unit, this._sampler);
  }
  
  destroy() {
    this._gl.deleteTexture(this._texture);
  }
}

export class TextureArrayInfo extends Texture {
  protected readonly _target: number;
  protected readonly _textures: WebGLTexture[];


  constructor (gl: WebGLRenderingContext, 
    program: WebGLProgram,
    name: string,
    unit: number,
    textures: WebGLTexture[],  
    type: SamplerType,    
    sampler?: WebGLSampler,
  ) { 
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
      // WebGL2
      // this._gl.bindSampler(unit, this._sampler);
    });
  }
 
  destroy() {
    this._textures.forEach(x => this._gl.deleteTexture(x));
  }
}
