import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  Camera,
  Play,
  UserCheck,
  FileText,
  Shield,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "Manage Record",
      description: "View, edit and manage all student records",
      icon: Database,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      page: "/manage-record",
    },
    {
      title: "Start Surveillance",
      description: "Activate real-time surveillance monitoring",
      icon: Play,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      page: "/start-surveillance",
    },
    {
      title: "Mark Attendance",
      description: "Mark attendance manually when needed",
      icon: UserCheck,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      page: "/mark-attendance",
    },
    {
      title: "Attendance Reports",
      description: "Generate attendance reports & insights",
      icon: FileText,
      gradient: "from-teal-500 to-green-600",
      bgGradient: "from-teal-50 to-green-50",
      page: "/attendance-reports",
    },
    {
      title: "Surveillance Reports",
      description: "View camera logs, alerts & analytics",
      icon: Camera,
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
      page: "/surveillance-reports",
    },
    {
      title: "System Insights",
      description: "AI-powered activity & performance analysis",
      icon: BarChart3,
      gradient: "from-violet-500 to-fuchsia-600",
      bgGradient: "from-violet-50 to-fuchsia-50",
      page: "/system-insights",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            AI Surveillance & Attendance Dashboard
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Smart monitoring, accurate attendance tracking, and AI-driven
            reporting — all integrated into a single intelligent dashboard.
          </p>
        </div>

        {/* ACTION CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.page)}
              className={`cursor-pointer rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 bg-gradient-to-br ${card.bgGradient} p-8 flex flex-col justify-between`}
            >
              {/* ICON */}
              <div
                className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className="w-9 h-9 text-white" />
              </div>

              {/* TITLE + DESCRIPTION */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* BUTTON */}
              <div>
                <button className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition">
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-green-100">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
            <span className="w-2 h-2 bg-green-600 rounded-full absolute"></span>
            <span className="text-sm font-medium text-gray-700">
              AI System Active — No Issues Detected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
