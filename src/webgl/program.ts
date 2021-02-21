/* eslint-disable no-bitwise */
import { isPowerOf2, Mat, Vec } from "../math/common";
import { Attribute, BufferInfo, BufferInfoOptions, ConstantInfo, IndexInfo } from "./attributes";
import { shaderTypes, ShaderType, numberTypes, TypedArray, 
  UniformType, uniformFloatTypes, uniformIntTypes, 
  SamplerType, samplerTypes, TexelFormat, TexelType, texelTypes } from "./common";
import { TextureArrayInfo, TextureInfo, Uniform, 
  UniformFloatArrayInfo, UniformFloatInfo, 
  UniformIntArrayInfo, UniformIntInfo } from "./uniforms";

export class AnimationProgram {  
  protected readonly _extIndexed: OES_element_index_uint;

  protected readonly _gl: WebGLRenderingContext;
  protected readonly _program: WebGLProgram;

  protected readonly _vertexShader: WebGLShader;
  protected readonly _fragmentShader: WebGLShader;

  protected readonly _attributes = new Map<string, Attribute>();
  protected readonly _uniforms = new Map<string, Uniform>();

  protected _offset = 0;
  get offset(): number {
    return this._offset;
  }
  set offset(count: number) {
    this._offset = Math.max(0, count);
  }

  protected _triangleCount = 0;
  get triangleCount(): number {
    return this._triangleCount;
  }
  set triangleCount(count: number) {
    this._triangleCount = Math.max(0, count);
  }

  constructor (gl: WebGLRenderingContext, 
    vertexShaderSource: string, fragmentShaderSource: string) {

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

  private static loadShader(gl: WebGLRenderingContext, 
    shaderType: ShaderType, shaderSource: string): WebGLShader {

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
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    if (clear) {
      this.clear();
    }
    this.set();

    const index = this._attributes.get("index");
    if (index) {
      this._gl.drawElements(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset);
    } else {
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
  
  //#region attributes
  setConstantScalarAttribute(name: string, s: number) {
    if (!name || isNaN(s)) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, new Float32Array([s]));
    this.setAttribute(constant);
  }

  setConstantVecAttribute(name: string, v: Vec) {
    if (!name || !v) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, v.toFloatArray());
    this.setAttribute(constant);
  }

  setConstantMatAttribute(name: string, m: Mat) {
    if (!name || !m) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, m.toFloatArray());
    this.setAttribute(constant);
  }

  setBufferAttribute(name: string, data: TypedArray, options?: BufferInfoOptions) {
    if (!name || !data?.length) {
      return;
    }
    const buffer = new BufferInfo(this._gl, this._program, name,
      data, options);
    this.setAttribute(buffer);
  }  
  
  setIndexAttribute(data: Uint8Array | Uint8Array | Uint16Array | Uint32Array) {
    if (!data?.length) {
      return;
    }

    if (!this._extIndexed && data instanceof Uint32Array) {
      throw new Error("'OES_element_index_uint' extension not supported");
    }

    const buffer = new IndexInfo(this._gl, this._program, data);
    this.setAttribute(buffer);
  }
  
  updateBufferAttribute(name: string, data: TypedArray, offset: number): void { 
    if (!name || !data) {
      return;
    }

    const attribute = this._attributes.get(name);
    if (!(attribute instanceof BufferInfo)) {
      return;
    }
    attribute.updateData(data, offset);
  }  

  deleteAttribute(name: string) {
    const attribute = this._attributes.get(name);
    if (attribute) {
      attribute.destroy();
      this._attributes.delete(name);
    }
  }

  clearAttributes() {
    this._attributes.forEach((v, k) => this.deleteAttribute(k));
  }
  //#endregion
    
  //#region uniforms

  //#region bool
  setBoolUniform(name: string, value: boolean) {
    const uniform = new UniformIntInfo(this._gl, this._program, 
      name, numberTypes.INT, value ? 1 : 0);
    this.setUniform(uniform);
  }
  
