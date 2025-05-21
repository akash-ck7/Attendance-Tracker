import Fastify from "fastify";
import registerRoute from "../routes/register.js";

const build = () => {
  const app = Fastify();
  app.register(registerRoute);
  return app;
};

describe("POST /api/register – basic validation", () => {
  test("400 when name missing", async () => {
    const app = build();
    const res = await app.inject({
      method: "POST",
      url: "/api/register",
      payload: { email: "a@b.com", image: "data:image/png;base64,abc" },
    });
    expect(res.statusCode).toBe(400);
  });
});
