import { AnimationOptions } from "../wgl-animation-interfaces";

export interface SpriteAnimationOptions extends AnimationOptions {
  /** texture atlas uri */
  textureUrl: string;
  /** texture atlas row tile count */
  textureSize: number;
  /** 
   * array of texture coordinates of the texture atlas tiles
   * [x0, y0, x1, y1, ...xn, yn] where: x - column number (starting from 0); y - row number (starting from 0)
   */
  textureMap: number[];

  /** default: 60 */
  expectedFps?: number;
  /**
   * number of sprites. if not defined then density is used for sprite count calculation.
   * default: null
   */
  fixedNumber?: number;

  /**
   * sprite density (sprite per pixel).
   * default: 0.0002
   */
  density?: number;
  /**
   * scene depth (max Z-value).
   * default: 1000
   */
  depth?: number;
  /**
   * camera FOV (in degrees).
   * default: 120
   */
  fov?: number; 
  /**
   * a tuple that defines sprite size (in pixels). 
   * [min, max]
   * default: [16, 64]
   */
  size?: [min: number, max: number];
  /**
   * a tuple that defines sprite speed in the X direction (in pixels per frame). 
   * [min, max]
   * default: [-0.1, 0.1]
   */
  velocityX?: [min: number, max: number];
  /**
   * a tuple that defines sprite speed in the Y direction (in pixels per frame). 
   * [min, max]
   * default: [-0.1, 0.1]
   */
  velocityY?: [min: number, max: number];
  /**
   * a tuple that defines sprite motion speed in the Z direction (in pixels per frame). 
   * [min, max]
   * default: [-0.1, 0.1]
   */
  velocityZ?: [min: number, max: number];
  /**
   * a tuple that defines sprite rotation speed around its center (in radians per frame). 
   * [min, max]
   * default: [-0.001, 0.001]
   */
  angularVelocity?: [min: number, max: number];
  
  /**
   * blur strength (in pixels).
   * default: 1
   */
  blur?: number;
  /**
   * a tuple of tuples that define colors used for sprites. 
   * if multiple colors are provided, random ones are used for sprite coloring.
   * [[r0, g0, b0], [r1, g1, b1], ...[rn, gn, bn]]
   * default: [[255, 255, 255], [255, 244, 193], [250, 239, 219]]
   */
  colors?: [r: number, g: number, b: number][];  
  /**
   * sprite opacity value. if not defined, random opacity is used.
   * default: null
   */
  fixedOpacity?: number;
  /**
   * min opacity value. used for random opacity selection.
   * default: 0
   */
  opacityMin?: number;
  /**
   * opacity step. used for random opacity selection.
   * default: 0
   */
  opacityStep?: number;
  /**
   * enabled or disable opacity change depending on the distanse from the camera
   */
  depthAffectsOpacity: boolean;

  drawLines?: boolean;
  lineColor?: [r: number, g: number, b: number];
  lineLength?: number;
  lineWidth?: number;

  onClick?: "create" | "move";
  onHover?: "move" | "draw-lines";

  createN?: number;

  clickR?: number;
  hoverR?: number;

  showPointerEffectArea: boolean;
}

export const defaultSpriteAnimationOptions: SpriteAnimationOptions = {
  expectedFps: 60,

  fixedNumber: null,
  density: 0.0002,
  depth: 1000,
  fov: 120,
  size: [16, 64],
  velocityX: [-0.1, 0.1],
  velocityY: [-0.1, 0.1],
  velocityZ: [-0.1, 0.1],
  angularVelocity: [-0.001, 0.001],
  
  blur: 1,
  colors: [[255, 255, 255], [255, 244, 193], [250, 239, 219]],  
  fixedOpacity: null,
  opacityMin: 0.5,
  opacityStep: 0,
  depthAffectsOpacity: true,

  drawLines: true,
  lineColor: [113, 120, 146],
  lineLength: 150,
  lineWidth: 2,

  onClick: null,
  onHover: null,
  
  createN: 10,
  
  clickR: 200,
  hoverR: 150,
  showPointerEffectArea: false,
  
  textureUrl: null,
  textureSize: null,
  textureMap: null,
};
