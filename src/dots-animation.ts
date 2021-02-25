import { getRandomUuid } from "./common";
import { IAnimation, IAnimationOptions, 
  IWebGlAnimationControlType, IWebGlAnimationControl} from "./interfaces";
import { degToRad, getRandomArrayElement, getRandomFloat, Vec } from "./math/common";
import { Mat4 } from "./math/mat4";
import { Vec2 } from "./math/vec2";
import { Vec3 } from "./math/vec3";
import { Vec4 } from "./math/vec4";
import { DotAnimationOptions } from "./options";
import { bufferUsageTypes } from "./webgl/common";
import { Primitive } from "./webgl/primitives/common";
import { Square } from "./webgl/primitives/square";
import { InstancedAnimationProgram } from "./webgl/program";


class AnimationWebGl implements IAnimation {
  private _options: IAnimationOptions;
  private _controlType: IWebGlAnimationControlType;
  
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _control: IWebGlAnimationControl;

  private _resizeObserver: ResizeObserver;  
  private _resolution = new Vec2();
  private _pointerPosition = new Vec2();
  private _pointerIsDown: boolean;

  private _animationTimerId: number;  
  private _animationStartTimeStamp = 0;
  private _lastFrameTimeStamp = 0;
  
  private _lastPreparationTime = 0;
  private _lastRenderTime = 0;

  constructor(container: HTMLElement, options: IAnimationOptions, 
    controlType: IWebGlAnimationControlType) {  

    this._options = options;
    this._container = container;
    this._controlType = controlType;

    this.initCanvas();
    this.initControl();
    this.addEventListeners();
  }

  destroy() {
    this.stop();
    this.removeEventListeners();

    this._control.destroy();
    this._canvas.remove();
  }

  // #region animation playback
  start() {   
    if (this._animationStartTimeStamp) { // that means animation was paused
      const timeSinceLastFrame = performance.now() - this._lastFrameTimeStamp;
      this._animationStartTimeStamp += timeSinceLastFrame; // shift animation start timestamp by pause length
    }

    this._animationTimerId = setInterval(() => {     
      const framePreparationStart = performance.now();
      const elapsedTime = framePreparationStart - this._animationStartTimeStamp;
      this._control.prepareNextFrame(this._resolution, this._pointerPosition, this._pointerIsDown, elapsedTime);
      const framePreparationEnd = performance.now();
      this._lastPreparationTime = framePreparationEnd - framePreparationStart;
      
      requestAnimationFrame(() => {
        const frameRenderStart = performance.now();
        this._control.renderFrame();
        const frameRenderEnd = performance.now();
        this._lastFrameTimeStamp = frameRenderEnd;
        this._lastRenderTime = frameRenderEnd - frameRenderStart;
      });
    }, 1000/this._options.expectedFps);
  }

  pause() {    
    if (this._animationTimerId) {
      clearInterval(this._animationTimerId);
      this._animationTimerId = null;
    }
  }

  stop() {
    this.pause();
    this._animationStartTimeStamp = 0;
    window.setTimeout(() => this._control.clear(), 20);
  }
  //#endregion

  // #region event handlers
  onResize = () => {
    const dpr = window.devicePixelRatio;
    const rect = this._container.getBoundingClientRect();
    const x = Math.floor(rect.width * dpr);
    const y = Math.floor(rect.height * dpr);
    this._resolution.set(x, y);
  };

  onPointerMove = (e: PointerEvent) => {
    const dpr = window.devicePixelRatio;

    const parentRect = this._container.getBoundingClientRect();
    const xRelToDoc = parentRect.left +
            document.documentElement.scrollLeft;
    const yRelToDoc = parentRect.top +
            document.documentElement.scrollTop;

    const x = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
    const y = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;

    this._pointerPosition.set(x, y);
  };

  onPointerDown = () => {
    this._pointerIsDown = true;
  };

  onPointerUp = () => {
    this._pointerIsDown = false;
  };
  // #endregion

  private initCanvas() {   
    const canvas =  document.createElement("canvas");
    canvas.id = getRandomUuid();
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.filter = `blur(${this._options.blur}px)`;

    this._container.append(canvas);
    this._canvas = canvas;

    this.onResize();
  }
    
  private initControl() {
    this._control = new this._controlType(this._canvas.getContext("webgl"), this._options);
  }

