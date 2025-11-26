import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from "@/redux/slices/resourcesSLice";
import { DataTable, Button } from "@/components";

const AttendanceReportPage = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.resources);

  const [className, setClassName] = useState("");
  const [semester, setSemester] = useState("");
  const [courseName, setCourseName] = useState("");

  const resourcePath = `attendance/report/${className}/${semester}/${courseName}`;
  const reportData = data[resourcePath] || {};

  const handleFetch = () => {
    if (!className || !semester || !courseName) return;

    dispatch(
      fetchResources({
        resource: "attendance/report",
        method: "POST",
        body: {
          class_name: className,
          semester: Number(semester),
          course_name: courseName,
        },
      })
    );
  };

  // Flatten records for table
  const flattenedRecords = (reportData.records || []).map((r) => ({
    roll_no: r.roll_no,
    student_name: r.student_name,
    session_date: r.session_date,
    status: r.status,
  }));

  const tableHeader = [
    { label: "Roll No", key: "roll_no" },
    { label: "Student Name", key: "student_name" },
    { label: "Session Date", key: "session_date" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Attendance Report
      </h1>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Class Name (e.g., SE101)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          placeholder="Semester (e.g., 1)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Button
          onClick={handleFetch}
          className="px-6 py-2 self-start border rounded"
        >
          {status === "loading" ? "Loading..." : "Fetch Report"}
        </Button>
      </div>

      {/* Table */}
      {flattenedRecords.length > 0 ? (
        <DataTable
          heading={`Attendance Report for ${className} - ${courseName} (Semester ${semester})`}
          tableHeader={tableHeader}
          tableData={flattenedRecords}
        />
      ) : (
        status !== "loading" && (
          <div className="text-center py-12 rounded-lg border border-gray-300 text-gray-500">
            No records found.
          </div>
        )
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttendanceReportPage;
