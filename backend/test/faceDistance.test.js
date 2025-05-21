import { faceDistance } from "../utils/face-helpers.js";

describe("faceDistance()", () => {
  test("identical vectors → 0", () => {
    const v = [0.2, 0.2, 0.2];
    expect(faceDistance(v, v)).toBeCloseTo(0);
  });

  test("different vectors → > 0", () => {
    const d = faceDistance([0, 0, 0], [1, 0, 0]);
    expect(d).toBeCloseTo(1);
  });
});
