import React, { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function SignPlayer({ tokens = [] }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const activeTokens = tokens.filter(
    (t) => t && typeof t === "object" && t.type !== "space" && t.video
  );
  const token = activeTokens[current] || null;
  const videoSrc = token ? `${API_BASE}${token.video}` : "";
  const progress = activeTokens.length > 0 ? ((current + 1) / activeTokens.length) * 100 : 0;

  const goNext = useCallback(() => {
    if (current < activeTokens.length - 1) setCurrent((p) => p + 1);
    else setAutoPlay(false);
  }, [current, activeTokens.length]);

  const goPrev = () => {
    if (current > 0) setCurrent((p) => p - 1);
  };

  const reset = () => {
    setCurrent(0);
    setAutoPlay(false);
  };

  useEffect(() => {
    setCurrent(0);
    setAutoPlay(false);
  }, [tokens]);

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (autoPlay) goNext();
  };

  useEffect(() => {
    if (videoRef.current && autoPlay && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  }, [current, autoPlay, videoSrc]);

  if (activeTokens.length === 0) {
    return (
      <div className="text-center py-8 text-txt-secondary text-sm bg-surface-base rounded-2xl border border-brand-100">
        <p className="font-medium text-brand-900">🤟 No sign tokens to display.</p>
        <p className="text-xs text-txt-muted mt-1">Convert text or a video to see ISL signs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-surface-base rounded-full overflow-hidden border border-brand-50">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-txt-secondary">
          {current + 1} / {activeTokens.length}
        </span>
      </div>

      {/* Token pills */}
      <div className="flex flex-wrap gap-1.5">
        {activeTokens.map((t, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
              i === current
                ? "bg-brand-500 text-white border-brand-500 shadow-md transform scale-105"
                : i < current
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-white text-txt-secondary border-brand-100 hover:border-brand-300"
            }`}
          >
            {t.value}
          </button>
        ))}
      </div>

      {/* Video */}
      <div className="rounded-2xl overflow-hidden bg-black border border-brand-100 shadow-inner">
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          className="w-full aspect-video"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs bg-white border border-brand-100 text-txt-secondary hover:bg-brand-50 transition-colors">
          Reset
        </button>
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="px-3 py-1.5 rounded-lg text-xs bg-white border border-brand-100 text-txt-secondary hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => {
            if (videoRef.current) {
              isPlaying ? videoRef.current.pause() : videoRef.current.play().catch(() => {});
            }
          }}
          className="btn-primary !py-2 !px-6 !text-xs !rounded-lg shadow-md"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={goNext}
          disabled={current >= activeTokens.length - 1}
          className="px-3 py-1.5 rounded-lg text-xs bg-white border border-brand-100 text-txt-secondary hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            autoPlay
              ? "bg-brand-50 text-brand-600 border-brand-200"
              : "bg-white text-txt-secondary border-brand-100 hover:bg-brand-50"
          }`}
        >
          Auto {autoPlay ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
