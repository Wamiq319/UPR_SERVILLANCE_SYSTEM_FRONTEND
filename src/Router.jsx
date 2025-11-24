import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage, DashboardPage } from "@/pages";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
