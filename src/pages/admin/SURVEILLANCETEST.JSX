import React, { useEffect, useRef, useState } from "react";

export default function WebcamWebRTC() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const trackIdRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);

  // ---------------------------
  // Read session info sent from attendance
  // ---------------------------
  const [sessionInfo, setSessionInfo] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("surv_session_info");
    if (saved) {
      const info = JSON.parse(saved);
      setSessionInfo(info);
      console.log("📡 Surveillance Session Info:", info);
    }
  }, []);

  // -----------------------
  // START STREAM
  // -----------------------
  const startStream = async () => {
    if (!sessionInfo) {
      alert("❗ Session info missing. Cannot start surveillance.");
      return;
    }

    if (isStreaming) return;

    if (pcRef.current && pcRef.current.signalingState === "closed") {
      pcRef.current = null;
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;
    trackIdRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch (_) {}
      }
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // -----------------------
      // Send payload to backend with dynamic attendance fields
      // -----------------------
      const payload = {
        sdp: pc.localDescription.sdp,
        type: pc.localDescription.type,
        year: sessionInfo.year,
        semester: sessionInfo.semester,
        program: sessionInfo.program,
        unmarked_students: sessionInfo.unmarked_students,
        session_id: sessionInfo.session_id,
  
      };

      const res = await fetch("http://localhost:8000/surveillance/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(Backend returned ${res.status}: ${txt || res.statusText});
      }

      const data = await res.json();

      if (!pcRef.current || pcRef.current.signalingState === "closed") {
        pcRef.current && pcRef.current.close();
        pcRef.current = null;
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        return;
      }

      await pcRef.current.setRemoteDescription({ sdp: data.sdp, type: data.type });
      trackIdRef.current = data.track_id || null;
      setIsStreaming(true);
      console.log("WebRTC Connected ✔", { track_id: trackIdRef.current });

    } catch (err) {
      console.error("Error starting stream:", err);
      if (pcRef.current) pcRef.current.close();
      pcRef.current = null;
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  // -----------------------
  // STOP STREAM
  // -----------------------
  const stopStream = async () => {
    setIsStreaming(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((s) => s.track && s.track.stop());
      pcRef.current.close();
      pcRef.current = null;
    }

    if (trackIdRef.current) {
      try {
        const res = await fetch(http://localhost:8000/surveillance/stop/${trackIdRef.current}, { method: "POST" });
        const data = await res.json();
        if (data.redirect_to) window.location.href = data.redirect_to; // auto redirect after stop
      } catch (err) {
        console.error("Error stopping backend stream:", err);
      }
      trackIdRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebRTC Surveillance System</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: "640px", height: "480px", background: "#222", borderRadius: "10px" }} />
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={startStream} style={{ padding: "10px 20px", fontSize: "16px", background: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          ▶ START VIDEO
        </button>
        <button onClick={stopStream} style={{ padding: "10px 20px", fontSize: "16px", background: "red", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          ■ STOP VIDEO
        </button>
      </div>
    </div>
  );
}