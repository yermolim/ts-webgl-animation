import { BufferInfoOptions, BufferInfo } from "./program-data/attributes";
import { TypedArray } from "./program-data/common";
import { WGLStandardProgram } from "./wgl-standard-program";

export class WGLInstancedProgram extends WGLStandardProgram {
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
      this.resetRender();
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
