import { Vec2 } from "./math/vec2";

interface AnimationOptions {
  expectedFps: number;
  blur: number;
}

interface IAnimation {
  start(): void;
  stop(): void;
  pause(): void;
}

interface IAnimationControl {
  setPauseState(pauseState: boolean): void;
  draw(mousePosition?: Position2, isMouseClicked?: boolean): void;
}

type IAnimationControlType = 
    new(canvas: HTMLCanvasElement, options: AnimationOptions) => IAnimationControl;

    
interface IWGLAnimationControl {  
  prepareNextFrame(resolution: Vec2, pointerPosition: Vec2, pointerDown: boolean, elapsedTime: number): void;
  renderFrame(): void;

  clear(): void;
  destroy(): void;
}

type IWGLAnimationControlType = 
    new(gl: WebGLRenderingContext, options: AnimationOptions) => IWGLAnimationControl;

interface Position2 {
  x: number;
  y: number;
}

export { AnimationOptions, IAnimation, IAnimationControl, IAnimationControlType, Position2 as IPositionObject,
  IWGLAnimationControl, IWGLAnimationControlType };
