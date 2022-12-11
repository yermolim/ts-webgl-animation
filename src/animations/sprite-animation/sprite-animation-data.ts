import { Vec2, Vec3, Vec4, Mat4, degToRad,
  getRandomArrayElement, getRandomFloat } from "mathador";

import { Primitive } from "../../webgl/primitives/primitive";
import { Square } from "../../webgl/primitives/square";

import { SpriteAnimationOptions } from "./sprite-animation-options";

interface SpriteData {
  mat: Mat4;
  uv: Float32Array;
  color: Float32Array;
}

export class SpriteAnimationData {
  private _primitive: Primitive;
  get position(): Float32Array {
    return this._primitive.positions;
  }
  get uv(): Float32Array {
    return this._primitive.uvs;
  }
  get index(): Uint32Array {
    return this._primitive.indices;
  }
  get triangles(): number {
    return this._primitive.indices.length / 3;
  }

  private _length: number;
  get length(): number {
    return this._length;
  }

  private _iSizes: Float32Array; // length x3

  private _iPositions: Float32Array; // length x3
  private _iAngularPositions: Float32Array; // length

  private _iVelocities: Float32Array; // length x3
  private _iAngularVelocities: Float32Array; // length

  private _iData: SpriteData[]; 
  private _iDataSorted: SpriteData[]; 

  private _iMatrix: Float32Array;
  get iMatrix(): Float32Array {  
    // TODO: optimize  
    const length = this._length * 16;
    if (!this._iMatrix || this._iMatrix.length !== length) {
      this._iMatrix = new Float32Array(length);
    }
    const matrices = this._iMatrix;
    for (let i = 0; i < this._length; i++) {
      matrices.set(this._iDataSorted[i].mat.toFloatArray(), i * 16);
    }
    return matrices;
  }

  private _iUv: Float32Array;
  get iUv(): Float32Array {  
    // TODO: optimize  
    const length = this._length * 2;
    if (!this._iUv || this._iUv.length !== length) {
      this._iUv = new Float32Array(length);
    }
    const uvs = this._iUv;
    for (let i = 0; i < this._length; i++) {
      uvs.set(this._iDataSorted[i].uv, i * 2);
    }
    return uvs;
  }

  private _iColor: Float32Array;
  get iColor(): Float32Array {
    // TODO: optimize  
    const length = this._length * 4;
    if (!this._iColor || this._iColor.length !== length) {
      this._iColor = new Float32Array(length);
    }
    const colors = this._iColor;
    for (let i = 0; i < this._length; i++) {
      colors.set(this._iDataSorted[i].color, i * 4);
    }
    return colors;
  }

  private _options: SpriteAnimationOptions;

  private _margin: number;
  private _doubleMargin: number;  
  
  private _dimensions = new Vec4();  
  private _sceneDimensions = new Vec3();
  get sceneDimensions(): Vec3 {
    return this._sceneDimensions;
  }

  private _lastFrameTimestamp = 0;

  constructor(options: SpriteAnimationOptions) { 
    this._options = options;

    this._margin = Math.max(0, options.size[1],
      options.lineLength || 0,
      options.clickR || 0,
      options.hoverR || 0);
    this._doubleMargin = this._margin * 2;

    const rect = new Square(1);
    this._primitive = rect;
  }

  updateData(dimensions: Vec4,
    pointerPosition: Vec2, pointerDown: boolean,
    elapsedTime: number) {

    // console.log(pointerPosition);    

    const t = elapsedTime - this._lastFrameTimestamp;
    this._lastFrameTimestamp = elapsedTime;

    if (this.updateDimensions(dimensions)) {
      this.updateLength();
    }

    const tempV2 = new Vec2(); // a temp vec2 for the scene dimensions at a given Z
    for (let i = 0; i < this._length; i++) {
      this.updateInstance(i, t, tempV2);
    }

    // sort instance matrices/uvs by depth
    this._iDataSorted.sort((a, b) => a.mat.w_z - b.mat.w_z);
  }

  private updateInstance(index: number, t: number, tempV2: Vec2) {
    const ix = index * 3;
    const iy = ix + 1;
    const iz = iy + 1;

    const prevZ = this._iPositions[iz];
    const [prev_vwz, prev_vhz] = this.getSceneDimensionsAtZ(prevZ, tempV2);

    const nextZ = this.updateNextFrameZ(iz, t);
    const [vwz, vhz] = this.getSceneDimensionsAtZ(nextZ, tempV2);

    const {x: dx, y: dy} = this._sceneDimensions;

    this._iData[index].mat.reset()
      .applyRotation("z", this.updateAngularRotation(index, t))
      .applyScaling(
        this._iSizes[ix] / dx, 
        this._iSizes[iy] / dy, 
        this._iSizes[iz],
      )
      .applyTranslation(
        this.shiftCoordToClipSpace(this.updateNextFrameCoord(ix, dx, prev_vwz, vwz, t), vwz), 
        this.shiftCoordToClipSpace(this.updateNextFrameCoord(iy, dy, prev_vhz, vhz, t), vhz), 
        nextZ,
      );
  }

