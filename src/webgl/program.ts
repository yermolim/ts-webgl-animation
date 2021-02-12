/* eslint-disable no-bitwise */
import { Mat, Vec } from "../math/common";
import { Attribute, BufferInfo, BufferInfoOptions, ConstantInfo, IndexInfo } from "./attributes";
import { shaderTypes, ShaderType, numberTypes, TypedArray, UniformType, uniformFloatTypes, uniformIntTypes, IndexType } from "./common";
import { Uniform, UniformFloatArrayInfo, UniformFloatInfo, UniformIntArrayInfo, UniformIntInfo } from "./uniforms";

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
    if (isNaN(s)) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, new Float32Array([s]));
    this.setAttribute(constant);
  }

  setConstantVecAttribute(name: string, v: Vec) {
    if (!v) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, v.toFloatArray());
    this.setAttribute(constant);
  }

  setConstantMatAttribute(name: string, m: Mat) {
    if (!m) {
      return;
    }
    const constant = new ConstantInfo(this._gl, this._program, name, m.toFloatArray());
    this.setAttribute(constant);
  }

  setBufferAttribute(name: string, data: TypedArray, options?: BufferInfoOptions) {
    if (!data?.length) {
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
    if (!data?.length) {
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
    const uniform = new UniformIntInfo(this._gl, this._program, 
      name, numberTypes.INT, value);
    this.setUniform(uniform);
  }
  
  setIntArrayUniform(name: string, data: Int32Array) {
    if (!data?.length) {
      return;
    }
    const uniform = new UniformIntArrayInfo(this._gl, this._program, 
      name, numberTypes.INT, data);
    this.setUniform(uniform);
  }

  setIntVecUniform(name: string, data: Vec) {
    if (!data) {
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
    const uniform = new UniformFloatInfo(this._gl, this._program, 
      name, value);
    this.setUniform(uniform);
  }
  
  setFloatArrayUniform(name: string, data: Float32Array) {
    if (!data?.length) {
      return;
    }
    const uniform = new UniformFloatArrayInfo(this._gl, this._program, 
      name, numberTypes.FLOAT, data);
    this.setUniform(uniform);
  }
  
  setFloatVecUniform(name: string, data: Vec) {
    if (!data) {
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
    if (!data) {
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
  setTexture() {
    // TODO: implement
  }

  setTextureArray() {
    // TODO: implement
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
}
