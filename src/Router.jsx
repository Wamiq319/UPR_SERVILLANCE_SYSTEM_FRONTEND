import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  DashboardPage,
  AdminLayout,
  RecordPage,
  AttendanceReportPage,
  StudentSurveillanceReport,
  CourseSurveillanceReport,
  LiveAttendancePage,
} from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="records" element={<RecordPage />} />
          <Route path="attendance" element={<AttendanceReportPage />} />
          <Route
            path="students_reports"
            element={<StudentSurveillanceReport />}
          />
          <Route path="course_reports" element={<CourseSurveillanceReport />} />
          <Route path="live_attendance" element={<LiveAttendancePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
