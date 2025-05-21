import React, { useEffect, useState } from "react";
import { fetchAttendance } from "../api/attendance";
import { Table, Spinner } from "react-bootstrap";

function AttendanceDashboard({ refresh }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetchAttendance();
      setRecords(res.records || []);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [refresh]);

  return (
    <div className="mt-4 p-3 bg-white shadow-sm rounded">
      <h4 className="mb-3 text-primary">Attendance History</h4>
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center text-muted py-5">No attendance records found.</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr key={i}>
                <td>
                  <img
                    src={record.image}
                    alt="face"
                    className="rounded-circle"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                </td>
                <td className="align-middle">{record.name}</td>
                <td className="align-middle">{record.email}</td>
                <td
                  className={`fw-bold align-middle ${
                    record.action === "ENTRY" ? "text-success" : "text-danger"
                  }`}
                >
                  {record.action}
                </td>
                <td className="align-middle">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default AttendanceDashboard;