  private addEventListeners() {
    this._resizeObserver = new ResizeObserver(this.onResize);
    this._resizeObserver.observe(this._container);

    this._container.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("blur", this.onPointerUp);
  }

  private removeEventListeners() {
    this._resizeObserver.unobserve(this._container);
    this._resizeObserver.disconnect();
    this._resizeObserver = null;

    this._container.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("blur", this.onPointerUp);
  }
}

class DotAnimationWebGlData {
  private _primitive: Primitive;
  get position(): Float32Array {
    return this._primitive.positions;
  }
  get uv(): Float32Array {
    return this._primitive.uvs;
  }
  get index(): Uint32Array {
    return this._primitive.indices;
  }
  get triangles(): number {
    return this._primitive.indices.length / 3;
  }

  private _length: number;
  get length(): number {
    return this._length;
  }

  private _iColors: Float32Array; // length x4
  get color(): Float32Array {
    return this._iColors;
  }
  private _iSizes: Float32Array; // length x3
  private _iBasePositions: Float32Array; // length x3
  private _iVelocities: Float32Array; // length x3
  private _iAngularVelocities: Float32Array; // length

  private _iCurrentPositions: Float32Array; // length x3
  private _iMatrices: Mat4[]; 
  get matrix(): Float32Array {  
    // TODO: optimize  
    const matrices = new Float32Array(this._length * 16);
    for (let i = 0; i < this._length; i++) {
      matrices.set(this._iMatrices[i].toFloatArray(), i * 16);
    }
    return matrices;
  }

  private _options: DotAnimationOptions;

  private _margin: number;
  private _doubleMargin: number;  
  
  private _dimensions = new Vec4();  
  private _sceneDimensions = new Vec3();
  get sceneDimensions(): Vec3 {
    return this._sceneDimensions;
  }

  constructor(options: DotAnimationOptions) { 
    this._options = options;

    this._margin = Math.max(0, options.size[1], options.lineLength, options.onHoverLineLength);
    this._doubleMargin = this._margin * 2;

    const rect = new Square(1);
    this._primitive = rect;
  }

  updateData(dimensions: Vec4, pointerPosition: Vec2, 
    pointerDown: boolean, elapsedTime: number) {  

    if (this.updateDimensions(dimensions)) {
      this.updateLength();
    }

    const {x: dx, y: dy, z: dz} = this._sceneDimensions;
    const t = elapsedTime;
    const tempV2 = new Vec2(); // a temp vec2 for the scene dimensions at a given Z

    for (let i = 0; i < this._length; i++) {      
      const sx = this._iSizes[i * 3] / dx; // instance width in px
      const sy = this._iSizes[i * 3 + 1] / dy; // instance height in px
      const sz = this._iSizes[i * 3 + 2]; // instance depth in px
      
      const bx = this._iBasePositions[i * 3];
      const by = this._iBasePositions[i * 3 + 1];
      const bz = this._iBasePositions[i * 3 + 2];
      
      const vx = this._iVelocities[i * 3];
      const vy = this._iVelocities[i * 3 + 1];
      const wz = this._iAngularVelocities[i];

      // get visible bound factor for the given Z (kx = ky = 1 at Z = 0)
      const [zdx, zdy] = this.getSceneDimensionsAtZ(bz * dz, tempV2);
      const kx = zdx / dx;
      const ky = zdy / dy;

      // update positions
      // keep instances inside the scene using remainder operator
      const x = (bx + t * vx / dx) % kx;
      const y = (by + t * vy / dy) % ky;

      // translate instance taking into account that the scene center should be at 0,0
      const tx = (x < 0 ? x + kx : x) - kx / 2;
      const ty = (y < 0 ? y + ky : y) - ky / 2;
      const tz = bz;

      // set current positions for further processing
      this._iCurrentPositions[i * 3] = tx;
      this._iCurrentPositions[i * 3 + 1] = ty;
      this._iCurrentPositions[i * 3 + 2] = tz;

      // update instance matrices
      this._iMatrices[i].reset()
        .applyRotation("z", t * wz % (2 * Math.PI))
        .applyScaling(sx, sy, sz)
        .applyTranslation(tx, ty, tz);
    }

    // sort instance matrices by depth
    this._iMatrices.sort((a, b) => a.w_z - b.w_z);
  }

