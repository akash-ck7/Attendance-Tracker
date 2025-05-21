import User from "../models/user.model.js";
import { getFaceDescriptor } from "../utils/face-helpers.js";

function faceDistance(desc1, desc2) {
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
}

export default async function (fastify) {
  fastify.post("/api/register", async (request, reply) => {
    try {
      const { name, email, image } = request.body;

      if (!name || !email || !image) {
        return reply
          .status(400)
          .send({ error: "Name, email, and image are required." });
      }

      const descriptor = await getFaceDescriptor(image);
      if (!descriptor) {
        return reply
          .status(400)
          .send({ error: "No face detected in the image." });
      }

      const allUsers = await User.find();

      // Check if email already exists
      const existingEmailUser = allUsers.find((u) => u.email === email);

      // Check if face already exists
      let matchedFaceUser = null;
      for (const user of allUsers) {
        const distance = faceDistance(descriptor, user.faceDescriptor);
        if (distance < 0.6) {
          matchedFaceUser = user;
          break;
        }
      }

      // 1. Face already exists with different email ->
      if (matchedFaceUser && matchedFaceUser.email !== email) {
        return reply.status(409).send({
          error: `This face is already registered with another email: ${matchedFaceUser.email}`,
        });
      }

      // 2. Email exists with a different face
      if (existingEmailUser && !matchedFaceUser) {
        return reply.status(409).send({
          error: "This email is already registered with a different face.",
        });
      }

      // 3. Both face and email match (duplicate submit)
      if (
        existingEmailUser &&
        matchedFaceUser &&
        existingEmailUser._id.equals(matchedFaceUser._id)
      ) {
        return reply.status(409).send({
          error: "This user is already registered.",
        });
      }

      // Valid new user: save it to the database
      const newUser = new User({
        name,
        email,
        faceDescriptor: Array.from(descriptor),
      });

      await newUser.save();

      return reply.send({
        success: true,
        message: "User registered successfully.",
      });
    } catch (err) {
      fastify.log.error("❌ Error in register POST:", err.stack || err);
      return reply.status(500).send({ error: "Registration failed." });
    }
  });
}
