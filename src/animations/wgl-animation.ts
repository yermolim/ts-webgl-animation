import { getRandomUuid } from "../common";
import { IAnimation, AnimationOptions, IWGLAnimationControlType, 
  IWGLAnimationControl } from "./wgl-animation-interfaces";
import { Vec2 } from "mathador";

export class WGLAnimation implements IAnimation {
  private _options: AnimationOptions;
  private _controlType: IWGLAnimationControlType;
  
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _control: IWGLAnimationControl;

  private _resizeObserver: ResizeObserver;  
  private _resolution = new Vec2();
  private _pointerPosition = new Vec2();
  private _pointerIsDown: boolean;

  private _animationTimerId: number;  
  private _animationStartTimeStamp = 0;
  private _lastFrameTimeStamp = 0;
  
  private _lastPreparationTime = 0;
  private _lastRenderTime = 0;

  constructor(container: HTMLElement, options: AnimationOptions, 
    controlType: IWGLAnimationControlType) {  

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

    console.log(this._options);

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