  private getSceneDimensionsAtZ(z: number, out?: Vec2): Vec2 {
    const cameraZ = this._dimensions.w;
    if (z < cameraZ) {
      z -= cameraZ;
    } else {
      z += cameraZ;
    }
  
    const fov = degToRad(this._options.fov); 
    const height = 2 * Math.tan(fov / 2) * Math.abs(z);
    const width = height / this._dimensions.y * this._dimensions.x;

    return out
      ? out.set(width + this._doubleMargin, height + this._doubleMargin)
      : new Vec2(width + this._doubleMargin, height + this._doubleMargin);
  }

  private updateDimensions(dimensions: Vec4): boolean {    
    const resChanged = !dimensions.equals(this._dimensions);
    if (resChanged) {
      this._dimensions.setFromVec4(dimensions);
      // scene dimensions include margins to prevent flickering at the view borders
      this._sceneDimensions.set(
        dimensions.x + this._doubleMargin,
        dimensions.y + this._doubleMargin,
        dimensions.z,
      );
    }
    return resChanged;
  }

  private updateLength() {
    const length = Math.floor(this._options.fixedNumber 
      ?? this._options.density * this._sceneDimensions.x * this._sceneDimensions.y);
    if (this._length !== length) {
      // update instance arrays

      // colors
      const newColorsLength = length * 4;
      const newColors = new Float32Array(newColorsLength);
      const oldColors = this._iColors;
      const oldColorsLength = oldColors?.length || 0;
      const colorsIndex = Math.min(newColorsLength, oldColorsLength);
      if (oldColorsLength) {
        newColors.set(oldColors.subarray(0, colorsIndex), 0);
      }
      for (let i = colorsIndex; i < newColorsLength;) {
        const colors = getRandomArrayElement(this._options.colors);
        newColors[i++] = colors[0] / 255;
        newColors[i++] = colors[1] / 255;
        newColors[i++] = colors[2] / 255;
        newColors[i++] = this._options.fixedOpacity 
          || getRandomFloat(this._options.opacityMin ?? 0, 1);
      }        
      this._iColors = newColors.sort();
      
      // sizes
      const newSizesLength = length * 3;
      const newSizes = new Float32Array(newSizesLength);
      const oldSizes = this._iSizes;
      const oldSizesLength = oldSizes?.length || 0;
      const sizesIndex = Math.min(newSizesLength, oldSizesLength);
      if (oldSizesLength) {
        newSizes.set(oldSizes.subarray(0, sizesIndex), 0);
      }
      for (let i = sizesIndex; i < newSizesLength;) {
        const size = getRandomFloat(this._options.size[0], this._options.size[1]);
        newSizes[i++] = size;
        newSizes[i++] = size;
        newSizes[i++] = 1;
      }        
      this._iSizes = newSizes;

      // basePositions
      const newBasePositionsLength = length * 3;
      const newBasePositions = new Float32Array(newBasePositionsLength);
      const oldBasePositions = this._iBasePositions;
      const oldBasePositionsLength = oldBasePositions?.length || 0;
      const basePositionsIndex = Math.min(newBasePositionsLength, oldBasePositionsLength);
      if (oldBasePositionsLength) {
        newBasePositions.set(oldBasePositions.subarray(0, basePositionsIndex), 0);
      }      
      for (let i = basePositionsIndex; i < newBasePositionsLength; i += 3) {
        newBasePositions.set([getRandomFloat(0, 1), getRandomFloat(0, 1), getRandomFloat(-1, 0)], i);
      }
      this._iBasePositions = newBasePositions;      

      // velocities
      const newVelocitiesLength = length * 3;
      const newVelocities = new Float32Array(newVelocitiesLength);
      const oldVelocities = this._iVelocities;
      const oldVelocitiesLength = oldVelocities?.length || 0;
      const velocitiesIndex = Math.min(newVelocitiesLength, oldVelocitiesLength);
      if (oldVelocitiesLength) {
        newVelocities.set(oldVelocities.subarray(0, velocitiesIndex), 0);
      }
      for (let i = velocitiesIndex; i < newVelocitiesLength;) {
        newVelocities[i++] = getRandomFloat(this._options.velocityX[0], this._options.velocityX[1]);
        newVelocities[i++] = getRandomFloat(this._options.velocityY[0], this._options.velocityY[1]);
        newVelocities[i++] = 1;
      }
      this._iVelocities = newVelocities;
      
      // angular velocities
      const newAngularVelocitiesLength = length;
      const newAngularVelocities = new Float32Array(newAngularVelocitiesLength);
      const oldAngularVelocities = this._iAngularVelocities;
      const oldAngularVelocitiesLength = oldAngularVelocities?.length || 0;
      const angularVelocitiesIndex = Math.min(newAngularVelocitiesLength, oldAngularVelocitiesLength);
      if (oldAngularVelocitiesLength) {
        newAngularVelocities.set(oldAngularVelocities.subarray(0, angularVelocitiesIndex), 0);
      }
      for (let i = angularVelocitiesIndex; i < newAngularVelocitiesLength; i++) {
        newAngularVelocities[i] = getRandomFloat(
          this._options.angularVelocity[0], 
          this._options.angularVelocity[1]);
      }
      this._iAngularVelocities = newAngularVelocities;

      this._iCurrentPositions = new Float32Array(length * 3);

      const matrices: Mat4[] = new Array(length);
      for (let j = 0; j < length; j++) {
        matrices[j] = new Mat4();
      }
      this._iMatrices = matrices;

      this._length = length;
    }
  }
} 

