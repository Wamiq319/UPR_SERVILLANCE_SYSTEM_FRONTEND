import React, { useState } from "react";
import { FileSearch, IdCard, User, AlertTriangle } from "lucide-react";
import { DataTable, Button } from "@/components";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentSurveillanceReport() {
  const [rollNo, setRollNo] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!rollNo.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const query = new URLSearchParams({
        roll_no: rollNo,
        ...(courseName ? { course_name: courseName } : {}),
        ...(semester ? { semester } : {}),
      }).toString();

      const response = await fetch(
        `${API_URL}/surveillance/studentlogs?${query}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error fetching logs");

      setResult(data);
      setLogs(data.logs || []);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const tableHeader = [
    { label: "ID", key: "id" },
    { label: "Location", key: "location_detected" },
    { label: "Camera", key: "camera_id" },
    { label: "Detection Time", key: "detected_time" },
    { label: "Alert Sent", key: "alert_sent" },
    { label: "Student Name", key: "user_name" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl">
            <FileSearch className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Student Surveillance Report
          </h1>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Track student movement across campus using AI-powered surveillance
            logs.
          </p>
        </div>

        {/* FILTER BOX */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-green-200">
          <div className="grid md:grid-cols-4 gap-4 items-center">
            <div className="flex flex-col">
              <label className="font-semibold text-green-700">
                Roll Number *
              </label>
              <input
                placeholder="Enter Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-green-700">
                Course Name
              </label>
              <input
                placeholder="Optional"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-green-700">Semester</label>
              <input
                type="number"
                placeholder="Optional"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-500"
              />
            </div>

            <Button
              onClick={handleFetch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:opacity-90"
            >
              {status === "loading" ? "Loading..." : "Fetch Logs"}
            </Button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        {result && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* STUDENT INFO */}
            <div className="p-6 bg-green-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-xl shadow">
                  <IdCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Student Info
                </h3>
              </div>
              <div className="mt-4 text-gray-700 space-y-1">
                <p>
                  <b>Roll No:</b> {result.roll_no}
                </p>
                <p>
                  <b>Name:</b> {result.logs?.[0]?.user_name || "—"}
                </p>
                <p>
                  <b>Class:</b> {result.class_name}
                </p>
                <p>
                  <b>Semester:</b> {result.semester}
                </p>
              </div>
            </div>

            {/* COURSE INFO */}
            <div className="p-6 bg-emerald-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-xl shadow">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Course Info
                </h3>
              </div>
              <div className="mt-4 text-gray-700 space-y-1">
                <p>
                  <b>Course:</b> {result.course_name || "All"}
                </p>
                <p>
                  <b>Total Logs:</b> {result.total_records}
                </p>
              </div>
            </div>

            {/* ALERTS */}
            <div className="p-6 bg-red-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-xl shadow">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Alerts</h3>
              </div>
              <div className="mt-4 text-gray-700">
                <p className="text-4xl font-bold text-red-600">
                  {result.logs?.filter((l) => l.alert_sent).length || 0}
                </p>
                <p className="text-gray-600">Alerts Sent</p>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        {logs.length > 0 ? (
          <DataTable
            heading={`Surveillance Logs for ${rollNo}`}
            tableHeader={tableHeader}
            tableData={logs}
          />
        ) : (
          status !== "loading" && (
            <div className="text-center py-12 border rounded-xl bg-white shadow text-gray-500">
              No logs found.
            </div>
          )
        )}

        {error && (
          <p className="text-red-500 font-medium text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
