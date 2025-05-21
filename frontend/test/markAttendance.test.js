import { jest } from "@jest/globals";
import axios from "axios";
import { markAttendance } from "../src/api/attendance.js";

jest.mock("axios");

describe("markAttendance()", () => {
  test("sends payload and returns data", async () => {
    const fakeResponse = { data: { success: true } };
    axios.post.mockResolvedValue(fakeResponse);

    const payload = { name: "Bob", email: "bob@x.com", image: "base64" };
    const res = await markAttendance(payload);

    expect(axios.post).toHaveBeenCalledWith("/attendance", payload);
    expect(res).toEqual(fakeResponse.data);
  });
});
