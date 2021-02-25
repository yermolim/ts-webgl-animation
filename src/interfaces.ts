import { Vec2 } from "./math/vec2";

interface IAnimationOptions {
  expectedFps: number;

  fixedNumber: number;
  density: number;
  depth: number;
  fov: number;
  size: [min: number, max: number];
  velocityX: [min: number, max: number];
  velocityY: [min: number, max: number];
  angularVelocity: [min: number, max: number];
  
  blur: number;
  colors: [r: number, g: number, b: number][];  
  fixedOpacity: number;
  opacityMin: number;
  opacityStep: number;

  drawLines: boolean;
  lineColor: [r: number, g: number, b: number];
  lineLength: number;
  lineWidth: number;

  onClick: "create" | "move";
  onHover: "move" | "draw-lines";
  onClickCreateN: number;
  onClickMoveR: number;
  onHoverMoveR: number;
  onHoverLineLength: number;
  
  textureUrl: string;
  textureSize: number;
  textureMap: number[];
}

interface IAnimation {
  start(): void;
  stop(): void;
  pause(): void;
}
    
interface IWebGlAnimationControl {  
  prepareNextFrame(resolution: Vec2, pointerPosition: Vec2, pointerDown: boolean, elapsedTime: number): void;
  renderFrame(): void;

  clear(): void;
  destroy(): void;
}

type IWebGlAnimationControlType = 
    new(gl: WebGLRenderingContext, options: IAnimationOptions) => IWebGlAnimationControl;

interface IAnimationControl {
  setPauseState(pauseState: boolean): void;
  draw(mousePosition?: IPositionObject, isMouseClicked?: boolean): void;
}

type IAnimationControlType = 
    new(canvas: HTMLCanvasElement, options: IAnimationOptions) => IAnimationControl;

interface IPositionObject {
  x: number;
  y: number;
}

export { IAnimationOptions, IAnimation, IAnimationControl, IAnimationControlType, IPositionObject,
  IWebGlAnimationControl, IWebGlAnimationControlType };
