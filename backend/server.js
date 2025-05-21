import Fastify from "fastify";
import mongoose from "mongoose";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { loadModels } from "./utils/face-helpers.js";
import attendanceRoutes from "./routes/attendance.js";
import registerRoute from "./routes/register.js";

// Load environment variables
dotenv.config();
console.log(" Environment variables loaded");

const fastify = Fastify({ logger: true });

// Enable CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
});

// Load face-api models
try {
  await loadModels();
  fastify.log.info("Face-api models loaded");
} catch (error) {
  fastify.log.error("Failed to load face-api models", error);
  process.exit(1);
}

// Connect to MongoDB

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/attendance";

fastify.log.info(` Connecting to MongoDB at: ${MONGO_URI}`);

try {
  await mongoose.connect(MONGO_URI);
  fastify.log.info(" MongoDB connected");
} catch (err) {
  fastify.log.error(" MongoDB connection error:", err);
  process.exit(1);
}

// Register routes
fastify.register(registerRoute);
fastify.register(attendanceRoutes);
fastify.log.info(" Routes registered");

// Health check route
fastify.get("/health", async (request, reply) => {
  return { status: "ok" };
});

// Start server
const PORT = process.env.PORT || 5001;
fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(" Server failed to start:", err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
