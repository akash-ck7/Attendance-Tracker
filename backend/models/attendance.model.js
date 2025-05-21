// backend/models/attendance.model.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String, // base64 or image URL
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    enum: ["ENTRY", "EXIT"],
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