  /**
   * get the viewport size at the specified Z in the clip space units
   * (width = height = 1 at Z = 0)
   * @param z 
   * @param out 
   * @returns 
   */
  private getSceneDimensionsAtZ(z: number, out?: Vec2): Vec2 {
    const {x: dx, y: dy, z: dz} = this._sceneDimensions;

    let zAbsolute = z * dz;

    const cameraZ = this._dimensions.w;
    if (zAbsolute < cameraZ) {
      zAbsolute -= cameraZ;
    } else {
      zAbsolute += cameraZ;
    }
  
    const fov = degToRad(this._options.fov); 
    const netHeight = 2 * Math.tan(fov / 2) * Math.abs(zAbsolute);
    const netWidth = netHeight / this._dimensions.y * this._dimensions.x;

    const totalHeight = netHeight + this._doubleMargin;
    const totalWidth = netWidth + this._doubleMargin;

    const clipSpaceWidth = totalWidth / dx;
    const clipSpaceHeight = totalHeight / dy;

    return out
      ? out.set(clipSpaceWidth, clipSpaceHeight)
      : new Vec2(clipSpaceWidth, clipSpaceHeight);
  }

  private updateDimensions(dimensions: Vec4): boolean {    
    const resChanged = !dimensions.equals(this._dimensions);
    if (resChanged) {
      this._dimensions.setFromVec4(dimensions);
      // scene dimensions include margins to prevent flickering at the view borders
      this._sceneDimensions.set(
        dimensions.x + this._doubleMargin,
        dimensions.y + this._doubleMargin,
        dimensions.z,
      );
    }
    return resChanged;
  }

  private updateLength() {
    const length = Math.floor(this._options.fixedNumber 
      ?? this._options.density * this._sceneDimensions.x * this._sceneDimensions.y);
    if (this._length !== length) {
      const oldLength = this._length || 0;
      const oldData = this._iData || [];

      // update instance arrays

      // sizes
      const newSizesLength = length * 3;
      const newSizes = new Float32Array(newSizesLength);
      const oldSizes = this._iSizes;
      const oldSizesLength = oldSizes?.length || 0;
      const sizesIndex = Math.min(newSizesLength, oldSizesLength);
      if (oldSizesLength) {
        newSizes.set(oldSizes.subarray(0, sizesIndex), 0);
      }
      for (let i = sizesIndex; i < newSizesLength;) {
        const size = getRandomFloat(this._options.size[0], this._options.size[1]);
        newSizes[i++] = size;
        newSizes[i++] = size;
        newSizes[i++] = 1;
      }
      this._iSizes = newSizes;

      // basePositions
      const newPositionsLength = length * 3;
      const newPositions = new Float32Array(newPositionsLength);
      const oldPositions = this._iPositions;
      const oldPositionsLength = oldPositions?.length || 0;
      const newPositionsIndex = Math.min(newPositionsLength, oldPositionsLength);
      if (oldPositionsLength) {
        newPositions.set(oldPositions.subarray(0, newPositionsIndex), 0);
      }
      for (let i = newPositionsIndex; i < newPositionsLength; i += 3) {
        newPositions.set([
          getRandomFloat(0, 2), 
          getRandomFloat(0, 2), 
          getRandomFloat(-0.999, -0.001)
        ], i);
      }
      this._iPositions = newPositions;

      // angularPositions
      const newAngularPositionsLength = length;
      const newAngularPositions = new Float32Array(newAngularPositionsLength);
      const oldAngularPositions = this._iPositions;
      const oldAngularPositionsLength = oldAngularPositions?.length || 0;
      const newAngularPositionsIndex = Math.min(newAngularPositionsLength, oldAngularPositionsLength);
      if (oldAngularPositionsLength) {
        newAngularPositions.set(oldAngularPositions.subarray(0, newAngularPositionsIndex), 0);
      }
      for (let i = newAngularPositionsIndex; i < newAngularPositionsLength; i++) {
        newAngularPositions.set([0], i);
      }
      this._iAngularPositions = newAngularPositions;

      // velocities
      const newVelocitiesLength = length * 3;
      const newVelocities = new Float32Array(newVelocitiesLength);
      const oldVelocities = this._iVelocities;
      const oldVelocitiesLength = oldVelocities?.length || 0;
      const velocitiesIndex = Math.min(newVelocitiesLength, oldVelocitiesLength);
      if (oldVelocitiesLength) {
        newVelocities.set(oldVelocities.subarray(0, velocitiesIndex), 0);
      }
      for (let i = velocitiesIndex; i < newVelocitiesLength;) {
        newVelocities[i++] = getRandomFloat(this._options.velocityX[0], this._options.velocityX[1]);
        newVelocities[i++] = getRandomFloat(this._options.velocityY[0], this._options.velocityY[1]);
        newVelocities[i++] = getRandomFloat(this._options.velocityZ[0], this._options.velocityZ[1]);
      }
      this._iVelocities = newVelocities;
      
      // angular velocities
      const newAngularVelocitiesLength = length;
      const newAngularVelocities = new Float32Array(newAngularVelocitiesLength);
      const oldAngularVelocities = this._iAngularVelocities;
      const oldAngularVelocitiesLength = oldAngularVelocities?.length || 0;
      const angularVelocitiesIndex = Math.min(newAngularVelocitiesLength, oldAngularVelocitiesLength);
      if (oldAngularVelocitiesLength) {
        newAngularVelocities.set(oldAngularVelocities.subarray(0, angularVelocitiesIndex), 0);
      }
      for (let i = angularVelocitiesIndex; i < newAngularVelocitiesLength; i++) {
        newAngularVelocities[i] = getRandomFloat(
          this._options.angularVelocity[0], 
          this._options.angularVelocity[1]);
      }
      this._iAngularVelocities = newAngularVelocities;

      const data = new Array<SpriteData>(length);
      let t: number;
      // copy old data to new array
      const dataCopyLength = Math.min(length, oldLength);
      for (let j = 0; j < dataCopyLength; j++) {
        data[j] = oldData[j];
      }
      if (dataCopyLength < length) {
        // fill the rest of new data array
        let uv: Float32Array;
        let color: Float32Array;
        let randomColor: number[];
        for (let j = dataCopyLength; j < length; j++) {
          t = j % 2 
            ? j + 1 
            : j; 

          uv = new Float32Array(2);
          uv[0] = this._options.textureMap[t % this._options.textureMap.length];
          uv[1] = this._options.textureMap[(t + 1) % this._options.textureMap.length];

          color = new Float32Array(4);
          randomColor = getRandomArrayElement(this._options.colors);
          color[0] = randomColor[0] / 255;
          color[1] = randomColor[1] / 255;
          color[2] = randomColor[2] / 255;
          color[3] = this._options.fixedOpacity || getRandomFloat(this._options.opacityMin ?? 0, 1);

          data[j] = {
            mat: new Mat4(),
            uv,
            color,
          };
        }
      }

      this._iData = data;
      this._iDataSorted = data.slice();

      this._length = length;
    }
  }

