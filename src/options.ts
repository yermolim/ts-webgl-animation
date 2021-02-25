import { IAnimationOptions } from "./interfaces";

class DotAnimationOptions implements IAnimationOptions {
  expectedFps = 60;

  fixedNumber: number = null;
  density = 0.0002;
  depth = 1000;
  fov = 120;
  size: [min: number, max: number] = [16, 64];
  velocityX: [min: number, max: number] = [-0.2, 0.2];
  velocityY: [min: number, max: number] = [-0.2, 0.2];
  angularVelocity: [min: number, max: number] = [-0.001, 0.001];
  
  blur = 1;
  colors: [r: number, g: number, b: number][] = [[255, 255, 255], [255, 244, 193], [250, 239, 219]];  
  fixedOpacity = null;
  opacityMin = 0;
  opacityStep = 0;

  drawLines = true;
  lineColor: [r: number, g: number, b: number] = [113, 120, 146];
  lineLength = 150;
  lineWidth = 2;

  onClick: "create" | "move" = null;
  onHover: "move" | "draw-lines" = null;
  onClickCreateN = 10;
  onClickMoveR = 200;
  onHoverMoveR = 50;
  onHoverLineLength = 150;
  
  textureUrl = "animals-white.png";
  textureSize = 8;
  textureMap = [
    0,0, 1,0, 2,0, 3,0, 4,0, 5,0, 6,0, 7,0,
    0,1, 1,1, 2,1, 3,1, 4,1, 5,1, 6,1, 7,1,
    0,2, 1,2, 2,2, 3,2, 4,2, 5,2, 6,2, 7,2,
    0,3, 1,3, 2,3, 3,3, 4,3, 5,3, 
  ];

  constructor(item: object = null) {
    if (item) {
      Object.assign(this, item);
    }
  }
}

export { DotAnimationOptions };
