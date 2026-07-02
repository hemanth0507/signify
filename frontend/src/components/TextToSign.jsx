import React, { useState } from "react";
import SignPlayer from "./SignPlayer.jsx";
import { Loader2, ArrowRight } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function TextToSign() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/text-to-sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Request failed");
      }
      const data = await res.json();
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className="space-y-8">
      <div className="card p-6 md:p-8 shadow-lg max-w-3xl mx-auto border-brand-100">
        <label className="block text-sm font-bold text-brand-900 mb-2">
          Enter text to convert to ISL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input-field flex-grow"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: binary search, data structure, algorithm..."
          />
          <button 
            onClick={handleConvert} 
            disabled={loading} 
            className="btn-primary flex items-center justify-center gap-2 shadow-md sm:w-auto w-full"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            Convert
            {!loading && <ArrowRight size={18} />}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-3 font-medium flex items-center gap-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      <div className="card p-6 md:p-8 shadow-lg max-w-3xl mx-auto border-brand-100">
        <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🤟</span> Sign Language Playback
        </h3>
        <SignPlayer tokens={tokens} />
      </div>
    </div>
  );
}
