import { getBaseURL } from "../src/api/index.js";

describe("getBaseURL()", () => {
  test("localhost → http://localhost:5001/api", () => {
    global.window = { location: { hostname: "localhost" } };
    expect(getBaseURL()).toBe("http://localhost:5001/api");
  });

  test("production host → /api", () => {
    global.window = { location: { hostname: "example.com" } };
    expect(getBaseURL()).toBe("/api");
  });
});
