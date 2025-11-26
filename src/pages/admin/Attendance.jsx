import React, { useState } from "react";
import {
  FileText,
  Users,
  BookOpen,
  CalendarDays,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DataTable, Button } from "@/components";

const API_URL = import.meta.env.VITE_API_URL;

export default function AttendanceReportPage() {
  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [courseName, setCourseName] = useState("");

  const [result, setResult] = useState(null);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!className || !semester || !courseName) return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${API_URL}/attendance/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_name: className,
          semester: Number(semester),
          course_name: courseName,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Error fetching report");

      setResult(result);
      setData(result.records || []);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const tableHeader = [
    { label: "Roll No", key: "roll_no" },
    { label: "Student Name", key: "student_name" },
    { label: "Session Date", key: "session_date" },
  ];

  const presentCount = data.filter((r) => r.status === "Present").length;
  const absentCount = data.filter((r) => r.status === "Absent").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ==== HEADER ==== */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl shadow-xl mb-4">
            <FileText className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
            Attendance Report
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            View detailed attendance logs, insights, and performance overview.
          </p>
        </div>

        {/* ==== FILTER SECTION ==== */}
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-teal-500"
            />
            <input
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-teal-500"
            />

            <Button
              onClick={handleFetch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:opacity-90"
            >
              {status === "loading" ? "Loading..." : "Fetch Report"}
            </Button>
          </div>
        </div>

        {/* ==== SUMMARY CARDS ==== */}
        {result && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* CARD 1: COURSE INFO */}
            <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl shadow">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Course Info
                </h3>
              </div>
              <div className="mt-4 text-gray-700 space-y-1">
                <p>
                  <b>Class:</b> {result.class_name}
                </p>
                <p>
                  <b>Semester:</b> {result.semester}
                </p>
                <p>
                  <b>Course:</b> {result.course_name}
                </p>
                <p>
                  <b>Course ID:</b> {result.course_id}
                </p>
              </div>
            </div>

            {/* CARD 2: SUMMARY */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Summary</h3>
              </div>
              <div className="mt-4 text-gray-700 space-y-1">
                <p>
                  <b>Total Records:</b> {result.total_records}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" /> Present:{" "}
                  {presentCount}
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" /> Absent:{" "}
                  {absentCount}
                </p>
              </div>
            </div>

            {/* CARD 3: PERCENTAGE */}
            <div className="p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border shadow hover:shadow-xl transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow">
                  <CalendarDays className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Attendance %
                </h3>
              </div>
              <div className="mt-4 text-gray-700">
                <p className="text-4xl font-bold">
                  {((presentCount / result.total_records) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==== TABLE ==== */}
        {data.length > 0 ? (
          <DataTable
            heading={`Attendance Report for ${className} - ${courseName} (Sem ${semester})`}
            tableHeader={tableHeader}
            tableData={data}
          />
        ) : (
          status !== "loading" && (
            <div className="text-center py-12 border rounded-xl bg-white shadow text-gray-500">
              No records found.
            </div>
          )
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
