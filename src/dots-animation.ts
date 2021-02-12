import { getRandomUuid, hexToRgbaString } from "./common";
import { IPositionObject, 
  IAnimation, IAnimationOptions, IAnimationControl, IAnimationControlType,
  IWebGlAnimationControlType, IWebGlAnimationControl} from "./interfaces";
import { getRandomInt, getRandomFloat, getDistance2D } from "./math/common";
import { Vec2 } from "./math/vec2";
import { DotAnimationOptions } from "./options";
import { AnimationProgram } from "./webgl/program";

function drawCircle(ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, colorS: string | null, colorF: string | null): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  if (colorF !== null) {
    ctx.fillStyle = colorF;
    ctx.fill();
  }
  if (colorS !== null) {
    ctx.strokeStyle = colorS;
    ctx.stroke();
  }
}

function drawLine(ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

interface IDotProps {
  x: number;
  y: number;
  r: number;
  xSpeed: number;
  ySpeed: number;
  colorS: string | null;
  colorF: string | null;
}

class Dot {
  private _colorS: string | null;
  private _colorF: string | null;
  private _opacitySCurrent: number;
  private _opacityFCurrent: number;

  constructor(private _canvas: HTMLCanvasElement,
    private _offset: number,

    private _x: number,
    private _y: number,
    private _xSpeed: number,
    private _ySpeed: number,

    private _r: number,

    private _colorSHex: string | null,
    private _colorFHex: string | null,

    private _opacitySMin: number,
    private _opacitySMax: number,
    private _opacitySStep: number,
        
    private _opacityFMin: number,
    private _opacityFMax: number,
    private _opacityFStep: number) { 
    this._opacitySCurrent = _opacitySMax;                
    this._opacityFCurrent = _opacityFMax;                
    this._colorS = _colorSHex === null ? 
      null : hexToRgbaString(_colorSHex, this._opacitySCurrent / 100);
    this._colorF = _colorFHex === null ? 
      null : hexToRgbaString(_colorFHex, this._opacityFCurrent / 100);
  }

  getProps(): IDotProps {
    return {
      x: this._x,
      y: this._y,
      r: this._r,
      xSpeed: this._xSpeed,
      ySpeed: this._ySpeed,
      colorS: this._colorS,
      colorF: this._colorF
    };
  }

  updatePosition(): void {
    const offset = Math.max(this._offset, this._r);
    const xMin = -1 * offset;
    const yMin = -1 * offset;
    const xMax = this._canvas.width + offset;
    const yMax = this._canvas.height + offset;


    if (this._x < xMin) {
      this._x = xMax;
    } else if (this._x > xMax) {
      this._x = xMin;
    } else {
      this._x += this._xSpeed;
    }

    if (this._y < yMin) {
      this._y = yMax;
    } else if (this._y > yMax) {
      this._y = yMin;
    } else {
      this._y += this._ySpeed;
    }
  }

  updateColor(): void {    
    if (this._opacitySStep !== 0 && this._colorSHex !== null) {
      this._opacitySCurrent += this._opacitySStep;
      if (this._opacitySCurrent > this._opacitySMax) {
        this._opacitySCurrent = this._opacitySMax;
        this._opacitySStep *= -1;
      } else if (this._opacitySCurrent < this._opacitySMin) {
        this._opacitySCurrent = this._opacitySMin;
        this._opacitySStep *= -1;
      }
      this._colorS = hexToRgbaString(this._colorSHex, this._opacityFCurrent / 100);
    }
    if (this._opacityFStep !== 0 && this._colorFHex !== null) {
      this._opacityFCurrent += this._opacityFStep;
      if (this._opacityFCurrent > this._opacityFMax) {
        this._opacityFCurrent = this._opacityFMax;
        this._opacityFStep *= -1;
      } else if (this._opacityFCurrent < this._opacityFMin) {
        this._opacityFCurrent = this._opacityFMin;
        this._opacityFStep *= -1;
      }
      this._colorF = hexToRgbaString(this._colorFHex, this._opacityFCurrent / 100);
    }
  }

  moveTo(position: IPositionObject): void {
    this._x = position.x;
    this._y = position.y;
  }
}

class DotControl implements IAnimationControl {
  private _pauseState = false;
  private _array: Dot[] = [];
  private _maxNumber = 100;
  private _lastDpr = 0;
  private readonly _options: DotAnimationOptions;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _canvasCtx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, options: IAnimationOptions) {
    this._canvas = canvas;
    const canvasCtx = this._canvas.getContext("2d");
    if (canvasCtx === null) {
      throw new Error("Canvas context is null");
    }
    this._canvasCtx = canvasCtx;
    if (!(options instanceof DotAnimationOptions)) {
      throw new Error("Options are not an instance of DotAnimationOptions");
    }
    this._options = <DotAnimationOptions>options;
  }

  setPauseState(pauseState: boolean) {
    this._pauseState = pauseState;
  }

  draw(mousePosition: IPositionObject, isClicked: boolean) {
    // if dpr changed (window moved to other display) clear dots array
    const dpr = window.devicePixelRatio;
    if (dpr !== this._lastDpr) {
      this._array.length = 0;
    }
    this._lastDpr = dpr;        
        
    // update dots number
    const isNumberUpdated = this.updateDotNumber();

    // return if paused and no resize events fired
    if (!isNumberUpdated && this._pauseState && !this.isCanvasEmpty()) {
      return;
    }

    // clear canvas
    this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // move dots
    for (const dot of this._array) {
      dot.updatePosition();
      dot.updateColor();
    }

    // handle mouse actions
    const ratio = this._options.dprDependentDimensions ? dpr : 1;
    // handle mouse move
    if (this._options.actionOnHover) {
      if (this._options.onHoverDrawLines) { 
        this.drawLinesToCircleCenter(mousePosition, this._options.onHoverLineRadius *ratio, 
          this._options.lineWidth, this._options.lineColor); 
      }
      if (this._options.onHoverMove) {
        this.moveDotsOutOfCircle(
          mousePosition, this._options.onHoverMoveRadius * ratio);
      }
    }
    // handle mouse click
    if (isClicked && this._options.actionOnClick) {
      if (this._options.onClickMove) {
        this.moveDotsOutOfCircle(
          mousePosition, this._options.onClickMoveRadius * ratio);
      }
      if (this._options.onClickCreate) { 
        this.dotFactory(this._options.onClickCreateNDots, mousePosition); 
      }
    }

    // draw lines
    if (this._options.drawLines) { 
      this.drawLinesBetweenDots(); 
    }
    // draw dots
    for (const dot of this._array) {
      const params = dot.getProps();
      drawCircle(this._canvasCtx, params.x, params.y, params.r, params.colorS, params.colorF);
    }
  }

  isCanvasEmpty()
  {
    return !this._canvasCtx
      .getImageData(0, 0, this._canvas.width, this._canvas.height)
      .data.some(channel => channel !== 0);
  }

  // creation actions
  dotFactory(number: number, position: IPositionObject | null = null): void {
    for (let i = 0; i < number; i++) {
      const dot = this.createRandomDot(position);
      this._array.push(dot);
    }
    if (this._array.length > this._maxNumber) {
      this.deleteEldestDots(this._array.length - this._maxNumber);
    }
  }

  createRandomDot(position: IPositionObject | null): Dot {
    let x: number, y: number;
    // optional position arg
    if (position) {
      x = position.x;
      y = position.y;
    } else {
      x = getRandomInt(0, this._canvas.width);
      y = getRandomInt(0, this._canvas.height);
    }
    // dimensions params
    const dimRatio = this._options.dprDependentDimensions ? window.devicePixelRatio : 1;
    const offset = this._options.drawLines ? this._options.lineLength * dimRatio : 0;
    const xSpeed = getRandomFloat(this._options.minSpeedX, this._options.maxSpeedX) * dimRatio;
    const ySpeed = getRandomFloat(this._options.minSpeedY, this._options.maxSpeedY) * dimRatio;
    const radius = getRandomInt(this._options.minR, this._options.maxR) * dimRatio;
    // fill/stroke color params
    let colorS: string | null = null;
    let colorF: string | null = null;
    if (this._options.stroke) {
      colorS = this._options.colorsStroke[Math.floor(Math.random() * 
                this._options.colorsStroke.length)];
    }
    if (this._options.fill) {
      colorF = this._options.colorsFill[Math.floor(Math.random() *
                this._options.colorsFill.length)];
    }
    // fill/stroke opacity params
    const opacitySMin = this._options.opacityStrokeMin;
    const opacitySMax = this._options.opacityStroke ? 
      Math.max(opacitySMin, this._options.opacityStroke) :
      getRandomInt(opacitySMin, 100);
    const opacitySStep = this._options.opacityStrokeStep;
    const opacityFMin = this._options.opacityFillMin;
    const opacityFMax = this._options.opacityFill ? 
      Math.max(opacityFMin, this._options.opacityFill) :
      getRandomInt(opacityFMin, 100);
    const opacityFStep = this._options.opacityFillStep;
    return new Dot(this._canvas, offset, 
      x, y, xSpeed, ySpeed, 
      radius, 
      colorS, colorF, 
      opacitySMin, opacitySMax, opacitySStep,
      opacityFMin, opacityFMax, opacityFStep);
  }

  deleteEldestDots(number: number): void {
    this._array = this._array.slice(number);
    for (let i = 0; i < number; i++) {
      this._array.shift();
    }
  }

  getDotNumber(): number {
    const densityRatio = this._options.dprDependentDensity ? window.devicePixelRatio : 1;
    const calculatedNumber = Math.floor(this._canvas.width * this._canvas.height * this._options.density / densityRatio);
    return this._options.number ? this._options.number : calculatedNumber;
  }

  updateDotNumber(): boolean {       
    this._maxNumber = this.getDotNumber();
    if (this._maxNumber < this._array.length) {
      this.deleteEldestDots(this._array.length - this._maxNumber);
      return true;
    } else if (this._maxNumber > this._array.length) {
      this.dotFactory(this._maxNumber - this._array.length);
      return true;
    } else {
      return false;
    }
  }

  getCloseDotPairs(maxDistance: number): number[][] {
    const dotArray = this._array;
    const closePairs: number[][] = [];
    for (let i = 0; i < dotArray.length; i++) {
      for (let j = i; j < dotArray.length; j++) {
        const dotIParams = dotArray[i].getProps();
        const dotJParams = dotArray[j].getProps();
        const distance = Math.floor(getDistance2D(dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y));
        if (distance <= maxDistance) {
          closePairs.push([dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y, distance]);
        }
      }
    }

    return closePairs;
  }

  getDotsInsideCircle(position: IPositionObject, radius: number): [Dot, number][] {
    const dotsInCircle: [Dot, number][] = [];
    for (const dot of this._array) {
      const dotParams = dot.getProps();
      const distance = getDistance2D(position.x, position.y, dotParams.x, dotParams.y);
      if (distance < radius) {
        dotsInCircle.push([dot, distance]);
      }
    }
    return dotsInCircle;
  }

  moveDotsOutOfCircle(position: IPositionObject, radius: number): void {
    const dotsInCircle = this.getDotsInsideCircle(position, radius);
    for (const item of dotsInCircle) {
      const dot = item[0];
      const dotParams = dot.getProps();
      const distance = item[1];
      const x = (dotParams.x - position.x) * (radius / distance) + position.x;
      const y = (dotParams.y - position.y) * (radius / distance) + position.y;
      dot.moveTo({ x: x, y: y });
    }
  }

  drawLinesBetweenDots(): void {
    const ratio = this._options.dprDependentDimensions ? window.devicePixelRatio : 1;
    const lineLength = this._options.lineLength * ratio;
    const pairs = this.getCloseDotPairs(lineLength);
    const width = this._options.lineWidth;
    for (const pair of pairs) {
      const opacity = (1 - pair[4] / lineLength) / 2;
      const color = hexToRgbaString(this._options.lineColor, opacity);
      drawLine(this._canvasCtx, pair[0], pair[1], pair[2], pair[3], width, color);
    }
  }

  drawLinesToCircleCenter(position: IPositionObject, radius: number, 
    lineWidth: number, lineColor: string ): void {
    const dotsInCircle = this.getDotsInsideCircle(position, radius);
    for (const item of dotsInCircle) {
      const dot = item[0];
      const dotParams = dot.getProps();
      const opacity = (1 - item[1] / radius);
      const color = hexToRgbaString(lineColor, opacity);
      drawLine(this._canvasCtx, position.x, position.y, dotParams.x, dotParams.y, lineWidth, color);
    }
  }
}

