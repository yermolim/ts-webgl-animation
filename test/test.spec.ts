import "jasmine-spec-reporter";

import { Square } from "../src/webgl/primitives/square";

describe("Square", () => {
  const square = new Square(1);
  it("should instantiate", () => {
    expect(square).toBeTruthy();
  });
});
