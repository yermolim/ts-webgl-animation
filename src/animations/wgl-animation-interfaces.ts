import { Vec2 } from "mathador";

interface AnimationOptions {
  expectedFps?: number;
  blur?: number;
}

interface IAnimation {
  start(): void;
  stop(): void;
  pause(): void;
}

interface IAnimationControl {
  setPauseState(pauseState: boolean): void;
  draw(mousePosition?: Vec2, isMouseClicked?: boolean): void;
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

export { AnimationOptions, IAnimation, IAnimationControl, IAnimationControlType,
  IWGLAnimationControl, IWGLAnimationControlType };
