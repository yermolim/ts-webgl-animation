import { AnimationOptions, IAnimation } from "./interfaces";
import { SpriteAnimationControl } from "./sprite-animation/sprite-animation-control";
import { SpriteAnimationOptions } from "./sprite-animation/sprite-animation-options";
import { WGLAnimation } from "./wgl-animation";

export class WGLAnimationFactory {
  static createSpriteAnimation(containerSelector: string, 
    options: any = null): IAnimation {    

    const container = document.querySelector(containerSelector);
    if (!container) { 
      throw new Error("Container not found");
    }
    if (window.getComputedStyle(container).getPropertyValue("position") === "static") {      
      throw new Error("Container is not positioned");
    }
 
    const finalOptions = new SpriteAnimationOptions(options); 
    return new WGLAnimation(container as HTMLElement, finalOptions, SpriteAnimationControl);
  }
}
