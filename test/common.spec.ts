import { getRandomUuid, getRandomInt, getRandomArbitrary, hexToRgbaString } from "../src/common";
import "jasmine-spec-reporter";

describe("getRandomUuid", () => {
  const uuid1 = getRandomUuid();  
  it("should produce string with length 43", () => {
    expect(typeof(uuid1)).toEqual("string");
  });  
  const uuid2 = getRandomUuid();
  it("uuids must be different", () => {
    expect(uuid1).not.toEqual(uuid2);
  });
});

describe("getRandomInt", () => {
  const min = -100;
  const max = 100;
  let notInt: boolean;
  let outsideRange: boolean;
  for (let i = 0; i < 100; i++) {
    const rndNumber = getRandomInt(min, max);
    if (!Number.isInteger(rndNumber)) {
      notInt = true;
      break;
    }
    if (rndNumber < min || rndNumber > max) {
      outsideRange = true;
      break;
    }
  }
  it("should produce integer", () => {
    expect(notInt).toBeFalsy();
  });
  it("should be equal or less than max and equal of less than min", () => {
    expect(outsideRange).toBeFalsy();
  });
});

describe("getRandomArbitrary", () => {
  const min = -100;
  const max = 100;
  let notNumber: boolean;
  let outsideRange: boolean;
  for (let i = 0; i < 100; i++) {
    const rndNumber = getRandomArbitrary(min, max);
    if (Number.isNaN(rndNumber)) {
      notNumber = true;
      break;
    }
    if (rndNumber < min || rndNumber > max) {
      outsideRange = true;
      break;
    }
  }
  it("should produce number", () => {
    expect(notNumber).toBeFalsy();
  });
  it("should be equal or less than max and equal of less than min", () => {
    expect(outsideRange).toBeFalsy();
  });
});

describe("hexToRgbaString", () => {
  const result1 = hexToRgbaString("FFFFFF", 1);
  const result2 = hexToRgbaString("#000000", 1);
  const result3 = hexToRgbaString("#56F5E0", 0.8);

  const expected1 = "rgba(255,255,255,1)";
  const expected2 = "rgba(0,0,0,1)";
  const expected3 = "rgba(86,245,224,0.8)";

  it("outputs should be equal to expected", () => {
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
    expect(result3).toEqual(expected3);
  });
});