import React, { useState } from "react";
import SignPlayer from "./SignPlayer.jsx";
import { Loader2, Search, Play, Captions } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function YoutubeToSign() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setTokens([]);
    setCurrentVideo(null);
    try {
      const res = await fetch(`${API_BASE}/api/youtube-to-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Search failed");
      }
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (video) => {
    setTranslating(true);
    setError("");
    setCurrentVideo(video);
    try {
      const res = await fetch(`${API_BASE}/api/youtube-video-to-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: video.video_id })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Translation failed");
      }
      const data = await res.json();
      setTokens(data.sign_tokens || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setTranslating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search */}
      <div className="card p-6 md:p-8 shadow-lg border-brand-100">
        <label className="block text-sm font-bold text-brand-900 mb-2">
          Search YouTube Videos
        </label>
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" />
            <input
              className="input-field pl-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a topic (e.g., 'binary search')"
            />
          </div>
          <button 
            onClick={handleSearch} 
            disabled={loading} 
            className="btn-primary flex items-center justify-center gap-2 min-w-[120px] shadow-md"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 font-medium">⚠️ {error}</p>}
      </div>

      {/* Video Results */}
      {videos.length > 0 && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎬</span> Search Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.video_id}
                className="rounded-xl border border-brand-100 overflow-hidden bg-white hover:border-brand-300 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <h4 className="text-sm font-bold text-brand-900 line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className="text-xs text-txt-secondary line-clamp-2 flex-grow">{video.description}</p>
                  <button
                    onClick={() => handleConvert(video)}
                    disabled={translating}
                    className="btn-outline text-xs w-full justify-center mt-auto"
                  >
                    {translating && currentVideo?.video_id === video.video_id ? (
                      <Loader2 size={14} className="animate-spin mr-1" />
                    ) : (
                      <Captions size={14} className="mr-1" />
                    )}
                    Convert to Sign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded Video */}
      {currentVideo && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">▶️</span> Now Playing
          </h3>
          <div className="rounded-xl overflow-hidden shadow-lg border border-brand-100 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.video_id}`}
              className="w-full aspect-video"
              allowFullScreen
              title={currentVideo.title}
            />
          </div>
        </div>
      )}

      {/* Sign Playback */}
      <div className="card p-6 md:p-8 shadow-lg border-brand-100">
        <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🤟</span> Sign Language Playback
        </h3>
        {translating ? (
          <div className="text-center py-12 bg-surface-base rounded-2xl border border-brand-50">
            <Loader2 size={32} className="animate-spin text-brand-500 mx-auto mb-3" />
            <p className="text-sm text-brand-600 font-medium">Translating video content to sign language...</p>
          </div>
        ) : (
          <SignPlayer tokens={tokens} />
        )}
      </div>
    </div>
  );
}