class DotsAnimation implements IAnimation {

  private readonly _parent: HTMLElement;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _animationControl: IAnimationControl;

  private _fps: number;
  private _timer: number | undefined = undefined;

  private readonly _mousePosition: IPositionObject;
  private _isMouseClicked = false;

  constructor(parent: HTMLElement, options: IAnimationOptions, constructor: IAnimationControlType) {
    this._parent = parent;

    this._mousePosition = {
      x: 0,
      y: 0,
    };

    this._fps = options.expectedFps;

    this._canvas = document.createElement("canvas");
    this._canvas.id = getRandomUuid();
    this._canvas.style.display = "block";
    this._canvas.style.width = "100%";
    this._canvas.style.width = "100%";
    this._canvas.style.height = "100%";
    this._canvas.style.filter = `blur(${options.blur}px)`;

    this.resize();
    parent.appendChild(this._canvas);
    window.addEventListener("resize", () => { this.resize(); });

    this._animationControl = DotsAnimation
      .animationControlFactory(constructor, this._canvas, options);
  }
  
  static animationControlFactory(constructor: IAnimationControlType,
    canvas: HTMLCanvasElement, options: IAnimationOptions): IAnimationControl {
    return new constructor(canvas, options);
  }

  resize() {
    const dpr = window.devicePixelRatio;
    this._canvas.width = this._parent.offsetWidth * dpr;
    this._canvas.height = this._parent.offsetHeight * dpr;
  }

