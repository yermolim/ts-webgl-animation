import { getRandomUuid, hexToRgbaString } from "../src/common";
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