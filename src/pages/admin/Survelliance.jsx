import React, { useEffect, useRef, useState } from "react";
import { Camera, Video, Square } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function SurveillancePageSurveillancePage() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const trackIdRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);

  // -----------------------
  // LOAD SESSION INFO SAFELY (FIXED)
  // -----------------------
  useEffect(() => {
    let isMounted = true;

    const loadSession = () => {
      try {
        const saved = localStorage.getItem("surv_session_info");
        if (saved) {
          const info = JSON.parse(saved);

          // Defer setState to next microtask → prevents cascading render warning
          setTimeout(() => {
            if (isMounted) {
              setSessionInfo(info);
              console.log("📡 Loaded Surveillance Session Info:", info);
            }
          }, 0);
        }
      } catch (error) {
        console.error("Failed to load surveillance session:", error);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // -----------------------
  // START STREAM
  // -----------------------
  const startStream = async () => {
    if (!sessionInfo) {
      setError("❗ Session information missing.");
      return;
    }

    if (isStreaming) return;

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
      setIsStreaming(true);

      await new Promise((r) => setTimeout(r, 50));

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const payload = {
        sdp: offer.sdp,
        type: offer.type,
        year: sessionInfo.year,
        semester: sessionInfo.semester,
        program: sessionInfo.program,
        unmarked_students: sessionInfo.unmarked_students,
        session_id: sessionInfo.session_id,
      };

      const res = await fetch(`${API_URL}/surveillance/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      await pc.setRemoteDescription({
        sdp: data.sdp,
        type: data.type,
      });

      trackIdRef.current = data.track_id;

      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to start stream");
      setStatus("error");
      setIsStreaming(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
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
          `${API_URL}/surveillance/stop/${trackIdRef.current}`,
          { method: "POST" }
        );

        const result = await res.json();
        console.log(result);

        // Redirect after backend stops
        window.location.href = "/admin/attendance";
      } catch (err) {
        console.log(err);
        setError("Error stopping surveillance");
      }
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-xl">
            <Camera className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Surveillance Mode
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Live student monitoring using AI-powered WebRTC Surveillance.
          </p>
        </div>

        {/* VIDEO STREAM */}
        {isStreaming && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              Live Surveillance Feed
            </h3>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl border-4 border-green-300"
            />

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full shadow">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Surveillance Active
              </span>
            </div>
          </div>
        )}

        {/* STATUS LOADING */}
        {status === "loading" && !isStreaming && (
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-green-200">
            <div className="flex justify-center items-center gap-3">
              <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-green-600"></div>
              <span className="text-gray-700">Initializing camera...</span>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={startStream}
            disabled={isStreaming || status === "loading"}
            className={`px-6 py-3 rounded-xl text-white shadow-lg flex items-center gap-2 ${
              isStreaming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-700 hover:opacity-90"
            }`}
          >
            <Video className="w-5 h-5" />
            {isStreaming ? "Streaming..." : "Start Surveillance"}
          </button>

          <button
            onClick={stopStream}
            disabled={!isStreaming || status === "loading"}
            className={`px-6 py-3 rounded-xl text-white shadow-lg flex items-center gap-2 ${
              !isStreaming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90"
            }`}
          >
            <Square className="w-5 h-5" />
            Stop Surveillance
          </button>
        </div>

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