  setBoolArrayUniform(name: string, data: boolean[]) {
    if (!name || !data?.length) {
      return;
    }
    const values = new Int32Array(data.length);
    for (let i = 0; i < data.length; i++) {      
      values[i] = data[i] ? 1 : 0;
    }
    const uniform = new UniformIntArrayInfo(this._gl, this._program, 
      name, numberTypes.BOOL, values);
    this.setUniform(uniform);
  }
  //#endregion

  //#region int
  setIntUniform(name: string, value: number) {
    if (!name || isNaN(value)) {
      return;
    }

    const uniform = new UniformIntInfo(this._gl, this._program, 
      name, numberTypes.INT, value);
    this.setUniform(uniform);
  }
  
  setIntArrayUniform(name: string, data: Int32Array) {
    if (!name || !data?.length) {
      return;
    }
    const uniform = new UniformIntArrayInfo(this._gl, this._program, 
      name, numberTypes.INT, data);
    this.setUniform(uniform);
  }

  setIntVecUniform(name: string, data: Vec) {
    if (!name || !data) {
      return;
    }
    let type: UniformType;
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
        // execution shouldn't not be here
        throw new Error("Incorrect vector length");
    }
    const uniform = new UniformIntArrayInfo(this._gl, this._program, 
      name, type, data.toIntArray());
    this.setUniform(uniform);
  }
  //#endregion
  
  //#region float
  setFloatUniform(name: string, value: number) {
    if (!name || isNaN(value)) {
      return;
    }

    const uniform = new UniformFloatInfo(this._gl, this._program, 
      name, value);
    this.setUniform(uniform);
  }
  
  setFloatArrayUniform(name: string, data: Float32Array) {
    if (!name || !data?.length) {
      return;
    }
    const uniform = new UniformFloatArrayInfo(this._gl, this._program, 
      name, numberTypes.FLOAT, data);
    this.setUniform(uniform);
  }
  
  setFloatVecUniform(name: string, data: Vec) {
    if (!name || !data) {
      return;
    }
    let type: UniformType;
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
        // execution shouldn't not be here
        throw new Error("Incorrect vector length");
    }
    const uniform = new UniformFloatArrayInfo(this._gl, this._program, 
      name, type, data.toFloatArray());
    this.setUniform(uniform);
  }

  setFloatMatUniform(name: string, data: Mat) {
    if (!name || !data) {
      return;
    }
    let type: UniformType;
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
        // execution shouldn't not be here
        throw new Error("Incorrect matrix length");
    }
    const uniform = new UniformFloatArrayInfo(this._gl, this._program, 
      name, type, data.toFloatArray());
    this.setUniform(uniform);
  }
  //#endregion

  //#region texture
  createTexture(data: Uint8Array | Uint16Array, type: SamplerType, 
    texelFormal: TexelFormat, texelType: TexelType,
    width: number, height: number): WebGLTexture {

    if (data instanceof Uint8Array) {
      if (texelType !== texelTypes.UNSIGNED_BYTE) {
        throw new Error("Invalid texel type");
      }
    } else if (!(data instanceof Uint16Array)) {
      throw new Error("Invalid data array type");
    }

    if (data.length !== width * height) {      
      throw new Error("Invalid data array length");
    }

    const gl = this._gl;
    
    const texture = gl.createTexture();
    gl.bindTexture(type, texture);
    gl.texImage2D(type, 0, texelFormal, width, height, 0, 
      texelFormal, texelType, data);
    
    if (isPowerOf2(width) && isPowerOf2(height)) {
      gl.generateMipmap(type);
    } else {
      gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    return texture;
  }
  
  loadTexture(url: string, fallback = new Uint8Array([0, 0, 0, 255])): WebGLTexture {
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
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      width, height, border, srcFormat, srcType,
      fallback);
  
    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image);
  
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;

    return texture;
  }

  setTexture(name: string, texture: WebGLTexture, 
    type: SamplerType = samplerTypes.SAMPLER_2D, unit = 0) {
    if (!name || !texture) {
      return;
    }

    const uniform = new TextureInfo(this._gl, this._program, name, unit, texture, type);
    this._uniforms.set(name, uniform);
  }

  setTextureArray(name: string, textures: WebGLTexture[], 
    type: SamplerType = samplerTypes.SAMPLER_2D, unit = 0) {
    if (!name || !textures?.length) {
      return;
    }

    const uniform = new TextureArrayInfo(this._gl, this._program, name, unit, textures, type);
    this._uniforms.set(name, uniform);
  }
  
  createAndSet2dTexture(name: string, data: Uint8Array | Uint16Array, type: SamplerType, 
    texelFormal: TexelFormat, texelType: TexelType,
    width: number, height: number, unit = 0) {     
    if (!name) {
      return;
    }

    const texture = this.createTexture(data, type, texelFormal, texelType, width, height);
    this.setTexture(name, texture, type, unit);
  }

  loadAndSet2dTexture(name: string, url: string, unit = 0, fallback = new Uint8Array([0, 0, 0, 255])) {
    if (!name) {
      return;
    }

    const texture = this.loadTexture(url, fallback);
    this.setTexture(name, texture, samplerTypes.SAMPLER_2D, unit);
  }
  //#endregion

  deleteUniform(name: string) {
    const uniform = this._uniforms.get(name);
    if (uniform) {
      uniform.destroy();
      this._uniforms.delete(name);
    }    
  }

  clearUniforms() {
    this._uniforms.forEach((v, k) => this.deleteUniform(k));
  }
  //#endregion

  protected setAttribute(attr: Attribute) {
    const oldAttr = this._attributes.get(attr.name);
    if (oldAttr) {
      oldAttr.destroy();
    }
    this._attributes.set(attr.name, attr);
  }

  protected setUniform(uniform: Uniform) {    
    const oldUniform = this._attributes.get(uniform.name);
    if (oldUniform) {
      oldUniform.destroy();
    }
    this._uniforms.set(uniform.name, uniform);
  }

  protected set() {
    this._gl.useProgram(this._program);
    this._attributes.forEach(x => x.set());
    this._uniforms.forEach(x => x.set());
  }
}

