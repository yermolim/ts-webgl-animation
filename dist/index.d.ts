// Generated by dts-bundle-generator v5.9.0

export interface AnimationOptions {
	expectedFps?: number;
	blur?: number;
}
export interface IAnimation {
	start(): void;
	stop(): void;
	pause(): void;
}
export interface SpriteAnimationOptions extends AnimationOptions {
	textureUrl: string;
	textureSize: number;
	textureMap: number[];
	expectedFps?: number;
	fixedNumber?: number;
	density?: number;
	depth?: number;
	fov?: number;
	size?: [
		min: number,
		max: number
	];
	velocityX?: [
		min: number,
		max: number
	];
	velocityY?: [
		min: number,
		max: number
	];
	velocityZ?: [
		min: number,
		max: number
	];
	angularVelocity?: [
		min: number,
		max: number
	];
	blur?: number;
	colors?: [
		r: number,
		g: number,
		b: number
	][];
	fixedOpacity?: number;
	opacityMin?: number;
	opacityStep?: number;
	drawLines?: boolean;
	lineColor?: [
		r: number,
		g: number,
		b: number
	];
	lineLength?: number;
	lineWidth?: number;
	onClick?: "create" | "move";
	onHover?: "move" | "draw-lines";
	onClickCreateN?: number;
	onClickMoveR?: number;
	onHoverMoveR?: number;
	onHoverLineLength?: number;
}
export declare class WGLAnimationFactory {
	static createSpriteAnimation(containerSelector: string, options?: any): IAnimation;
}

export {};
