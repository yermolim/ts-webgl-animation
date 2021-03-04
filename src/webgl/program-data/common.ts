export const shaderTypes = {
  FRAGMENT_SHADER: 0x8b30,
  VERTEX_SHADER: 0x8b31,
} as const;
export type ShaderType = typeof shaderTypes[keyof typeof shaderTypes];

export const bufferTypes = {
  ARRAY_BUFFER: 0x8892,
  ELEMENT_ARRAY_BUFFER: 0x8893,
  UNIFORM_BUFFER: 0x8a11,
  TRANSFORM_FEEDBACK_BUFFER: 0x8c8e,
} as const;
export type BufferType = typeof bufferTypes[keyof typeof bufferTypes];

export const textureTypes = {
  TEXTURE0: 0x84c0,
  TEXTURE_2D: 0x0DE1,
  TEXTURE_2D_ARRAY: 0x8C1A,
  TEXTURE_3D: 0x806F,
  TEXTURE_CUBE_MAP: 0x8513,
} as const;
export type TextureType = typeof textureTypes[keyof typeof textureTypes];

export const readTexelFormats = {
  RGB: 0x1907,
  RGBA: 0x1908,
  ALPHA: 0x1906,
} as const;
export type ReadTexelFormat = typeof readTexelFormats[keyof typeof readTexelFormats];
export const writeOnlytexelFormats = {
  LUMINANCE: 0x1909,
  LUMINANCE_ALPHA: 0x190A,
  DEPTH_COMPONENT: 0x1902,
} as const;
export type WriteOnlyTexelFormat = typeof writeOnlytexelFormats[keyof typeof writeOnlytexelFormats];
export type TexelFormat = ReadTexelFormat | WriteOnlyTexelFormat;

export const texelTypes = {
  UNSIGNED_BYTE: 0x1401,
  UNSIGNED_SHORT_4_4_4_4: 0x8033,
  UNSIGNED_SHORT_5_5_5_1: 0x8034,
  UNSIGNED_SHORT_5_6_5: 0x8363,
  FLOAT: 0x1406,
} as const;
export type TexelType = typeof texelTypes[keyof typeof texelTypes];

export const numberTypes = {
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  INT: 0x1404,
  UNSIGNED_INT: 0x1405,
  FLOAT: 0x1406,
  BOOL: 0x8B56,	
} as const;
export type NumberType = typeof numberTypes[keyof typeof numberTypes];

export const numberSizes = {
  0x1400: 1,
  0x1401: 1,
  0x1402: 2,
  0x1403: 2,
  0x1404: 4,
  0x1405: 4,
  0x1406: 4,
} as const;

export const uniformFloatTypes = {
  FLOAT: numberTypes.FLOAT,
  FLOAT_VEC2: 0x8B50,	
  FLOAT_VEC3: 0x8B51,	
  FLOAT_VEC4: 0x8B52,	
  FLOAT_MAT2: 0x8B5A,	
  FLOAT_MAT3: 0x8B5B,	
  FLOAT_MAT4: 0x8B5C,	
} as const;
export type UniformFloatType = (typeof uniformFloatTypes[keyof typeof uniformFloatTypes]);

export const uniformIntTypes = {
  INT: numberTypes.INT,
  BOOL: numberTypes.BOOL,
  INT_VEC2: 0x8B53,	
  INT_VEC3: 0x8B54,	
  INT_VEC4: 0x8B55,	
  BOOL_VEC2: 0x8B57,	
  BOOL_VEC3: 0x8B58,	
  BOOL_VEC4: 0x8B59,
} as const;
export type UniformIntType = (typeof uniformIntTypes[keyof typeof uniformIntTypes]);

export type UniformType = UniformFloatType | UniformIntType;

export const uniformSizes = {
  0x8B50: numberSizes[numberTypes.FLOAT] * 2,
  0x8B51: numberSizes[numberTypes.FLOAT] * 3,
  0x8B52: numberSizes[numberTypes.FLOAT] * 2,
  0x8B53: numberSizes[numberTypes.INT] * 2,
  0x8B54: numberSizes[numberTypes.INT] * 2,
  0x8B55: numberSizes[numberTypes.INT] * 2,
  0x8B56: numberSizes[numberTypes.INT],
  0x8B57: numberSizes[numberTypes.INT] * 9,
  0x8B58: numberSizes[numberTypes.INT] * 16,
  0x8B59: numberSizes[numberTypes.INT] * 16,
  0x8B5A: numberSizes[numberTypes.FLOAT] * 4,
  0x8B5B: numberSizes[numberTypes.FLOAT] * 9,
  0x8B5C: numberSizes[numberTypes.FLOAT] * 16,
} as const;

