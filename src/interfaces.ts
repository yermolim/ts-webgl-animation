interface IAnimationObject {
  start(): void;
  stop(): void;
  pause(): void;
}

type IAnimationControlFactory = 
    new(canvas: HTMLCanvasElement, options: IAnimationOptions) => IAnimationControl;

interface IAnimationControl {
  setPauseState(pauseState: boolean): void;
  draw(mousePosition?: IPositionObject, isMouseClicked?: boolean): void;
}

interface IAnimationOptions {
  expectedFps: number; // positive integer 

  number: number | null; // null(then "density" field is used) or fixed number. strongly affects performance
  density: number; // positive number. strongly affects performance

  dprDependentDensity: boolean;
  dprDependentDimensions: boolean;

  minR: number; // positive number
  maxR: number; // positive number
  minSpeedX: number;
  maxSpeedX: number;
  minSpeedY: number;
  maxSpeedY: number;

  blur: number; // 0 or positive integer

  stroke: boolean;
  colorsStroke: string[]; // color array to pick from
  opacityStroke: number | null; // null or fixed from 0 to 100
  opacityStrokeMin: number; // number from 0 to 100
  opacityStrokeStep: number; // number from 0 to 100

  fill: boolean;
  colorsFill: string[]; // color array to pick from
  opacityFill: number | null; // null or fixed from 0 to 100
  opacityFillMin: number; // number from 0 to 100
  opacityFillStep: number; // number from 0 to 100

  drawLines: boolean;
  lineColor: string;
  lineLength: number;
  lineWidth: number;

  actionOnClick: boolean;
  actionOnHover: boolean;
  onClickCreate: boolean;
  onClickMove: boolean;
  onHoverMove: boolean;
  onHoverDrawLines: boolean;
  onClickCreateNDots: number; // positive integer
  onClickMoveRadius: number; // positive integer
  onHoverMoveRadius: number; // positive integer
  onHoverLineRadius: number; // positive integer
}

interface IPositionObject {
  x: number;
  y: number;
}

export { IAnimationObject, IAnimationControl, IAnimationControlFactory, 
  IAnimationOptions, IPositionObject };
