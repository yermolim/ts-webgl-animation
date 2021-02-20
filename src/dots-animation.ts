import { getRandomUuid } from "./common";
import { IAnimation, IAnimationOptions, 
  IWebGlAnimationControlType, IWebGlAnimationControl} from "./interfaces";
import { Mat4 } from "./math/mat4";
import { Vec2 } from "./math/vec2";
import { DotAnimationOptions } from "./options";
import { Square } from "./webgl/primitives/square";
import { AnimationProgram } from "./webgl/program";

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


      requestAnimationFrame(() => {
        const frameRenderStart = performance.now();

        this._control.renderFrame();

        const frameRenderEnd = performance.now();
        this._lastFrameTimeStamp = frameRenderEnd;
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

class DotWebGlAnimationControl implements IWebGlAnimationControl {
  private readonly _vertexShader = `
    #pragma vscode_glsllint_stage : vert

    attribute vec3 aPosition;
    attribute vec4 aColor;
    attribute vec2 aUv;

    uniform vec2 uResolution;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    varying vec4 vColor;
    varying vec2 vUv;

    void main() {
      vColor = aColor;
      vUv = aUv;
      gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
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

  private _program: AnimationProgram;

  private _lastResolution = new Vec2();

  constructor(gl: WebGLRenderingContext, options: IAnimationOptions) {
    this._gl = gl;

    this.fixContext();
    this._program = new AnimationProgram(gl, this._vertexShader, this._fragmentShader);

    // set uniforms and attributes if not set (first time)
    this._program.loadAndSet2dTexture("uTex", "animals-white.png");    

    const modelMatrix = new Mat4();
    this._program.setFloatMatUniform("uModel", modelMatrix);
    const viewMatrix = new Mat4().applyTranslation(0, 0, -2);
    this._program.setFloatMatUniform("uView", viewMatrix);

    const rect = new Square(64);  
    this._program.setBufferAttribute("aPosition", rect.positions, {vectorSize: 3});
    this._program.setBufferAttribute("aColor", new Float32Array([
      1, 0, 0, 1,
      0, 1, 0, 1,
      0, 0, 1, 1,
      1, 1, 1, 1,
    ]), {vectorSize: 4});
    this._program.setBufferAttribute("aUv", rect.uvs.map(x => x / 8), {vectorSize: 2});
    this._program.setIndexAttribute(rect.indices);
    this._program.triangleCount = 2;
  }

  prepareNextFrame(resolution: Vec2, pointerPosition: Vec2, pointerDown: boolean, elapsedTime: number) {
    const resChanged = !resolution.equals(this._lastResolution);
    if (resChanged) {
      this._lastResolution.setFromVec2(resolution);

      this.resize(resolution);     
      this._program.setIntVecUniform("uResolution", resolution);
      
      const projectionMatrix = Mat4.buildPerspective(1, 10, 
        - resolution.x / 2,
        resolution.x / 2,
        - resolution.y / 2,
        resolution.y / 2,
      );
      this._program.setFloatMatUniform("uProjection", projectionMatrix);
    }

    // calc uniforms
    // set uniforms

    // DEBUG
  }

  renderFrame() {
    this._program.render();
  }

  clear() {
    this._program.clear();
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

//

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