  private updateNextFrameZ(index: number, timeElapsed: number) {
    const prevFrameZ = this._iPositions[index];
    const velocityZ = this._iVelocities[index];
    let nextZ = prevFrameZ + timeElapsed * velocityZ / this._sceneDimensions.z;
    // reverse the instance Z velocity vector if the current depth is out of bounds
    if (nextZ > -0.001) {
      nextZ = -0.001;
      this._iVelocities[index] = -velocityZ;
    } else if (nextZ < -0.999) {
      nextZ = -0.999;
      this._iVelocities[index] = -velocityZ;
    }
    this._iPositions[index] = nextZ;
    return nextZ;
  }

  private updateNextFrameCoord(index: number, 
    viewSizeAtZero: number, prevViewSizeAtZ: number, viewSizeAtZ: number, 
    timeElapsed: number): number {
    const prevCoord = this._iPositions[index];
    const velocity = this._iVelocities[index];
    const nextCoord = this.calcNextFrameCoord(prevCoord, viewSizeAtZero, prevViewSizeAtZ, viewSizeAtZ, timeElapsed, velocity);
    this._iPositions[index] = nextCoord;
    return nextCoord;
  }

  private updateAngularRotation(index: number, timeElapsed: number): number {
    const prevRotationZ = this._iAngularPositions[index];
    const angularVelocityZ = this._iAngularVelocities[index];
    const nextRotationZ = (prevRotationZ + timeElapsed * angularVelocityZ) % (2 * Math.PI);
    this._iAngularPositions[index] = nextRotationZ;
    return nextRotationZ;
  }

  /**
   * @param prevCoord coordinate from the previous frame
   * @param viewSizeAtZero size of the given dimension at the zero Z level
   * @param prevViewSizeAtZ size of the given dimension at the Z level the instance was at in the last frame 
   * @param viewSizeAtZ size of the given dimension at the Z level the instance is at in the next frame 
   * @param timeElapsed time elapsed since the last frame
   * @param velocity instance velocity for the given dimension
   * @returns coordinate for the next frame
   */
  private calcNextFrameCoord(prevCoord: number, 
    viewSizeAtZero: number, prevViewSizeAtZ: number, viewSizeAtZ: number, 
    timeElapsed: number, velocity: number): number {
    return (prevCoord / prevViewSizeAtZ * viewSizeAtZ + timeElapsed * velocity / viewSizeAtZero) % viewSizeAtZ;
  }

  private shiftCoordToClipSpace(coord: number, viewWidth: number): number {
    return (coord < 0 ? coord + viewWidth : coord) - viewWidth / 2;
  }
} 
