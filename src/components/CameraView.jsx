import { useEffect, useRef, useState } from "react";
function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Detection data from backend
  const [detection, setDetection] = useState(null);

  // =========================
  // OPEN CAMERA
  // =========================
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);

        setError("Cannot access webcam");
        setLoading(false);
      }
    }

    startCamera();

    // Cleanup camera
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // =========================
  // FAKE BACKEND JSON
  // =========================
  useEffect(() => {
  async function loadJson() {
    try {
    //  const response = await fetch("/data.json");
      const response = await fetch(import.meta.env.VITE_HOST);
      const json = await response.json();

      setDetection(json);
    } catch (err) {
      console.error(err);
    }
  }

  loadJson();

  const interval = setInterval(() => {
    loadJson();
  }, 1000);

  return () => clearInterval(interval);
}, []);

  // =========================
  // DRAW DETECTION BOX
  // =========================
  useEffect(() => {
    if (!detection) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Clear old drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Box style
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 4;

    // Draw rectangle
    ctx.strokeRect(
      detection.x,
      detection.y,
      detection.width,
      detection.height
    );

    // Text style
    ctx.font = "24px Arial";
    ctx.fillStyle = "lime";

    // Draw label
    ctx.fillText(
      detection.label,
      detection.x,
      detection.y - 10
    );
  }, [detection]);

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <h1 style={{ color: "white" }}>
        Opening Camera...
      </h1>
    );
  }

  // =========================
  // ERROR SCREEN
  // =========================
  if (error) {
    return (
      <h1 style={{ color: "red" }}>
        {error}
      </h1>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div
      style={{
        position: "relative",
        width: "640px",
        height: "480px",
      }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "640px",
          height: "480px",
          borderRadius: "12px",
          border: "2px solid white",
          objectFit: "contain",
        }}
      />

      {/* CANVAS OVERLAY */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default CameraView;