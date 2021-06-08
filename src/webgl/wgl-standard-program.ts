/* eslint-disable no-bitwise */
import { WGLProgramBase } from "./wgl-program-base";

/**
 * WebGL program wrapper for drawing non-instanced graphics
 */
export class WGLStandardProgram extends WGLProgramBase {
  get triangleCount(): number {
    return this._triangleCount;
  }
  set triangleCount(count: number) {
    this._triangleCount = Math.max(0, count);
  }

  constructor (gl: WebGLRenderingContext, 
    vertexShaderSource: string, 
    fragmentShaderSource: string) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }

  render(clear = true) {
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    if (clear) {
      this.resetRender();
    }
    this.set();

    const index = this._attributes.get("index");
    if (index) {
      this._gl.drawElements(this._gl.TRIANGLES, this._triangleCount * 3, index.type, this._offset);
    } else {
      this._gl.drawArrays(this._gl.TRIANGLES, this._offset, this._triangleCount * 3);
    }
  }

  resetRender() {   
    const gl = this._gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
