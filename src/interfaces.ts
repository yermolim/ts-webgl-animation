import { Vec2 } from "./math";

interface IAnimationOptions {
  expectedFps: number;  
  blur: number;
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
