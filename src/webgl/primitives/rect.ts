import { Primitive } from "./common";

export class Rect implements Primitive { 
  protected _normals: Float32Array;
  protected _positions: Float32Array;
  protected _uvs: Float32Array;
  protected _indices: Uint32Array;

  get positions(): Float32Array {
    return this._positions;
  }
  get normals(): Float32Array {
    return this._normals;
  }
  get uvs(): Float32Array {
    return this._uvs;
  }
  get indices(): Uint32Array {
    return this._indices;
  }

  constructor(size = 1) {
    this._positions = new Float32Array ([
      -size, -size, 0, 1,
      size, -size, 0, 1,
      -size, size, 0, 1,
      size, size, 0, 1,
    ]);
    this._normals = new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]);
    this._uvs = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);
    this._indices = new Uint32Array([0, 1, 2, 2, 1, 3]);
  }
}
