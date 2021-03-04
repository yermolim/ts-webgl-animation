import { IWGLAnimationControl, AnimationOptions } from "../interfaces";
import { degToRad } from "../math/common";
import { Mat4 } from "../math/mat4";
import { Vec2 } from "../math/vec2";
import { Vec4 } from "../math/vec4";
import { WGLInstancedProgram } from "../webgl/wgl-instanced-program";
import { SpriteAnimationData } from "./sprite-animation-data";
import { SpriteAnimationOptions } from "./sprite-animation-options";

const BILLBOARD = `
vec3 billboard(vec2 offset, mat4 view) {
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 pos = right * offset.x + up * offset.y; 
  return pos;
}
`;

export class SpriteAnimationControl implements IWGLAnimationControl {
  private readonly _vertexShader = `
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

  private readonly _fragmentShader = `
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

  private _gl: WebGLRenderingContext;
  private _program: WGLInstancedProgram;

  private _fov: number;
  private _depth: number;
  private _lastResolution = new Vec2();
  private _dimensions = new Vec4();

  private _data: SpriteAnimationData;

  constructor(gl: WebGLRenderingContext, options: AnimationOptions) {
    this._gl = gl;    
    const finalOptions = new SpriteAnimationOptions(options);   

    this._fov = finalOptions.fov;
    this._depth = finalOptions.depth;

    this._program = new WGLInstancedProgram(gl, this._vertexShader, this._fragmentShader);
    this._data = new SpriteAnimationData(finalOptions);

    // set uniforms
    if (!finalOptions.textureUrl) {
      throw new Error("Texture URL not defined");
    }
    this._program.loadAndSet2dTexture("uTex", finalOptions.textureUrl);    
    this._program.setIntUniform("uTexSize", finalOptions.textureSize || 1); // atlas row tile count
  
    this._program.setBufferAttribute("aPosition", this._data.position, {vectorSize: 3});
    this._program.setBufferAttribute("aUv", this._data.uv, {vectorSize: 2});
    this._program.setIndexAttribute(this._data.index);    
  }

  prepareNextFrame(resolution: Vec2, pointerPosition: Vec2, pointerDown: boolean, elapsedTime: number) {
    const resChanged = !resolution.equals(this._lastResolution);
    if (resChanged) {   
    // TODO: move to options
      const near = Math.tan(0.5 * Math.PI - 0.5 * degToRad(this._fov)) * resolution.y / 2;

      //update dimensions
      this.resize(resolution);     
      this._program.setIntVecUniform("uResolution", resolution);

      this._lastResolution.setFromVec2(resolution);
      this._dimensions.set(resolution.x, resolution.y, this._depth, near);
    
      // update data
      this._data.updateData(this._dimensions, pointerPosition, pointerDown, elapsedTime);  
    
      //#region  matrices
      const viewMatrix = new Mat4().applyTranslation(0, 0, -near);
      this._program.setFloatMatUniform("uView", viewMatrix);

      const outerSize = this._data.sceneDimensions;
      const modelMatrix = new Mat4()
      // .applyTranslation(-0.5, -0.5, 0)
        .applyScaling(outerSize.x, outerSize.y, this._depth);
      this._program.setFloatMatUniform("uModel", modelMatrix);
    
      const projectionMatrix = Mat4.buildPerspective(near, near + this._depth, 
        -resolution.x / 2, resolution.x / 2, -resolution.y / 2, resolution.y / 2);
      this._program.setFloatMatUniform("uProjection", projectionMatrix); 
      //#endregion  

      //#region buffers
      this._program.setInstancedBufferAttribute("aColorInst", this._data.iColor, 
        {vectorSize: 4, vectorNumber: 1, divisor: 1, usage: "static"}); 
      this._program.setInstancedBufferAttribute("aMatInst", this._data.iMatrix, 
        {vectorSize: 4, vectorNumber: 4, divisor: 1, usage: "dynamic"});
      this._program.setInstancedBufferAttribute("aUvInst", this._data.iUv,
        {vectorSize: 2, divisor: 1, usage: "dynamic"});
      //#endregion   
      
    //#region debug
    // const vec = new Vec3(1, 1, 0);
    // console.log(vec);
    // const inst = new Mat4().set(...this._data.matrix.slice(0, 16));
    // console.log(inst);
    // const view = new Mat4().applyTranslation(0, 0, -near);
    // console.log(view);
    // console.log(vec.applyMat4(inst));
    // console.log(vec.applyMat4(modelMatrix));
    // console.log(vec.applyMat4(view));
    // console.log(vec.applyMat4(projectionMatrix));
    //#endregion
    } else {
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
    // force loosing context
    this._gl.getExtension("WEBGL_lose_context").loseContext();
  }

  private resize(resolution: Vec2) {
    this._gl.canvas.width = resolution.x;
    this._gl.canvas.height = resolution.y;
  }
}
