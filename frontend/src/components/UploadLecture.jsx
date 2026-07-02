import React, { useState, useRef, useCallback } from "react";
import SignPlayer from "./SignPlayer.jsx";
import { Upload, FileVideo, X, Check, Loader2, Music, Type, Wand2, Edit3, RotateCcw } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ALLOWED_EXTS = [".mp4", ".mov", ".webm"];
const MAX_SIZE_MB = 200;

const STAGES = [
  { key: "uploading", label: "Uploading", icon: Upload },
  { key: "extracting", label: "Extracting Audio", icon: Music },
  { key: "transcribing", label: "Transcribing Speech", icon: Type },
  { key: "converting", label: "Converting to ISL", icon: Wand2 },
];

export default function UploadLecture() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [editedTranscript, setEditedTranscript] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [reconverting, setReconverting] = useState(false);
  const fileRef = useRef(null);

  // --- File Validation ---
  const validateFile = (f) => {
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
    if (!ALLOWED_EXTS.includes(ext) && !ALLOWED_TYPES.includes(f.type)) {
      return `Unsupported format "${ext}". Accepted: ${ALLOWED_EXTS.join(", ")}`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large (${(f.size / (1024 * 1024)).toFixed(1)}MB). Max: ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const selectFile = (f) => {
    setError("");
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFile(f);
    setTranscript("");
    setEditedTranscript("");
    setTokens([]);
    setIsEditing(false);
  };

  // --- Handlers ---
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) selectFile(f);
  }, []);

  // --- Upload with progress (XHR) ---
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setTranscript("");
    setEditedTranscript("");
    setTokens([]);
    setStage("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.upload.onload = () => {
          setUploadProgress(100);
          setStage("extracting");
          // Simulate stage progression while server processes
          setTimeout(() => setStage("transcribing"), 2000);
          setTimeout(() => setStage("converting"), 5000);
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(json);
            } else {
              reject(new Error(json.detail || "Upload failed"));
            }
          } catch {
            reject(new Error("Invalid server response"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error. Is the backend running?"));
        xhr.ontimeout = () => reject(new Error("Request timed out. Try a shorter video."));
        xhr.timeout = 600000; // 10 min

        xhr.open("POST", `${API_BASE}/api/upload-lecture`);
        xhr.send(formData);
      });

      setTranscript(data.transcript || "");
      setEditedTranscript(data.transcript || "");
      setTokens(data.sign_tokens || []);
      setStage("done");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setStage("");
    } finally {
      setLoading(false);
    }
  };

  // --- Re-convert edited transcript ---
  const handleReconvert = async () => {
    if (!editedTranscript.trim()) return;
    setReconverting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/text-to-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedTranscript }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Conversion failed");
      }
      const data = await res.json();
      setTokens(data.tokens || []);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setReconverting(false);
    }
  };

  // --- Compute current stage index for progress ---
  const currentStageIdx = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* ═══════════════════════════════ UPLOAD ZONE ═══════════════════════════════ */}
      <div className="card p-6 md:p-8 shadow-lg border-brand-100">
        <label className="block text-sm font-bold text-brand-900 mb-4">
          Upload a Lecture Video
        </label>

        {/* Drag & Drop area */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-brand-500 bg-brand-50 scale-[1.01]"
              : file
              ? "border-emerald-200 bg-emerald-50"
              : "border-brand-200 bg-surface-base hover:border-brand-400 hover:bg-white"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-500">
                <FileVideo size={28} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-brand-900">{file.name}</p>
                <p className="text-xs text-txt-secondary mt-1">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB •{" "}
                  <span className="text-emerald-600 font-medium">Ready to upload</span>
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setTranscript("");
                  setEditedTranscript("");
                  setTokens([]);
                  setError("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-xs font-medium text-txt-muted hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <X size={12} /> Remove
              </button>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${
                dragOver ? "bg-white text-brand-600 border-brand-200" : "bg-white text-brand-400 border-brand-100"
              }`}>
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-brand-900">
                  {dragOver ? "Drop your video here!" : "Drag & drop a video file"}
                </p>
                <p className="text-xs text-txt-secondary mt-1 max-w-xs mx-auto">
                  or click to browse • MP4, MOV, WebM — Max {MAX_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {loading ? "Processing…" : "Upload & Transcribe"}
        </button>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-medium pt-0.5">{error}</p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════ PROCESSING STAGES ═══════════════════════════════ */}
      {loading && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-brand-500">⚡</span> Processing Pipeline
          </h3>

          {/* Upload progress bar */}
          {stage === "uploading" && (
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-brand-900 mb-2">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2.5 bg-surface-base rounded-full overflow-hidden border border-brand-50">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stage indicators */}
          <div className="flex items-center justify-between gap-2 relative">
             {/* Connector Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-base -z-10" />
            
            {STAGES.map((s, i) => {
              const isActive = s.key === stage;
              const isDone = currentStageIdx > i || stage === "done";
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex-1 flex flex-col items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 border-2 ${
                      isDone
                        ? "bg-emerald-50 border-emerald-500 text-emerald-600 scale-100 shadow-sm"
                        : isActive
                        ? "bg-white border-brand-500 text-brand-600 scale-110 shadow-md ring-4 ring-brand-50"
                        : "bg-surface-base border-gray-200 text-gray-300 scale-90"
                    }`}
                  >
                    {isDone ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold text-center transition-colors ${
                      isDone
                        ? "text-emerald-600"
                        : isActive
                        ? "text-brand-600"
                        : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ TRANSCRIPT ═══════════════════════════════ */}
      {transcript && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-brand-900 flex items-center gap-2">
              <span>📝</span> Transcript
            </h3>
            <button
              onClick={() => {
                if (isEditing) {
                  setEditedTranscript(transcript);
                }
                setIsEditing(!isEditing);
              }}
              className="btn-outline text-xs"
            >
              {isEditing ? "Cancel Edit" : <><Edit3 size={14} className="mr-1"/> Edit</>}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                rows={6}
                className="input-field w-full resize-y min-h-[120px] text-sm leading-relaxed"
              />
              <div className="flex items-center gap-3 bg-surface-base p-3 rounded-xl border border-brand-50">
                <button
                  onClick={handleReconvert}
                  disabled={reconverting || !editedTranscript.trim()}
                  className="btn-primary !py-2 !px-5 !text-xs shadow-sm flex items-center gap-2"
                >
                  {reconverting ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                  {reconverting ? "Converting…" : "Re-convert to ISL"}
                </button>
                <span className="text-xs text-txt-secondary">
                  Edit the transcript above and re-convert to update sign tokens
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-surface-base border border-brand-100 text-sm text-brand-900 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {transcript}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════ SIGN PLAYBACK ═══════════════════════════════ */}
      {(tokens.length > 0 || transcript) && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🤟</span> Sign Language Playback
          </h3>
          <SignPlayer tokens={tokens} />
        </div>
      )}

      {/* ═══════════════════════════════ TOKEN GRID ═══════════════════════════════ */}
      {tokens.length > 0 && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔤</span> Word Tokens
          </h3>
          <div className="flex flex-wrap gap-2">
            {tokens
              .filter((t) => t.type !== "space")
              .map((t, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    t.type === "word"
                      ? "bg-brand-50 text-brand-700 border-brand-200"
                      : "bg-surface-base text-txt-secondary border-brand-50"
                  } ${
                    t.video
                      ? ""
                      : "opacity-50 line-through decoration-brand-300"
                  }`}
                  title={
                    t.video
                      ? `Sign available: ${t.value}`
                      : `No sign found for: ${t.value}`
                  }
                >
                  {t.type === "word" ? "📖" : "🔡"} {t.value}
                  {t.video && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  )}
                </span>
              ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-txt-muted bg-surface-base p-3 rounded-lg border border-brand-50 inline-flex">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sign video available
            </span>
            <span className="flex items-center gap-1.5">
              <span>📖</span> Word sign
            </span>
            <span className="flex items-center gap-1.5">
              <span>🔡</span> Letter sign
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