export class InstancedAnimationProgram extends AnimationProgram {
  private readonly _extInstanced: ANGLE_instanced_arrays;

  private _instanceCount = 0;
  get instanceCount(): number {
    return this._instanceCount;
  }
  set instanceCount(count: number) {
    this._instanceCount = Math.max(0, count);
  }
    
  constructor (gl: WebGLRenderingContext, 
    vertexShaderSource: string, fragmentShaderSource: string) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this._extInstanced = gl.getExtension("ANGLE_instanced_arrays"); 
    if (!this._extInstanced) {
      this.destroy();
      throw new Error("'ANGLE_instanced_arrays' extension not supported");
    }
  } 

  render(clear = true) {
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    
    if (clear) {
      this.clear();
    }
    this.set();
    
    const index = this._attributes.get("index");
    if (index) {
      this._extInstanced.drawElementsInstancedANGLE(this._gl.TRIANGLES, this._triangleCount * 3,
        index.type, this._offset, this._instanceCount);
    } else {
      this._extInstanced.drawArraysInstancedANGLE(this._gl.TRIANGLES, this._offset,
        this._triangleCount * 3, this._instanceCount);
    }
  }
  
  setInstancedBufferAttribute(name: string, data: TypedArray, options?: BufferInfoOptions) {
    if (!data?.length) {
      return;
    }

    const buffer = new BufferInfo(this._gl, this._program, name,
      data, options, this._extInstanced);
    this.setAttribute(buffer);
  }  
}