  draw() {
    this._animationControl.draw(this._mousePosition, this._isMouseClicked);
    this._isMouseClicked = false;
  }

  // action methods
  start() {     
    this._animationControl.setPauseState(false);
    if (this._timer !== undefined) { return; }
    this._timer = window.setInterval(() => {
      // eslint-disable-next-line no-unused-expressions
      window.requestAnimationFrame(() => { this.draw(); }) ||
                window.webkitRequestAnimationFrame(() => { this.draw(); });
    }, 1000 / this._fps); 
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("click", this.onClick.bind(this));
  }

  pause() {       
    this._animationControl.setPauseState(true); 
  }

  stop() {
    clearInterval(this._timer);
    this._timer = undefined;
    const canvasCtx = this._canvas.getContext("2d");
    window.setTimeout(() => {
      if (canvasCtx !== null) {
        canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      }}, 20);
  }

  // event handlers
  onClick() {
    this._isMouseClicked = true;
  }
  onMouseMove(e: MouseEvent) {
    const dpr = window.devicePixelRatio;

    const parentRect = this._parent.getBoundingClientRect();
    const xRelToDoc = parentRect.left +
            document.documentElement.scrollLeft;
    const yRelToDoc = parentRect.top +
            document.documentElement.scrollTop;

    const xDpr = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
    const yDpr = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;

    this._mousePosition.x = xDpr;
    this._mousePosition.y = yDpr;
  }
}

