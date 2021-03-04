import { degToRad, getRandomArrayElement, getRandomFloat } from "../../math/common";
import { Mat4 } from "../../math/mat4";
import { Vec2 } from "../../math/vec2";
import { Vec3 } from "../../math/vec3";
import { Vec4 } from "../../math/vec4";
import { Primitive } from "../../webgl/primitives/primitive";
import { Square } from "../../webgl/primitives/square";
import { SpriteAnimationOptions } from "./sprite-animation-options";

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

  private _iColors: Float32Array; // length x4
  get iColor(): Float32Array {
    return this._iColors;
  }

  private _iSizes: Float32Array; // length x3
  private _iBasePositions: Float32Array; // length x3
  private _iVelocities: Float32Array; // length x3
  private _iAngularVelocities: Float32Array; // length
  private _iCurrentPositions: Float32Array; // length x3
  private _iData: {mat: Mat4; uv: Vec2}[]; 
  private _iDataSorted: {mat: Mat4; uv: Vec2}[]; 
  get iMatrix(): Float32Array {  
    // TODO: optimize  
    const matrices = new Float32Array(this._length * 16);
    for (let i = 0; i < this._length; i++) {
      matrices.set(this._iDataSorted[i].mat.toFloatArray(), i * 16);
    }
    return matrices;
  }
  get iUv(): Float32Array {  
    // TODO: optimize  
    const uvs = new Float32Array(this._length * 2);
    for (let i = 0; i < this._length; i++) {
      uvs.set(this._iDataSorted[i].uv.toFloatArray(), i * 2);
    }
    return uvs;
  }

  private _options: SpriteAnimationOptions;

  private _margin: number;
  private _doubleMargin: number;  
  
  private _dimensions = new Vec4();  
  private _sceneDimensions = new Vec3();
  get sceneDimensions(): Vec3 {
    return this._sceneDimensions;
  }

  constructor(options: SpriteAnimationOptions) { 
    this._options = options;

    this._margin = Math.max(0, options.size[1], options.lineLength, options.onHoverLineLength);
    this._doubleMargin = this._margin * 2;

    const rect = new Square(1);
    this._primitive = rect;
  }

  updateData(dimensions: Vec4, pointerPosition: Vec2, 
    pointerDown: boolean, elapsedTime: number) {  

    if (this.updateDimensions(dimensions)) {
      this.updateLength();
    }

    const {x: dx, y: dy, z: dz} = this._sceneDimensions;
    const t = elapsedTime;
    const tempV2 = new Vec2(); // a temp vec2 for the scene dimensions at a given Z

    for (let i = 0; i < this._length; i++) {      
      const sx = this._iSizes[i * 3] / dx; // instance width in px
      const sy = this._iSizes[i * 3 + 1] / dy; // instance height in px
      const sz = this._iSizes[i * 3 + 2]; // instance depth in px
      
      const bx = this._iBasePositions[i * 3];
      const by = this._iBasePositions[i * 3 + 1];
      const bz = this._iBasePositions[i * 3 + 2];
      
      const vx = this._iVelocities[i * 3];
      const vy = this._iVelocities[i * 3 + 1];
      const vz = this._iVelocities[i * 3 + 2];
      const wz = this._iAngularVelocities[i];
      
      // calculate depth
      const lastDepth = this._iCurrentPositions[i * 3 + 2] || bz;
      let tz = lastDepth + vz / dz;
      // reverse the instance Z velocity vector if the current depth is out of bounds
      if (tz > -0.001) {
        tz = -0.001;        
        this._iVelocities[i * 3 + 2] = -vz;
      } else if (tz < -0.999) {
        tz = -0.999;        
        this._iVelocities[i * 3 + 2] = -vz;
      }

      // get visible bound factor for the given Z (kx = ky = 1 at Z = 0)
      const [zdx, zdy] = this.getSceneDimensionsAtZ(tz * dz, tempV2);
      const kx = zdx / dx;
      const ky = zdy / dy;

      // update positions
      // keep instances inside the scene using remainder operator
      const x = (bx + t * vx / dx) % kx;
      const y = (by + t * vy / dy) % ky;

      // translate instance taking into account that the scene center should be at 0,0
      const tx = (x < 0 ? x + kx : x) - kx / 2;
      const ty = (y < 0 ? y + ky : y) - ky / 2;

      // set current positions for further processing
      this._iCurrentPositions[i * 3] = tx;
      this._iCurrentPositions[i * 3 + 1] = ty;
      this._iCurrentPositions[i * 3 + 2] = tz;

      // update instance matrices
      this._iData[i].mat.reset()
        .applyRotation("z", t * wz % (2 * Math.PI))
        .applyScaling(sx, sy, sz)
        .applyTranslation(tx, ty, tz);
    }

    // sort instance matrices/uvs by depth
    this._iDataSorted.sort((a, b) => a.mat.w_z - b.mat.w_z);
  }

  private getSceneDimensionsAtZ(z: number, out?: Vec2): Vec2 {
    const cameraZ = this._dimensions.w;
    if (z < cameraZ) {
      z -= cameraZ;
    } else {
      z += cameraZ;
    }
  
    const fov = degToRad(this._options.fov); 
    const height = 2 * Math.tan(fov / 2) * Math.abs(z);
    const width = height / this._dimensions.y * this._dimensions.x;

    return out
      ? out.set(width + this._doubleMargin, height + this._doubleMargin)
      : new Vec2(width + this._doubleMargin, height + this._doubleMargin);
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
      // update instance arrays

      // colors
      const newColorsLength = length * 4;
      const newColors = new Float32Array(newColorsLength);
      const oldColors = this._iColors;
      const oldColorsLength = oldColors?.length || 0;
      const colorsIndex = Math.min(newColorsLength, oldColorsLength);
      if (oldColorsLength) {
        newColors.set(oldColors.subarray(0, colorsIndex), 0);
      }
      for (let i = colorsIndex; i < newColorsLength;) {
        const colors = getRandomArrayElement(this._options.colors);
        newColors[i++] = colors[0] / 255;
        newColors[i++] = colors[1] / 255;
        newColors[i++] = colors[2] / 255;
        newColors[i++] = this._options.fixedOpacity 
          || getRandomFloat(this._options.opacityMin ?? 0, 1);
      }        
      this._iColors = newColors.sort();
      
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
      const newBasePositionsLength = length * 3;
      const newBasePositions = new Float32Array(newBasePositionsLength);
      const oldBasePositions = this._iBasePositions;
      const oldBasePositionsLength = oldBasePositions?.length || 0;
      const basePositionsIndex = Math.min(newBasePositionsLength, oldBasePositionsLength);
      if (oldBasePositionsLength) {
        newBasePositions.set(oldBasePositions.subarray(0, basePositionsIndex), 0);
      }      
      for (let i = basePositionsIndex; i < newBasePositionsLength; i += 3) {
        newBasePositions.set([getRandomFloat(0, 1), getRandomFloat(0, 1), getRandomFloat(-0.999, -0.001)], i);
      }
      this._iBasePositions = newBasePositions;      

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

      this._iCurrentPositions = new Float32Array(length * 3);

      const data: {mat: Mat4; uv: Vec2}[] = new Array(length);
      let t: number;
      for (let j = 0; j < length; j++) {
        t = j % 2 ? j + 1 : j;
        data[j] = {
          mat: new Mat4(),
          uv: new Vec2(
            this._options.textureMap[t % this._options.textureMap.length],
            this._options.textureMap[(t + 1) % this._options.textureMap.length],
          ),
        };
      }
      this._iData = data;
      this._iDataSorted = data.slice();

      this._length = length;
    }
  }
} 
