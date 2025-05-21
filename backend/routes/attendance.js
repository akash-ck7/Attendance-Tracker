import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";
import { getFaceDescriptor } from "../utils/face-helpers.js";

export default async function (fastify) {
  fastify.post("/api/attendance", async (request, reply) => {
    try {
      const { name, email, image } = request.body;

      if (!name || !email || !image) {
        return reply
          .status(400)
          .send({ error: "Name, email, and image are required." });
      }

      const currentDescriptor = await getFaceDescriptor(image);
      if (!currentDescriptor) {
        return reply
          .status(400)
          .send({ error: "Could not detect face in submitted image." });
      }

      //  Load the registered user here
      const user = await User.findOne({ email });
      if (!user) {
        return reply.status(404).send({
          error:
            "User not registered. Please register before marking attendance.",
        });
      }

      // Comparing descriptor to registered face for image-scanning
      const faceDistance = (desc1, desc2) =>
        Math.sqrt(
          desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
        );

      const distance = faceDistance(currentDescriptor, user.faceDescriptor);
      fastify.log.info(`🔍 Face distance from registered user: ${distance}`);

      if (distance > 0.6) {
        return reply.status(400).send({
          error: `Face does not match registered user. Distance: ${distance.toFixed(
            4
          )}`,
        });
      }

      //  Continue with attendance logging
      const lastRecord = await Attendance.findOne({ email }).sort({
        timestamp: -1,
      });
      const action =
        !lastRecord || lastRecord.action === "EXIT" ? "ENTRY" : "EXIT";

      const newRecord = new Attendance({
        name,
        email,
        image,
        action,
        timestamp: new Date(),
      });

      await newRecord.save();

      return reply.status(200).send({
        success: true,
        message: `Attendance ${action} recorded.`,
        action,
        record: newRecord,
      });
    } catch (err) {
      fastify.log.error("Error in attendance POST:", err);
      return reply.status(500).send({
        error: "Error processing attendance.",
        details: err.message,
      });
    }
  });

  //get api call here we will retrive all our attendance record

  fastify.get("/api/attendance", async (request, reply) => {
    try {
      const records = await Attendance.find().sort({ timestamp: -1 });
      return reply.send({ success: true, records });
    } catch (err) {
      fastify.log.error(" Error in attendance GET:", err);
      return reply.status(500).send({
        error: "Failed to fetch attendance records.",
        details: err.message || String(err),
      });
    }
  });
}
