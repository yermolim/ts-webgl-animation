function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

function degToRad(degrees: number) {
  return degrees * Math.PI / 180;
}

class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  copy(vec2: Vec2): Vec2 {
    this.x = vec2.x;
    this.y = vec2.y;
    return this;
  }

  set(x: number, y: number): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }
}

class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  copy(vec3: Vec3): Vec3 {
    this.x = vec3.x;
    this.y = vec3.y;
    this.z = vec3.z;
    return this;
  }

  set(x: number, y: number, z: number): Vec3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
}

class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  
  copy(vec4: Vec4): Vec4 {
    this.x = vec4.x;
    this.y = vec4.y;
    this.z = vec4.z;
    this.w = vec4.w;
    return this;
  }

  set(x: number, y: number, z: number, w: number): Vec4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
}

class Mat3 {
  x: number;
  y: number;
  z: number;
  w: number;
}

class Mat4 {
  x: number;
  y: number;
  z: number;
  w: number;
}