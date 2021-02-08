/* eslint-disable no-bitwise */
import { Vec } from "../math/common";
import { Attribute, BufferInfo, ConstantInfo } from "./attributes";
import { shaderTypes, ShaderType, numberTypes, TypedArray } from "./common";
import { Uniform } from "./uniforms";

export class AnimationProgram {

  private readonly _gl: WebGLRenderingContext;
  private readonly _program: WebGLProgram;

  private readonly _attributes = new Map<string, Attribute>();
  private readonly _uniforms = new Map<string, Uniform>();
  
  constructor (gl: WebGLRenderingContext, 
    vertexShaderSource: string, fragmentShaderSource: string) {

    const vertexShader = AnimationProgram.loadShader(gl, shaderTypes.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = AnimationProgram.loadShader(gl, shaderTypes.VERTEX_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // TODO: bind attribute locations and varyings
    
    gl.linkProgram(program);
    const result = gl.getProgramParameter(program, gl.LINK_STATUS);    
    if (!result) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error("Error while linking program: " + log);
    }

    this._gl = gl;
    this._program = program;
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

  render() {
    this._gl.cullFace(this._gl.BACK);
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    this._gl.useProgram(this._program);

    this._attributes.forEach(x => x.set());
    this._uniforms.forEach(x => x.set());
  }
  
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
    const values = v.toTypedArray();
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

  setUniform(name: string) {

  }

  deleteAttribute(name: string) {
    const attribute = this._attributes.get(name);
    if (attribute) {
      attribute.destroy();
      this._attributes.delete(name);
    }
  }

  deleteUniform(name: string) {
    this._uniforms.delete(name);    
  }

  clearAttributes() {
    this._attributes.forEach((v, k) => this.deleteAttribute(k));
  }

  clearUniforms() {
    this._uniforms.clear();
  }

  private setAttribute(attr: Attribute) {
    const oldAttr = this._attributes.get(attr.name);
    if (oldAttr) {
      oldAttr.destroy();
    }
    this._attributes.set(attr.name, attr);
  }
}
