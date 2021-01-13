import { radToDeg, degToRad, getDistance2D, getDistance3D, clamp, lerp, Vec2, Vec3, Vec4, Mat3, Mat4, Quaternion, EulerAngles } from "../src/math";
import "jasmine-spec-reporter";

describe("radToDeg", () => {
  const result1 = radToDeg(Math.PI / 4);
  const result2 = radToDeg(Math.PI);
  const result3 = radToDeg(Math.PI * 1.25);

  const expected1 = 45;
  const expected2 = 180;
  const expected3 = 225;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("degToRad", () => {
  const result1 = degToRad(45);
  const result2 = degToRad(180);
  const result3 = degToRad(225);

  const expected1 = Math.PI / 4;
  const expected2 = Math.PI;
  const expected3 = Math.PI * 1.25;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("getDistance2D", () => {
  const result1 = getDistance2D(0, 10, 0, 60);
  const result2 = Math.round(getDistance2D(-10, -55, 60, 90));
  const result3 = Math.round(getDistance2D(-18.6, 113, 0, -90));

  const expected1 = 50;
  const expected2 = 161;
  const expected3 = 204;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("getDistance3D", () => {
  const result1 = getDistance3D(0, 10, 0, 0, 60, 0);
  const result2 = Math.round(getDistance3D(-10, -55, -65, 60, 90, 110));
  const result3 = Math.round(getDistance3D(-18.6, 113, -5, 0, -90, 7.7));

  const expected1 = 50;
  const expected2 = 238;
  const expected3 = 204;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("clamp", () => {
  const result1 = clamp(5, 1, 5);
  const result2 = clamp(10, 1, 5);
  const result3 = clamp(-2, 1, 5);

  const expected1 = 5;
  const expected2 = 5;
  const expected3 = 1;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("lerp", () => {
  const result1 = lerp(1, 5, 0.2);
  const result2 = lerp(0, 5, 0.2);
  const result3 = lerp(55, 230, 0.7);

  const expected1 = 1.8;
  const expected2 = 1;
  const expected3 = 177.5;

  it("results should equal to expected ones", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});

describe("Mat4", () => { 
  const matTest = new Mat4();
  it("parameterless constructor should create identity matrix", () => {
    expect(matTest.matrix.toString()).toEqual("1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1");
  });

  const mat1 = new Mat4().set(
    11, 12, 13, 14, 
    21, 22, 23, 24, 
    31, 32, 33, 34, 
    41, 42, 43, 44    
  );
  const mat2 = new Mat4().set(...[11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]); 
  it("set method overloads should work correctly", () => {
    expect(mat1.matrix.toString()).toEqual("11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44");
    expect(mat2.matrix.toString()).toEqual("11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44");
  });

  it("equals method should work correctly", () => {
    expect(mat1.equals(mat2)).toBeTruthy();
    expect(matTest.equals(mat1)).toBeFalsy();
  });

  it("cloning should work correctly", () => {
    expect(matTest.clone().equals(matTest)).toBeTruthy();
    expect(Mat4.fromMat4(matTest).equals(matTest)).toBeTruthy();
  });
  
  it("transpose should work correctly", () => {
    expect(Mat4.transpose(mat1).matrix.toString()).toEqual("11,21,31,41,12,22,32,42,13,23,33,43,14,24,34,44");
    expect(mat1.transpose().matrix.toString()).toEqual("11,21,31,41,12,22,32,42,13,23,33,43,14,24,34,44");
    expect(mat1.transpose().matrix.toString()).toEqual("11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44");
  });
  
  const matScale = Mat4.buildScale(3);
  it("scale matrix builder should create correct scale matrix", () => {
    expect(matScale.matrix.toString()).toEqual("3,0,0,0,0,3,0,0,0,0,3,0,0,0,0,1");
  });
  
  const matTranslate = Mat4.buildTranslate(30, 70, -10);
  it("translate matrix builder should correct valid translate matrix", () => {
    expect(matTranslate.matrix.toString()).toEqual("1,0,0,0,0,1,0,0,0,0,1,0,30,70,-10,1");
  });
    
  const angleX = Math.PI/6;
  const cX = Math.cos(angleX);
  const sX = Math.sin(angleX);
  const matRotationX = Mat4.buildRotationX(angleX);
  const matRotationXRef = new Mat4().set(
    1, 0, 0, 0, 
    0, cX, sX, 0,
    0, -sX, cX, 0,
    0, 0, 0, 1
  );  
  const angleY = Math.PI/4;
  const cY = Math.cos(angleY);
  const sY = Math.sin(angleY);
  const matRotationY = Mat4.buildRotationY(angleY);
  const matRotationYRef = new Mat4().set(
    cY, 0, -sY, 0, 
    0, 1, 0, 0,
    sY, 0, cY, 0,
    0, 0, 0, 1
  ); 
  const angleZ = -Math.PI/2;
  const cZ = Math.cos(angleZ);
  const sZ = Math.sin(angleZ);
  const matRotationZ = Mat4.buildRotationZ(angleZ);
  const matRotationZRef = new Mat4().set(
    cZ, sZ, 0, 0, 
    -sZ, cZ, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
  it("rotation matrix builders should correct valid rotation matrices", () => {
    expect(matRotationX.equals(matRotationXRef)).toBeTruthy();
    expect(matRotationY.equals(matRotationYRef)).toBeTruthy();
    expect(matRotationZ.equals(matRotationZRef)).toBeTruthy();
  });

  const matRotation = matRotationX.clone().multiply(matRotationY).multiply(matRotationZ);
  const matTransform = matTranslate.clone().multiply(matRotation).multiply(matScale);
  const matTransformInv = Mat4.inverse(matTransform);
  const matTestMultiplied = matTest.clone().multiply(matTransform);
  const matTestInverted = matTestMultiplied.clone().multiply(matTransformInv);
  it("inversion and multiplication should return correct matrix", () => {
    expect(Mat4.inverse(matTransformInv).equals(matTransform)).toBeTruthy();    
    expect(matTest.equals(matTestInverted)).toBeTruthy();    
  });

  const {t, r, s} = matTestMultiplied.getTRS();
  it("composition and decomposition should return correct matrix", () => {
    expect(Mat4.fromTRS(t, r, s).equals(matTestMultiplied)).toBeTruthy();    
    expect(Mat4.fromQuaternion(r).equals(matRotation)).toBeTruthy(); 
  });
});