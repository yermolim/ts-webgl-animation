import { WGLProgramBase } from "./wgl-program-base";
  
const SIMPLE_VERTEX_SHADER = `
attribute vec4 aPosition;
void main() {
  gl_Position = aPosition;
}`;

export abstract class WGLGpGPUProgram extends WGLProgramBase {
  protected readonly _width: number;
  protected readonly _height: number;
  protected readonly _dataLength: number;

  protected readonly _gl: WebGLRenderingContext;
  protected _frameBuffer: WebGLFramebuffer;
  protected _outputTexture: WebGLTexture;
  
  constructor (gl: WebGLRenderingContext, fragmentShaderSource: string, 
    width: number, height?: number, outputTexture: WebGLTexture = null) {
    super(gl, SIMPLE_VERTEX_SHADER, fragmentShaderSource);

    if (!width) {
      throw new Error("Mandatory parameter not provided");
    }

    this._width = width;
    this._height = width || height;
    this._dataLength = height * width * 4;

    if (!gl.getExtension("OES_texture_float")
      || !gl.getExtension("WEBGL_color_buffer_float")) {        
      throw new Error("Float texture extensions not available");
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize && maxTextureSize < Math.max(width, height)) {
      throw new Error("Max texture size exceeded");
    }   
    
    this._frameBuffer = gl.createFramebuffer();
    this._outputTexture = outputTexture || this.createCalcTexture();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, 
      this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._outputTexture, 0);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    const positions = new Float32Array([
      -1, 1,  1, -1,  -1, 1,
      -1, 1,  1, -1,  1, 1,
    ]);
    super.setBufferAttribute("aPosition", positions, {vectorSize: 2});
    this._triangleCount = 2;
  }  
  
  render() {
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.viewport(0, 0, this._width, this._height);
    this._gl.drawArrays(this._gl.TRIANGLES, this._offset, this._triangleCount * 3);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }
  
  //#region attributes
  setConstantScalarAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }
  setConstantVecAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }
  setConstantMatAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }
  setBufferAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  } 
  setIndexAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }  
  updateBufferAttribute(): void { 
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }  
  deleteAttribute() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }
  clearAttributes() {
    throw new Error("GpGpuAnimationProgram doesn't support setting attributes");
  }
  //#endregion  

  protected createUnfilteredTexture(type: number, 
    data: Float32Array | Uint8Array = null): WebGLTexture {
    if (data && data.length !== this._dataLength) {
      throw new Error("Invalid data length");
    }

    const texture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this._width,
      this._height,
      0,
      this._gl.RGBA,
      type,
      data,
    );
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    return texture;
  }  

  abstract createCalcTexture(): WebGLTexture;
}

export class WGLGpGPUFloatProgram extends WGLGpGPUProgram {
  protected readonly _width: number;
  protected readonly _height: number;
  protected readonly _dataLength: number;

  protected readonly _gl: WebGLRenderingContext;
  protected _frameBuffer: WebGLFramebuffer;
  protected _outputTexture: WebGLTexture;
  
  constructor (gl: WebGLRenderingContext, fragmentShaderSource: string, 
    width: number, height?: number, outputTexture: WebGLTexture = null) {
    super(gl, fragmentShaderSource, width, height, outputTexture);

    if (!gl.getExtension("OES_texture_float")
      || !gl.getExtension("WEBGL_color_buffer_float")) {        
      throw new Error("Float texture extensions not available");
    }
  }  

  readPixels(): Float32Array {
    const {width, height} = this._gl.canvas;
    const result = new Float32Array(width * height * 4);
    
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.readPixels(0, 0, width, height, this._gl.RGBA, this._gl.FLOAT, result);    
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    return result;
  }  

  createCalcTexture(data: Float32Array = null): WebGLTexture {
    return this.createUnfilteredTexture(this._gl.FLOAT, data);
  }
}

export class WGLGpGPUByteProgram extends WGLGpGPUProgram {
  protected readonly _width: number;
  protected readonly _height: number;
  protected readonly _dataLength: number;

  protected readonly _gl: WebGLRenderingContext;
  protected _frameBuffer: WebGLFramebuffer;
  protected _outputTexture: WebGLTexture;
  
  constructor (gl: WebGLRenderingContext, fragmentShaderSource: string, 
    width: number, height?: number, outputTexture: WebGLTexture = null) {
    super(gl, fragmentShaderSource, width, height, outputTexture);
  }  

  readPixels(): Uint8Array {
    const {width, height} = this._gl.canvas;
    const result = new Uint8Array(width * height * 4);
    
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
    this._gl.readPixels(0, 0, width, height, this._gl.RGBA, this._gl.UNSIGNED_BYTE, result);    
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

    return result;
  }  

  createCalcTexture(data: Uint8Array = null): WebGLTexture {
    return this.createUnfilteredTexture(this._gl.UNSIGNED_BYTE, data);
  }
}
