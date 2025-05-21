import React, { useState } from "react";
import AttendanceDashboard from "./components/AttendanceDashboard";
import AttendanceForm from "./components/AttendanceForm";
import RegisterForm from "./components/RegisterForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);

  const refreshAttendance = () => setRefresh((prev) => !prev);

  const handleMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div>
      <h1 className="mb-4 text-primary text-center">
        Kriyadocs Attendance App
      </h1>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-3 mb-4">
        {!showAttendance ? (
          <>
            <RegisterForm
              onRegisterSuccess={() => {
                handleMessage("User registered successfully!");
                setShowAttendance(true);
              }}
            />
            <div className="text-center mt-3">
              <button
                className="btn btn-link"
                onClick={() => setShowAttendance(true)}
                type="button"
              >
                Already registered? Go to Attendance
              </button>
            </div>
          </>
        ) : (
          <>
            <AttendanceForm
              onAttendanceMarked={() => {
                refreshAttendance();
                handleMessage("Attendance recorded successfully!");
              }}
              onError={(errMsg) => handleMessage(errMsg)}
            />
            <div className="text-center mt-2">
              <button
                className="btn btn-link"
                onClick={() => setShowAttendance(false)}
                type="button"
              >
                Not your device? Back to Registration
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <AttendanceDashboard refresh={refresh} />
      </div>
    </div>
  );
}

export default App;