export const samplerTypes = {
  SAMPLER_2D: 0x8B5E,	
  SAMPLER_CUBE: 0x8B60,
  SAMPLER_3D: 0x8B5F,	
  SAMPLER_2D_SHADOW: 0x8B62,	
  SAMPLER_2D_ARRAY: 0x8DC1,	
  SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,	
  SAMPLER_CUBE_SHADOW: 0x8DC5,	
  INT_SAMPLER_2D: 0x8DCA,	
  INT_SAMPLER_3D: 0x8DCB,	
  INT_SAMPLER_CUBE: 0x8DCC,	
  INT_SAMPLER_2D_ARRAY: 0x8DCF,	
  UNSIGNED_INT_SAMPLER_2D: 0x8DD2,	
  UNSIGNED_INT_SAMPLER_3D: 0x8DD3,	
  UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,	
  UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,
} as const;
export type SamplerType = (typeof samplerTypes[keyof typeof samplerTypes]);

export const otherDataTypes = {
  FLOAT_MAT2x3: 0x8B65,	
  FLOAT_MAT2x4: 0x8B66,	
  FLOAT_MAT3x2: 0x8B67,	
  FLOAT_MAT3x4: 0x8B68,	
  FLOAT_MAT4x2: 0x8B69,	
  FLOAT_MAT4x3: 0x8B6A,	
  UNSIGNED_INT_VEC2: 0x8DC6,	
  UNSIGNED_INT_VEC3: 0x8DC7,	
  UNSIGNED_INT_VEC4: 0x8DC8,	
} as const;
export type OtherDataType = (typeof otherDataTypes[keyof typeof otherDataTypes]);
export const otherDataSizes = {
  0x8B65: numberSizes[numberTypes.FLOAT] * 6,
  0x8B66: numberSizes[numberTypes.FLOAT] * 8,
  0x8B67: numberSizes[numberTypes.FLOAT] * 6,
  0x8B68: numberSizes[numberTypes.FLOAT] * 12,
  0x8B69: numberSizes[numberTypes.FLOAT] * 8,
  0x8B6A: numberSizes[numberTypes.FLOAT] * 12,
  0x8DC6: numberSizes[numberTypes.UNSIGNED_INT] * 2,
  0x8DC7: numberSizes[numberTypes.UNSIGNED_INT] * 3,
  0x8DC8: numberSizes[numberTypes.UNSIGNED_INT] * 4,
} as const;

export const indexTypes = {
  UNSIGNED_BYTE: numberTypes.UNSIGNED_BYTE,
  UNSIGNED_SHORT: numberTypes.UNSIGNED_SHORT,
  UNSIGNED_INT: numberTypes.UNSIGNED_INT,
} as const;
export type IndexType = (typeof indexTypes[keyof typeof indexTypes]);

export const bufferUsageTypes = {
  STATIC_DRAW: 0x88E4,
  STREAM_DRAW: 0x88E0,
  DYNAMIC_DRAW: 0x88E8,
} as const;
export type BufferUsageType = (typeof bufferUsageTypes[keyof typeof bufferUsageTypes]);

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array;

export function getNumberTypeByArray(typedArray: TypedArray): NumberType {
  if (typedArray instanceof Int8Array) {
    return numberTypes.BYTE;
  };     
  if (typedArray instanceof Uint8Array
    || typedArray instanceof Uint8ClampedArray) {
    return numberTypes.UNSIGNED_BYTE;
  };    
  if (typedArray instanceof Int16Array) {
    return numberTypes.SHORT;
  };    
  if (typedArray instanceof Uint16Array) {
    return numberTypes.UNSIGNED_SHORT;
  };    
  if (typedArray instanceof Int32Array) {
    return numberTypes.INT;
  };    
  if (typedArray instanceof Uint32Array) {
    return numberTypes.UNSIGNED_INT;
  };    
  if (typedArray instanceof Float32Array) {
    return numberTypes.FLOAT;
  };   
  throw new Error("Unsupported array type");
}