class DotWebGlAnimationControl implements IWebGlAnimationControl {
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
  private _program: InstancedAnimationProgram;

  private _textureMap: number[];

  private _fov: number;
  private _depth: number;
  private _lastResolution = new Vec2();
  private _dimensions = new Vec4();

  private _data: DotAnimationWebGlData;

  constructor(gl: WebGLRenderingContext, options: IAnimationOptions) {
    this._gl = gl;
    this.fixContext();

    this._fov = options.fov;
    this._depth = options.depth;

    this._program = new InstancedAnimationProgram(gl, this._vertexShader, this._fragmentShader);
    this._data = new DotAnimationWebGlData(options);

    // set uniforms
    if (!options.textureUrl) {
      throw new Error("Texture URL not defined");
    }
    this._textureMap = options.textureMap;
    this._program.loadAndSet2dTexture("uTex", options.textureUrl);    
    this._program.setIntUniform("uTexSize", options.textureSize || 1); // atlas row tile count
    
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
      
      const projectionMatrix = Mat4.buildPerspective(near, near + this._depth + 1, 
        -resolution.x / 2, resolution.x / 2, -resolution.y / 2, resolution.y / 2);
      this._program.setFloatMatUniform("uProjection", projectionMatrix); 
      //#endregion  

      //#region buffers
      this._program.setInstancedBufferAttribute("aMatInst", this._data.matrix, 
        {vectorSize: 4, vectorNumber: 4, divisor: 1, usage: bufferUsageTypes.DYNAMIC_DRAW});

      this._program.setInstancedBufferAttribute("aColorInst", this._data.color, 
        {vectorSize: 4, vectorNumber: 1, divisor: 1, usage: bufferUsageTypes.STATIC_DRAW}); 

      const textureMapArray = new Float32Array(this._data.length * 2);
      for (let i = 0; i < textureMapArray.length; i++) {
        textureMapArray[i] = this._textureMap[i % this._textureMap.length];
      }
      this._program.setInstancedBufferAttribute("aUvInst", textureMapArray,
        {vectorSize: 2, divisor: 1, usage: bufferUsageTypes.STATIC_DRAW});   
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
    }

    // console.log(Math.max(...this._data.matrix.filter((x, i) => !(i % 12))));
    // console.log(Math.max(...this._data.matrix.filter((x, i) => !(i % 13))));
    // console.log(Math.max(...this._data.matrix.filter((x, i) => !(i % 14))));

    this._program.updateBufferAttribute("aMatInst", this._data.matrix, 0);
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

  private fixContext() { 
    // restore context if lost   
    if (this._gl.isContextLost()) {
      this._gl.getExtension("WEBGL_lose_context").restoreContext();
    }
  }
}

class AnimationFactory {
  static createDotsAnimation(containerSelector: string, options: any = null): IAnimation {    

    const container = document.querySelector(containerSelector);
    if (!container) { 
      throw new Error("Container not found");
    }
    if (window.getComputedStyle(container).getPropertyValue("position") === "static") {      
      throw new Error("Container is not positioned");
    }

    const combinedOptions = new DotAnimationOptions(options);    
    return new AnimationWebGl(container as HTMLElement, combinedOptions, DotWebGlAnimationControl);
  }
}

export { IAnimation, AnimationFactory };
