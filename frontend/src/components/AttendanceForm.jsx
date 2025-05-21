import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { markAttendance } from "../api/attendance";
import "./AttendanceForms.css";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

export default function AttendanceForm({ onAttendanceMarked }) {
  const webcamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const openCamera = () => {
    setCameraOn(true);
    setCapturedImage(null);
    setError("");
    setSuccessMessage("");
  };

  const handleUserMediaError = (error) => {
    console.error("Webcam error:", error);
    setError("Cannot access camera. Please check permissions or try again.");
    setCameraOn(false);
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setCameraOn(false);
      setError("");
    } else {
      setError("Failed to capture image, please try again.");
    }
  }, [webcamRef]);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

 const submitAttendance = async () => {
  setError("");
  setSuccessMessage("");

  if (!name.trim() || !email.trim() || !capturedImage) {
    setError("Please fill all fields and capture an image.");
    return;
  }
  if (!isValidEmail(email.trim())) {
    setError("Please enter a valid email address.");
    return;
  }

  setLoading(true);
  try {
    const response = await markAttendance({
      name: name.trim(),
      email: email.trim(),
      image: capturedImage,
    });
    console.log("response from attenadace js ",response)
    const action = response.action; 

    setLoading(false);
    setName("");
    setEmail("");
    setCapturedImage(null);

    if (onAttendanceMarked) onAttendanceMarked();

    setSuccessMessage(`Attendance ${action} marked successfully!`);
  } catch (err) {
    if (err?.response?.data?.error) {
  setError(`${err.response.data.error}`);
} else if (err?.response?.data?.message) {
  setError(`${err.response.data.message}`);
} else if (err?.message) {
  setError(`${err.message}`);
} else {
  setError(`Error marking attendance.${err} `);
}
    setLoading(false);
    console.error("Attendance submission error:", err);
  }
};

  return (
    <div className="attendance-card mb-4" style={{ maxWidth: 400, margin: "auto" }}>
      <h2 className="text-center mb-3">Mark Attendance</h2>

      <div className="text-center">
        {!cameraOn && !capturedImage && (
          <button onClick={openCamera} className="btn btn-primary mb-3" type="button">
            Open Camera
          </button>
        )}

        {cameraOn && (
          <div className="mb-3">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              style={{ borderRadius: 8, border: "1px solid #ccc" }}
            />
            <br />
            <button onClick={capture} className="btn btn-success mt-2" type="button">
              Capture
            </button>
            <button onClick={() => setCameraOn(false)} className="btn btn-secondary mt-2 ms-2" type="button">
              Cancel
            </button>
          </div>
        )}

        {capturedImage && (
          <div className="mb-3">
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button onClick={() => setCapturedImage(null)} className="btn btn-secondary mt-2" type="button">
              Retake
            </button>
          </div>
        )}
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="text-center">
        <button onClick={submitAttendance} className="btn btn-primary" disabled={loading} type="button">
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
}