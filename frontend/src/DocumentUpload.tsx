import React, { useState, useEffect } from "react";
import io from "socket.io-client";


const USER_ID = "456"; 
const SOCKET_URL = "http://localhost:5000"; 

export default function DocumentUpload() {
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  // 1. Listen for Real-Time Updates
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
    //   addLog("🟢 Connected to Real-time Server");
    });

    // Listen for the specific event we emitted in Inngest
    socket.on(`document-status-${USER_ID}`, (data) => {
      console.log("Received event:", data);
      if (data.status === "completed") {
        setStatus("completed");
        addLog("✅ " + data.message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // 2. Trigger the Upload
  const handleTrigger = async () => {
    setStatus("uploading");
    addLog("🔵 Uploading file...");

    try {
      // Calling your existing API route
      await fetch("http://localhost:5000/api/hello", { method: "GET" });
      
      setStatus("processing");
      addLog("🟠  Processing ...");
    } catch (error) {
      setStatus("idle");
      
      addLog("🔴 Error triggering upload");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">AI PDF Processor</h1>
          <p className="text-slate-500 text-sm">Real-time status via Inngest + Socket.io</p>
        </div>

        {/* Visual Status Indicator */}
        <div className="flex justify-center my-8">
          <div className={`
            w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500
            ${status === "idle" ? "border-slate-200 bg-slate-50" : ""}
            ${status === "uploading" ? "border-blue-400 bg-blue-50 animate-pulse" : ""}
            ${status === "processing" ? "border-amber-400 bg-amber-50 animate-spin-slow" : ""}
            ${status === "completed" ? "border-green-500 bg-green-50" : ""}
          `}>
            <span className="text-3xl font-bold">
              {status === "idle" && "📄"}
              {status === "uploading" && "⬆️"}
              {status === "processing" && "⚙️"}
              {status === "completed" && "✅"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTrigger}
          disabled={status !== "idle" && status !== "completed"}
          className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status === "idle" || status === "completed" ? "Start Upload Process" : "Processing..."}
        </button>

        {/* Real-time Logs Console */}
        <div className="bg-slate-900 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs">
          {logs.length === 0 && <span className="text-slate-600">Waiting for activity...</span>}
          {logs.map((log, i) => (
            <div key={i} className="text-green-400 mb-1 border-b border-slate-800 pb-1">
              {log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}