/* eslint-disable no-bitwise */
import { Mat, Vec } from "../math/common";
import { Attribute, BufferInfo, ConstantInfo } from "./attributes";
import { shaderTypes, ShaderType, numberTypes, TypedArray, UniformType, uniformFloatTypes, uniformIntTypes } from "./common";
import { Uniform, UniformFloatArrayInfo, UniformFloatInfo, UniformIntArrayInfo, UniformIntInfo } from "./uniforms";

export class AnimationProgram {

  private readonly _gl: WebGLRenderingContext;
  private readonly _program: WebGLProgram;

  private readonly _vertexShader: WebGLShader;
  private readonly _fragmentShader: WebGLShader;

  private readonly _attributes = new Map<string, Attribute>();
  private readonly _uniforms = new Map<string, Uniform>();
  
  constructor (gl: WebGLRenderingContext, 
    vertexShaderSource: string, fragmentShaderSource: string) {

    const vertexShader = AnimationProgram.loadShader(gl, shaderTypes.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = AnimationProgram.loadShader(gl, shaderTypes.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // TODO: bind attribute locations and varyings
    
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

  render(offset: number, count: number, clear = true) {
    if (clear) {
      this.clear();
    }

    this._gl.useProgram(this._program);

    this._attributes.forEach(x => x.set());
    this._uniforms.forEach(x => x.set());

    this._gl.drawArrays(this._gl.TRIANGLES, offset * 3, count * 3);
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
    const constant = new ConstantInfo(this._gl, this._program, name,
      numberTypes.FLOAT, 1, s);
    this.setAttribute(constant);
  }

  setConstantVecAttribute(name: string, v: Vec) {
    if (!v) {
      return;
    }
    const values = v.toFloatArray();
    const constant = new ConstantInfo(this._gl, this._program, name,
      numberTypes.FLOAT, <2|3|4>values.length, ...values);
    this.setAttribute(constant);
  }

  setBufferAttribute(name: string, data: TypedArray,
    vectorSize: 1 | 2 | 3 | 4 = 1, vectorNumber: 1 | 2 | 3 | 4 = 1,
    stride = 0, offset = 0, normalize = false,) {
    if (!data?.length) {
      return;
    }
    const buffer = new BufferInfo(this._gl, this._program, name,
      data, vectorSize, vectorNumber, stride, offset, normalize);
    this.setAttribute(buffer);
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

  private setAttribute(attr: Attribute) {
    const oldAttr = this._attributes.get(attr.name);
    if (oldAttr) {
      oldAttr.destroy();
    }
    this._attributes.set(attr.name, attr);
  }

  private setUniform(uniform: Uniform) {    
    const oldUniform = this._attributes.get(uniform.name);
    if (oldUniform) {
      oldUniform.destroy();
    }
    this._uniforms.set(uniform.name, uniform);
  }
}
