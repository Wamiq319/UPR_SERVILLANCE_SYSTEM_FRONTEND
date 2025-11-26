// === UPDATED GREEN THEME VERSION ===

import React, { useRef, useState } from "react";
import {
  Users,
  BookOpen,
  CalendarDays,
  CheckCircle,
  XCircle,
  Video,
  Square,
  Camera,
} from "lucide-react";
import { DataTable, Button } from "@/components";

const API_URL = import.meta.env.VITE_API_URL;

export default function LiveAttendancePage() {
  // Refs
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const trackIdRef = useRef(null);

  // Form States
  const [sessionName, setSessionName] = useState("");
  const [className, setClassName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");

  // UI
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState("idle");
  console.log(status);
  const [error, setError] = useState("");
  const [attendanceResult, setAttendanceResult] = useState(null);

  // -----------------------
  // START STREAM
  // -----------------------
  const startStream = async () => {
    if (isStreaming) return;

    if (!sessionName || !className || !courseName || !semester) {
      setError("Please fill all fields before starting the session");
      return;
    }

    setStatus("loading");
    setError("");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      // CRITICAL FIX: Set streaming to true BEFORE accessing videoRef
      setIsStreaming(true);

      // Wait for React to render the video element
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Safety check
      if (!videoRef.current) {
        throw new Error("Video element not found in DOM");
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const payload = {
        sdp: offer.sdp,
        type: offer.type,
        session: sessionName,
        class_name: className,
        course: courseName,
        semester: parseInt(semester),
      };

      const res = await fetch(`${API_URL}/attendance/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.sdp) throw new Error("Invalid SDP from backend");

      await pc.setRemoteDescription({
        sdp: data.sdp,
        type: data.type,
      });

      trackIdRef.current = data.track_id;
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err.message || "Stream start failed");

      // Clean up on error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsStreaming(false);
    }
  };

  // -----------------------
  // STOP STREAM
  // -----------------------
  const stopStream = async () => {
    setStatus("loading");
    setIsStreaming(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (trackIdRef.current) {
      try {
        const res = await fetch(
          `${API_URL}/attendance/stop/${trackIdRef.current}`,
          { method: "POST" }
        );
        const stopResult = await res.json();
        setAttendanceResult(stopResult);

        const yes = window.confirm(
          "Attendance session completed! Do you want to start surveillance mode?"
        );

        if (yes) {
          localStorage.setItem(
            "surv_session_info",
            JSON.stringify(stopResult.session_info)
          );
          window.location.href = "/surveillance";
        }
      } catch (err) {
        console.log(err);
        setError("Failed to stop session");
      }
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setStatus("idle");
  };

  const tableHeader = [
    { label: "Roll No", key: "roll_no" },
    { label: "Student Name", key: "student_name" },
    { label: "Status", key: "status" },
    { label: "Timestamp", key: "timestamp" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-xl mb-4">
            <Camera className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Live Attendance
          </h1>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Start a live attendance session with real-time face detection.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-green-200">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            <input
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            <input
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={startStream}
              disabled={isStreaming || status === "loading"}
              className={`px-6 py-3 rounded-xl text-white shadow-lg transition-all ${
                isStreaming || status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-90"
              }`}
            >
              <Video className="w-5 h-5 mr-2" />
              {isStreaming
                ? "Streaming..."
                : status === "loading"
                ? "Starting..."
                : "Start Attendance"}
            </Button>

            <Button
              onClick={stopStream}
              disabled={!isStreaming || status === "loading"}
              className={`px-6 py-3 rounded-xl text-white shadow-lg transition-all ${
                !isStreaming || status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90"
              }`}
            >
              <Square className="w-5 h-5 mr-2" />
              {status === "loading" ? "Stopping..." : "Stop Session"}
            </Button>
          </div>
        </div>

        {/* LIVE VIDEO */}
        {isStreaming && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              Live Camera Feed
            </h3>

            <div className="flex justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-4xl rounded-2xl shadow-xl border-4 border-green-300"
              />
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full shadow">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Live - Recording Attendance
              </span>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {status === "loading" && !isStreaming && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 text-center">
            <div className="flex justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="text-gray-700">
                Initializing camera stream...
              </span>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {attendanceResult && (
          <DataTable
            heading={`Attendance Results for ${className} - ${courseName}`}
            tableHeader={tableHeader}
            tableData={attendanceResult.attendance_data}
          />
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
