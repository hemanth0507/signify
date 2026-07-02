import React, { useState } from "react";
import SignPlayer from "./SignPlayer.jsx";
import { Loader2, Send, MessageSquare, Sparkles } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Chat request failed");
      }
      const data = await res.json();
      setAnswer(data.answer || "");
      setTokens(data.sign_tokens || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card p-6 md:p-8 shadow-lg border-brand-100">
        <label className="block text-sm font-bold text-brand-900 mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-brand-500" />
          Ask your question
        </label>
        <div className="relative">
          <textarea
            className="input-field min-h-[120px] resize-none pr-4 pb-12"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: Explain what a variable is in Python..."
          />
          <div className="absolute bottom-3 right-3">
             <button 
              onClick={handleSend} 
              disabled={loading || !message.trim()} 
              className="btn-primary !py-2 !px-4 !text-xs shadow-md flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Ask AI Tutor
            </button>
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-3 font-medium flex items-center gap-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      <div className="card p-6 md:p-8 shadow-lg border-brand-100">
        <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
          <Sparkles size={20} className="text-brand-500" />
          AI Response
        </h3>
        <div className={`p-6 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 border ${
          answer 
            ? "bg-surface-base border-brand-100 text-brand-900 shadow-inner" 
            : "bg-gray-50 text-txt-muted border-gray-100 italic"
        }`}>
          {loading ? (
            <div className="space-y-3 py-2">
              <div className="h-4 bg-brand-100/50 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-brand-100/50 rounded w-full animate-pulse" />
              <div className="h-4 bg-brand-100/50 rounded w-2/3 animate-pulse" />
            </div>
          ) : (
            answer || "Your explanation will appear here after asking a question."
          )}
        </div>
      </div>

      {(tokens.length > 0 || answer) && (
        <div className="card p-6 md:p-8 shadow-lg border-brand-100">
          <h3 className="font-display font-semibold text-lg text-brand-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🤟</span> Sign Language Playback
          </h3>
          <SignPlayer tokens={tokens} />
        </div>
      )}
    </div>
  );
}