//WIP
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
  private _lastFrameTime = 0;
  private _lastFramePreparationTime = 0;
  private _lastFrameRenderTime = 0;

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

      this._lastFramePreparationTime = performance.now() - framePreparationStart;

      requestAnimationFrame(() => {
        const frameRenderStart = performance.now();

        this._control.renderFrame();

        const frameRenderEnd = performance.now();
        this._lastFrameTimeStamp = frameRenderEnd;
        this._lastFrameRenderTime = frameRenderEnd - frameRenderStart;
        this._lastFrameTime = frameRenderEnd - framePreparationStart;
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
  onResize = (e: readonly ResizeObserverEntry[]) => {
    const dpr = window.devicePixelRatio;
    const rect = this._container.getBoundingClientRect();
    const x = rect.width * dpr;
    const y = rect.height * dpr;

    this._canvas.width = x;
    this._canvas.height = y;
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

  onPointerDown = (e: PointerEvent) => {
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

    this.onResize(null);
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

    attribute vec4 position;

    void main() {
      gl_Position = position;
    }
  `;

  private readonly _fragmentShader = `
    #pragma vscode_glsllint_stage : frag  

    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;
  
  private _options: IAnimationOptions;
  private _gl: WebGLRenderingContext;

  private _program: AnimationProgram;
  
  private _tempData: Float32Array;

  constructor(gl: WebGLRenderingContext, options: IAnimationOptions) {
    this._options = options;
    this._gl = gl;

    // restore context if lost
    if (this._gl.isContextLost()) {
      this._gl.getExtension("WEBGL_lose_context").restoreContext();
    }
    this._program = new AnimationProgram(gl, this._vertexShader, this._fragmentShader);

    // set constant attributes if not set (first time)
    // DEBUG
    this._tempData = new Float32Array([0.1, 0.5, 0, 1, 0.3, 0.1, 0, 1, 0.3, 0.5, 0, 1]);
    this._program.setBufferAttribute("position", this._tempData, {vectorSize: 4});
    this._program.triangleCount = 1;
  }

  prepareNextFrame(resolution: Vec2, pointerPosition: Vec2, pointerDown: boolean, elapsedTime: number) {
    this.resize(resolution);

    // calc uniforms
    // set uniforms

    // DEBUG
  }

  renderFrame() {
    // DEBUG
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
    if (this._gl.canvas.width !== resolution.x) {
      this._gl.canvas.width = resolution.x;
    }
    if (this._gl.canvas.height !== resolution.y) {
      this._gl.canvas.height = resolution.y;
    }
  }
}

class DotAnimationWebGlData {  
  constructor(options: DotAnimationOptions) {

    const length = 10000;

    const position = new Float32Array(length * 3);
    const color = new Uint8Array(length * 4);

    const velocity = new Float32Array(length * 3);

    const resolution = new Uint16Array(2); 
    const mousePosition = new Uint16Array(2);
    
    const maxLineLength = 100;

    const elapsedTime = 0;
    const pointerIsDown = false;
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
